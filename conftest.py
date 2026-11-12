import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app  # noqa: E402
from extensions import db  # noqa: E402
from seed import seed_database  # noqa: E402


@pytest.fixture()
def app():
    # In-memory SQLite: tests never touch Neon and need no network.
    app = create_app({"TESTING": True, "SQLALCHEMY_DATABASE_URI": "sqlite://",
                      "SQLALCHEMY_ENGINE_OPTIONS": {}})
    with app.app_context():
        db.create_all()
        seed_database()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()
