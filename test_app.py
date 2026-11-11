"""Replaces the old tests/test_app.py (which imported the module-level `app`)."""


def test_pages_render(client):
    for path in ["/", "/assessment", "/task-wheel", "/opfor"]:
        assert client.get(path).status_code == 200


def test_tasks_tree_shape(client):
    data = client.get("/api/tasks").get_json()
    assert [t["id"] for t in data] == ["CT1", "CT2", "CT3", "CT4", "CT5", "CT7"]
    ct1 = data[0]
    assert ct1["children"][0]["id"] == "CT1.1"
    assert ct1["children"][0]["children"][0]["id"] == "CT1.1.P1"
    assert "children" not in ct1["children"][0]["children"][0]  # leaves have no children key


def test_injects_unfiltered(client):
    assert len(client.get("/api/injects").get_json()) == 5


def test_injects_filters(client):
    white = client.get("/api/injects?type=white").get_json()
    assert [i["id"] for i in white] == ["INJ-005"]
    day1 = client.get("/api/injects?day=1").get_json()
    assert [i["id"] for i in day1] == ["INJ-004"]
    team_a = client.get("/api/injects?team=Blue Team A").get_json()
    assert {i["id"] for i in team_a} == {"INJ-001", "INJ-002"}
    assert client.get("/api/injects?day=abc").get_json() == []


def test_inject_fields_match_old_api(client):
    inject = client.get("/api/injects").get_json()[0]
    assert set(inject) == {"id", "title", "type", "day", "team", "status", "priority", "description"}
    assert isinstance(inject["team"], str)


def test_assessment_counts_computed_from_evaluations(client):
    data = client.get("/api/assessment").get_json()
    assert [t["name"] for t in data] == ["CAPSTONE_COURSE"]
    cats = data[0]["categories"]
    assert cats["IDENTIFY"] == [0, 0, 0, 0, 0]
    # CT1 leaves: P1 complete (green), P5 in-progress (amber), E1 unscored
    assert cats["Core Task 1"] == [1, 0, 0, 1, 1]
    # CT2 has 6 groups x 4 checkpoints, all unscored
    assert cats["Core Task 2"] == [0, 0, 0, 0, 24]


def test_seed_is_idempotent(app):
    from seed import seed_database
    assert seed_database() is False
