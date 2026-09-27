from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.model import Post, PostImage, PostReaction, User, Comment
from sqlalchemy import func as sql_func
from app import schemas
from app.deps import get_current_user

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("", response_model=schemas.PostResponse, status_code=201)
def create_post(
    payload: schemas.PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = Post(
        user_id=current_user.id,
        text=payload.text,
    )
    for i, url in enumerate(payload.image_urls[:4]):
        post.images.append(PostImage(image_url=url, position=i))

    db.add(post)
    db.commit()
    db.refresh(post)

    post_dict = {
        "id": post.id,
        "text": post.text,
        "created_at": post.created_at,
        "author": schemas.PostAuthor.model_validate(current_user),
        "images": [schemas.PostImageResponse.model_validate(img) for img in post.images],
        "reactions": [],
        "my_reaction": None,
        "comment_count": 0,
    }
    return schemas.PostResponse.model_validate(post_dict)

@router.post("/{post_id}/react", status_code=200)
def react_to_post(
    post_id: int,
    payload: schemas.ReactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(PostReaction)
        .filter(PostReaction.post_id == post_id, PostReaction.user_id == current_user.id)
        .first()
    )

    if existing and existing.reaction_type == payload.reaction_type:
        db.delete(existing)
        db.commit()
        return {"status": "removed"}

    if existing:
        existing.reaction_type = payload.reaction_type
        db.commit()
        return {"status": "updated", "reaction_type": payload.reaction_type}

    new_reaction = PostReaction(
        post_id=post_id,
        user_id=current_user.id,
        reaction_type=payload.reaction_type,
    )
    db.add(new_reaction)
    db.commit()
    return {"status": "added", "reaction_type": payload.reaction_type}

@router.get("", response_model=list[schemas.PostResponse])
def get_feed(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    posts = (
        db.query(Post)
        .options(
            joinedload(Post.author),
            joinedload(Post.images),
            joinedload(Post.reactions),
            joinedload(Post.comments),
        )
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for post in posts:
        counts = {}
        my_reaction = None
        for r in post.reactions:
            counts[r.reaction_type] = counts.get(r.reaction_type, 0) + 1    
            if r.user_id == current_user.id:
                my_reaction = r.reaction_type

        post_dict = {
            "id": post.id,
            "text": post.text,
            "created_at": post.created_at,
            "author": schemas.PostAuthor.model_validate(post.author),
            "images": [schemas.PostImageResponse.model_validate(img) for img in post.images],
            "reactions": [{"reaction_type": k, "count": v} for k, v in counts.items()],
            "my_reaction": my_reaction,
            "comment_count": len(post.comments),
        }
        result.append(schemas.PostResponse.model_validate(post_dict))

    return result
 

@router.post("/{post_id}/comments", response_model=schemas.CommentResponse, status_code=201)
def create_comment(
    post_id: int,
    payload: schemas.CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Comment text cannot be empty")

    comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        text=payload.text.strip(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return schemas.CommentResponse.model_validate(
        {
            "id": comment.id,
            "text": comment.text,
            "created_at": comment.created_at,
            "author": schemas.PostAuthor.model_validate(current_user),
        }
    )


@router.get("/{post_id}/comments", response_model=list[schemas.CommentResponse])
def get_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [schemas.CommentResponse.model_validate(c) for c in comments]