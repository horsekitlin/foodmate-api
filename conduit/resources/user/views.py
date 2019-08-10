from flask import Blueprint, json
from conduit.models.user import UserModel

blueprint = Blueprint('user', __name__)


@blueprint.route('/', methods=('GET',))
def get_users(**kwargs):
    user_list = UserModel.get_users()
    users = [u.as_dict() for u in user_list]
    print(users)
    return {
      'users': users
    }, 201
