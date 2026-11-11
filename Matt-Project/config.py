"""App configuration. Secrets come from environment variables (or a local .env file), never from git."""
import os

from dotenv import load_dotenv

load_dotenv()  # reads .env if present; .env is git-ignored


def _normalize_db_url(url: str) -> str:
    """Neon gives 'postgresql://...'; SQLAlchemy needs the psycopg 3 driver named explicitly."""
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://"):]
    return url


_db_url = _normalize_db_url(os.environ.get("DATABASE_URL", "sqlite:///matt_dev.db"))


class Config:
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Neon suspends idle compute on the free tier: test connections before use and recycle them.
    SQLALCHEMY_ENGINE_OPTIONS = (
        {} if _db_url.startswith("sqlite") else {"pool_pre_ping": True, "pool_recycle": 300}
    )
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-me")
    # There is no login yet; this stands in for the signed-in user in the page header.
    DEMO_USER = os.environ.get("DEMO_USER", "student1")
