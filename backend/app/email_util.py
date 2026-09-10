import os
import smtplib
from email.mime.text import MIMEText

FRONTEND_RESET_URL = os.getenv("FRONTEND_RESET_URL", "https://bacbok.com/reset-password")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_reset_email(to_email: str, token: str) -> None:
    reset_link = f"{FRONTEND_RESET_URL}?token={token}"

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        # No email service configured yet (no SMTP_* env vars set on Render).
        # Prints the link so you can test the flow manually until email is wired up.
        print(f"[DEV MODE] Password reset link for {to_email}: {reset_link}")
        return

    message = MIMEText(f"Click the link to reset your password: {reset_link}")
    message["Subject"] = "Reset your Bacbok password"
    message["From"] = SMTP_USER
    message["To"] = to_email

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, message.as_string())
