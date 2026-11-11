"""MATT-inspired training dashboard prototype. Not affiliated with the original MATT product."""
from flask import Flask, jsonify, render_template, request
from data import EVENT, TEAMS, TASKS, INJECTS, CORE_TASKS

app = Flask(__name__)


@app.context_processor
def inject_globals():
    return {"event": EVENT}


@app.get("/")
def home():
    return render_template("home.html", active="home")


@app.get("/assessment")
def assessment():
    return render_template("assessment.html", active="assessment", teams=TEAMS, core_tasks=CORE_TASKS)


@app.get("/task-wheel")
def task_wheel():
    return render_template("wheel.html", active="wheel")


@app.get("/opfor")
def opfor():
    return render_template("opfor.html", active="opfor")


@app.get("/api/tasks")
def api_tasks():
    return jsonify(TASKS)


@app.get("/api/injects")
def api_injects():
    inject_type = request.args.get("type", "all").lower()
    day = request.args.get("day", "all")
    team = request.args.get("team", "all")
    filtered = [item for item in INJECTS
                if (inject_type == "all" or item["type"].lower() == inject_type)
                and (day == "all" or str(item["day"]) == day)
                and (team == "all" or item["team"] == team)]
    return jsonify(filtered)


@app.get("/api/assessment")
def api_assessment():
    return jsonify(TEAMS)


if __name__ == "__main__":
    app.run(debug=True)
