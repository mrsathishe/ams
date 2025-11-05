from flask import Flask 
from flask_mongoengine import MongoEngine
from app.config import Config

db = MongoEngine()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    from app.routes.routes import routes_bp
    app.register_blueprint(routes_bp, url_prefix="/api")

    return app

# app = Flask(__name__)

# from app.routes import routes