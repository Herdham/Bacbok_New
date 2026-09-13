import os
import smtplib
from email.mime.text import MIMEText

FRONTEND_RESET_URL = os.getenv("FRONTEND_RESET_URL", "https://bacbok.com/reset-password")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def _send(to_email: str, subject: str, body: str) -> None:
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        # No email service configured yet — print instead so you can test the flow.
        print(f"[DEV MODE] Email to {to_email} — {subject}\n{body}")
        return

    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = SMTP_USER
    message["To"] = to_email

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, message.as_string())


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
