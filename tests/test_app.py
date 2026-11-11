import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app  # noqa: E402


@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()


@pytest.mark.parametrize("path", ["/", "/assessment", "/task-wheel", "/opfor"])
def test_pages_load(client, path):
    assert client.get(path).status_code == 200


def test_api_tasks(client):
    data = client.get("/api/tasks").get_json()
    assert data and all("children" in t for t in data)


def test_api_assessment(client):
    assert client.get("/api/assessment").get_json()[0]["name"] == "CAPSTONE_COURSE"


def test_api_injects_filter(client):
    data = client.get("/api/injects?type=white").get_json()
    assert data and all(i["type"] == "white" for i in data)
    data = client.get("/api/injects?team=Blue Team A&day=2").get_json()
    assert all(i["team"] == "Blue Team A" and i["day"] == 2 for i in data)
