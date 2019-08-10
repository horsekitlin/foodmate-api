from flask import Flask
from conduit.settings import ProdConfig
from conduit.extensions import cors, db, bcrypt
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

def register_extensions(app):
    """Register Flask extensions."""
    bcrypt.init_app(app)
    # cache.init_app(app)
    db.init_app(app)
    # migrate.init_app(app, db)
    # jwt.init_app(app)

def create_app(config_object=ProdConfig):
  app = Flask(__name__.split('.')[0])
  app.config.from_object(config_object)
  register_blueprints(app)
  register_extensions((app))
  return app
