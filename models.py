"""Database models.

The task hierarchy is a generic self-referencing tree (Node) so teams can define their own
levels and labels instead of being locked to fixed DoD terms (METL / MET / MSEL).
Stick to portable column types so the same models work on Neon (Postgres) and SQLite (tests).
"""
from datetime import datetime, timezone

from extensions import db


def utcnow():
    return datetime.now(timezone.utc)


# Which teams an assessor may see and edit (used for team-based permissions).
assessor_teams = db.Table(
    "assessor_teams",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("team_id", db.Integer, db.ForeignKey("teams.id"), primary_key=True),
)


class Event(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    day = db.Column(db.Integer, nullable=False, default=1)
    classification = db.Column(db.String(40), nullable=False, default="UNCLASSIFIED")


class Team(db.Model):
    __tablename__ = "teams"
    __table_args__ = (db.UniqueConstraint("event_id", "name", name="uq_team_event_name"),)
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    # assessor | oc (observer/controller) | lead | admin
    role = db.Column(db.String(20), nullable=False, default="assessor")
    teams = db.relationship("Team", secondary=assessor_teams, backref="assessors")
    # Password/auth fields are intentionally not here yet. Add them with the auth step.


class Node(db.Model):
    """One item in the task hierarchy (core task -> task group -> checkpoint, or whatever the team defines)."""
    __tablename__ = "nodes"
    __table_args__ = (db.UniqueConstraint("event_id", "code", name="uq_node_event_code"),)
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False, index=True)
    parent_id = db.Column(db.Integer, db.ForeignKey("nodes.id"), index=True)
    code = db.Column(db.String(40), nullable=False)        # stable human ID, e.g. "CT1.1.P5"
    name = db.Column(db.String(255), nullable=False)
    node_type = db.Column(db.String(40), nullable=False, default="task")  # team-defined label
    status = db.Column(db.String(20), nullable=False, default="unscored")  # demo status shown on the wheel
    position = db.Column(db.Integer, nullable=False, default=0)            # sibling order

    children = db.relationship(
        "Node", back_populates="parent", order_by="Node.position", cascade="all, delete-orphan"
    )
    parent = db.relationship("Node", back_populates="children", remote_side=[id])


class Evaluation(db.Model):
    """An assessor's entry for one measure (Node) for one team."""
    __tablename__ = "evaluations"
    __table_args__ = (db.UniqueConstraint("node_id", "team_id", name="uq_eval_node_team"),)
    id = db.Column(db.Integer, primary_key=True)
    node_id = db.Column(db.Integer, db.ForeignKey("nodes.id"), nullable=False, index=True)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False, default="not-started")  # workflow state
    rating = db.Column(db.String(20), nullable=False, default="unscored")     # green|blue|red|amber|unscored
    comment = db.Column(db.Text)                                               # what the assessor wrote
    updated_by_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    node = db.relationship("Node")
    team = db.relationship("Team")


class Inject(db.Model):
    __tablename__ = "injects"
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False, index=True)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False, index=True)
    code = db.Column(db.String(40), nullable=False, unique=True)  # e.g. "INJ-001"
    title = db.Column(db.String(255), nullable=False)
    inject_type = db.Column(db.String(20), nullable=False)        # red | white
    day = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="not-started")  # not-started|running|stopped
    priority = db.Column(db.String(20), nullable=False, default="Medium")
    description = db.Column(db.Text)

    team = db.relationship("Team")
