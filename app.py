"""MATT-inspired training dashboard prototype. Not affiliated with the original MATT product."""
from flask import Flask, jsonify, render_template, request

import queries
from config import Config
from extensions import db, migrate
from seed import register_cli


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    migrate.init_app(app, db)
    register_cli(app)

    @app.context_processor
    def inject_globals():
        return {"event": queries.event_context(app.config["DEMO_USER"])}

    @app.get("/")
    def home():
        return render_template("home.html", active="home")

    @app.get("/assessment")
    def assessment():
        event = queries.current_event()
        return render_template("assessment.html", active="assessment",
                               teams=queries.assessment_data(event),
                               core_tasks=queries.core_task_names(event))

    @app.get("/task-wheel")
    def task_wheel():
        return render_template("wheel.html", active="wheel")

    @app.get("/opfor")
    def opfor():
        return render_template("opfor.html", active="opfor")

    @app.get("/api/tasks")
    def api_tasks():
        return jsonify(queries.task_tree(queries.current_event()))

    @app.get("/api/injects")
    def api_injects():
        return jsonify(queries.inject_list(
            queries.current_event(),
            inject_type=request.args.get("type", "all").lower(),
            day=request.args.get("day", "all"),
            team=request.args.get("team", "all"),
        ))

    @app.get("/api/assessment")
    def api_assessment():
        return jsonify(queries.assessment_data(queries.current_event()))

    return app


if __name__ == "__main__":
    create_app().run(debug=True)
