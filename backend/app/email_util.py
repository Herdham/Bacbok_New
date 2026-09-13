import os
import requests

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "Bacbok <noreply@bacbok.com>")
FRONTEND_RESET_URL = os.getenv("FRONTEND_RESET_URL", "https://bacbok.com/reset-password")


def _send(to_email: str, subject: str, body: str) -> None:
    if not RESEND_API_KEY:
        # No email service configured yet — print instead so you can test the flow.
        print(f"[DEV MODE] Email to {to_email} — {subject}\n{body}")
        return

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
            json={
                "from": FROM_EMAIL,
                "to": [to_email],
                "subject": subject,
                "text": body,
            },
            timeout=10,
        )
        if response.status_code >= 400:
            print(f"[EMAIL ERROR] Resend rejected the request ({response.status_code}): {response.text}")
    except Exception as e:
        # Never let a slow/broken email service block or crash the request that triggered it.
        print(f"[EMAIL ERROR] Failed to send to {to_email}: {e}")


def send_reset_email(to_email: str, token: str) -> None:
    reset_link = f"{FRONTEND_RESET_URL}?token={token}"
    _send(
        to_email,
        "Reset your Bacbok password",
        f"Click the link to reset your password: {reset_link}",
    )


def send_verification_email(to_email: str, code: str) -> None:
    _send(
        to_email,
        "Your Bacbok verification code",
        f"Your verification code is: {code}\n\nThis code expires in 15 minutes.",
    )
