from flask import Flask
from conduit.settings import ProdConfig
from conduit.extensions import cors
from conduit.resources import user

def register_blueprints(app):
    """Register Flask blueprints."""
    origins = app.config.get('CORS_ORIGIN_WHITELIST', '*')
    cors.init_app(user.views.blueprint, origins=origins)
    # cors.init_app(profile.views.blueprint, origins=origins)
    # cors.init_app(articles.views.blueprint, origins=origins)

    app.register_blueprint(user.views.blueprint, url_prefix='/api/users')
    # app.register_blueprint(profile.views.blueprint)
    # app.register_blueprint(articles.views.blueprint)

def create_app(config_object=ProdConfig):
  app = Flask(__name__.split('.')[0])
  register_blueprints(app)
  return app
