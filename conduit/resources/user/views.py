from flask import Blueprint

blueprint = Blueprint('user', __name__)

@blueprint.route('/', methods=('GET',))
def get_users(**kwargs):
    return 'Hello users'