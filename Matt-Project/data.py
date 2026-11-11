"""Editable demonstration data. Replace with database queries when ready."""
EVENT = {"name": "Capstone Course", "day": 2, "classification": "UNCLASSIFIED", "user": "student1"}
CORE_TASKS = ["Core Task 1", "Core Task 2", "Core Task 3", "Core Task 4", "Core Task 5", "Core Task 7"]

# For each category: green, blue, red, amber, unscored (example counts).
TEAMS = [
    {"name": "CAPSTONE_COURSE", "categories": {
        "IDENTIFY": [0, 0, 0, 0, 0], "PROTECT": [0, 0, 0, 0, 0],
        "DETECT": [0, 0, 0, 0, 0], "RESPOND": [0, 0, 0, 0, 0],
        "RECOVER": [0, 0, 0, 0, 0],
        "Core Task 1": [1, 0, 0, 2, 3], "Core Task 2": [0, 0, 0, 33, 33],
        "Core Task 3": [0, 0, 0, 22, 22], "Core Task 4": [0, 0, 0, 8, 8],
        "Core Task 5": [0, 0, 0, 17, 17], "Core Task 7": [0, 0, 0, 6, 6]
    }}
]

# Hierarchy powers the wheel: core task -> subtask -> checkpoints.
TASKS = [
    {"id": "CT1", "name": "Core Task 1", "status": "in-progress", "children": [
        {"id": "CT1.1", "name": "Prepare network operations", "status": "in-progress", "children": [
            {"id": "CT1.1.P1", "name": "Verify required authority to operate on the network", "status": "complete"},
            {"id": "CT1.1.P5", "name": "Validate network access and permissions", "status": "in-progress"}]},
        {"id": "CT1.2", "name": "Verify operational readiness", "status": "unscored", "children": [
            {"id": "CT1.2.E1", "name": "Record exercise evidence", "status": "unscored"}]}]},
    {"id": "CT2", "name": "Core Task 2", "status": "unscored", "children": [
        {"id": f"CT2.{i}", "name": f"Task group {i}", "status": "unscored", "children": [
            {"id": f"CT2.{i}.P{j}", "name": f"Checkpoint {j} in group {i}", "status": "unscored"} for j in range(1, 5)]} for i in range(1, 7)]},
    {"id": "CT3", "name": "Core Task 3", "status": "unscored", "children": [
        {"id": f"CT3.{i}", "name": f"Task group {i}", "status": "unscored", "children": [
            {"id": f"CT3.{i}.P{j}", "name": f"Checkpoint {j} in group {i}", "status": "unscored"} for j in range(1, 5)]} for i in range(1, 6)]},
    {"id": "CT4", "name": "Core Task 4", "status": "unscored", "children": [
        {"id": f"CT4.{i}", "name": f"Task group {i}", "status": "unscored", "children": [
            {"id": f"CT4.{i}.P{j}", "name": f"Checkpoint {j} in group {i}", "status": "unscored"} for j in range(1, 4)]} for i in range(1, 7)]},
    {"id": "CT5", "name": "Core Task 5", "status": "unscored", "children": [
        {"id": f"CT5.{i}", "name": f"Task group {i}", "status": "unscored", "children": [
            {"id": f"CT5.{i}.P{j}", "name": f"Checkpoint {j} in group {i}", "status": "unscored"} for j in range(1, 4)]} for i in range(1, 6)]},
    {"id": "CT7", "name": "Core Task 7", "status": "unscored", "children": [
        {"id": f"CT7.{i}", "name": f"Task group {i}", "status": "unscored", "children": [
            {"id": f"CT7.{i}.P{j}", "name": f"Checkpoint {j} in group {i}", "status": "unscored"} for j in range(1, 3)]} for i in range(1, 5)]}
]

INJECTS = [
    {"id": "INJ-001", "title": "Suspicious authentication activity", "type": "red", "day": 2,
     "team": "Blue Team A", "status": "not-started", "priority": "High", "description": "Investigate a training alert describing repeated authentication failures."},
    {"id": "INJ-002", "title": "Unusual outbound traffic", "type": "red", "day": 2,
     "team": "Blue Team A", "status": "running", "priority": "Medium", "description": "Review simulated network telemetry for an anomalous outbound connection."},
    {"id": "INJ-003", "title": "Phishing report triage", "type": "red", "day": 2,
     "team": "Blue Team B", "status": "stopped", "priority": "Low", "description": "Close out a reported simulated phishing email."},
    {"id": "INJ-004", "title": "Service access review", "type": "red", "day": 1,
     "team": "Blue Team B", "status": "not-started", "priority": "Medium", "description": "Inspect access logs for the training service."},
    {"id": "INJ-005", "title": "Recovery communications", "type": "white", "day": 2,
     "team": "Blue Team B", "status": "running", "priority": "Low", "description": "Practice incident communication procedures."}
]
