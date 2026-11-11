"""Fill the database with synthetic demo data. Run with: flask seed  (add --reset to wipe first)."""
import click

from extensions import db
from models import Evaluation, Event, Inject, Node, Team, User, assessor_teams
import seed_data

# Old wheel status -> (evaluation workflow status, rating)
_STATUS_TO_EVAL = {
    "complete": ("complete", "green"),
    "in-progress": ("in-progress", "amber"),
    "unscored": ("not-started", "unscored"),
}


def _clear_all():
    """Delete every row (children before parents). Keeps the tables and migration history."""
    db.session.execute(assessor_teams.delete())
    for model in (Evaluation, Inject, Node, User, Team, Event):
        db.session.query(model).delete()
    db.session.commit()


def _add_nodes(event, items, parent=None, depth=0, leaves=None):
    labels = ["core_task", "task_group", "checkpoint"]
    for position, item in enumerate(items):
        node = Node(
            event_id=event.id, parent=parent, code=item["id"], name=item["name"],
            node_type=labels[min(depth, len(labels) - 1)], status=item["status"], position=position,
        )
        db.session.add(node)
        children = item.get("children")
        if children:
            _add_nodes(event, children, node, depth + 1, leaves)
        elif leaves is not None:
            leaves.append((node, item["status"]))


def seed_database(reset=False):
    """Returns True if data was written, False if the database already had data."""
    if Event.query.first() is not None:
        if not reset:
            return False
        _clear_all()

    event = Event(**seed_data.EVENT)
    db.session.add(event)
    db.session.flush()

    teams = {}
    for name in [seed_data.ASSESSED_TEAM, *seed_data.TRAINING_TEAMS]:
        teams[name] = Team(event_id=event.id, name=name)
        db.session.add(teams[name])

    user = User(**seed_data.DEMO_USER)
    user.teams.append(teams[seed_data.ASSESSED_TEAM])
    db.session.add(user)

    leaves = []
    _add_nodes(event, seed_data.TASKS, leaves=leaves)
    db.session.flush()

    for node, status in leaves:
        workflow, rating = _STATUS_TO_EVAL[status]
        db.session.add(Evaluation(node_id=node.id, team_id=teams[seed_data.ASSESSED_TEAM].id,
                                  status=workflow, rating=rating))

    for item in seed_data.INJECTS:
        db.session.add(Inject(
            event_id=event.id, team_id=teams[item["team"]].id, code=item["id"], title=item["title"],
            inject_type=item["type"], day=item["day"], status=item["status"],
            priority=item["priority"], description=item["description"],
        ))
    db.session.commit()
    return True


def register_cli(app):
    @app.cli.command("seed")
    @click.option("--reset", is_flag=True, help="Delete ALL existing rows first.")
    def seed_command(reset):
        """Load synthetic demo data into the configured database."""
        target = db.engine.url.render_as_string(hide_password=True)
        click.echo(f"Database: {target}")
        if reset:
            click.confirm("--reset deletes ALL data in this database. Continue?", abort=True)
        if seed_database(reset=reset):
            click.echo("Seeded demo data.")
        else:
            click.echo("Database already has data; nothing changed. Use --reset to replace it.")
