"""Read-side helpers that shape database rows into the JSON the frontend already expects."""
from extensions import db
from models import Event, Evaluation, Inject, Node, Team

RATINGS = ["green", "blue", "red", "amber", "unscored"]
# Placeholder categories kept so the Assessment page layout is unchanged; they show zeros until
# the team decides how categories map onto the hierarchy.
CATEGORIES = ["IDENTIFY", "PROTECT", "DETECT", "RESPOND", "RECOVER"]


def current_event():
    """The single active event (the app only handles one for now)."""
    return Event.query.order_by(Event.id).first()


def event_context(demo_user):
    event = current_event()
    if event is None:  # empty database: run `flask seed`
        return {"name": "No event (run: flask seed)", "day": 1, "classification": "UNCLASSIFIED", "user": demo_user}
    return {"name": event.name, "day": event.day, "classification": event.classification, "user": demo_user}


def task_tree(event):
    """Nested tasks, same shape as the old TASKS list. One query, tree built in Python."""
    if event is None:
        return []
    nodes = Node.query.filter_by(event_id=event.id).order_by(Node.position).all()
    items = {n.id: {"id": n.code, "name": n.name, "status": n.status} for n in nodes}
    roots = []
    for n in nodes:
        item = items[n.id]
        if n.parent_id is None:
            roots.append(item)
        else:
            items[n.parent_id].setdefault("children", []).append(item)
    return roots


def core_task_names(event):
    if event is None:
        return []
    roots = Node.query.filter_by(event_id=event.id, parent_id=None).order_by(Node.position).all()
    return [n.name for n in roots]


def assessment_data(event):
    """Per team, per category: [green, blue, red, amber, unscored] counts, computed from evaluations.

    Only teams that have at least one evaluation are returned.
    """
    if event is None:
        return []
    nodes = Node.query.filter_by(event_id=event.id).order_by(Node.position).all()
    by_id = {n.id: n for n in nodes}

    def top_name(node):
        while node.parent_id is not None:
            node = by_id[node.parent_id]
        return node.name

    core_names = core_task_names(event)
    evals = (Evaluation.query.join(Node, Evaluation.node_id == Node.id)
             .filter(Node.event_id == event.id).all())

    per_team = {}
    for ev in evals:
        counts = per_team.setdefault(ev.team_id, {})
        row = counts.setdefault(top_name(by_id[ev.node_id]), [0] * len(RATINGS))
        rating = ev.rating if ev.rating in RATINGS else "unscored"
        row[RATINGS.index(rating)] += 1

    result = []
    for team in Team.query.filter(Team.id.in_(per_team.keys())).order_by(Team.name).all():
        categories = {name: [0] * len(RATINGS) for name in CATEGORIES}
        for name in core_names:
            categories[name] = per_team[team.id].get(name, [0] * len(RATINGS))
        result.append({"name": team.name, "categories": categories})
    return result


def inject_list(event, inject_type="all", day="all", team="all"):
    """Filtered injects, same fields and filter behavior as the old /api/injects."""
    if event is None:
        return []
    if day != "all" and not str(day).isdigit():
        return []
    query = Inject.query.join(Team, Inject.team_id == Team.id).filter(Inject.event_id == event.id)
    if inject_type != "all":
        query = query.filter(db.func.lower(Inject.inject_type) == inject_type)
    if day != "all":
        query = query.filter(Inject.day == int(day))
    if team != "all":
        query = query.filter(Team.name == team)
    return [
        {"id": i.code, "title": i.title, "type": i.inject_type, "day": i.day, "team": i.team.name,
         "status": i.status, "priority": i.priority, "description": i.description}
        for i in query.order_by(Inject.code).all()
    ]
