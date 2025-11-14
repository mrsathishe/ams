from flask import Flask 
from flask_mongoengine import MongoEngine
from app.config import Config

db = MongoEngine()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        print('----------------------------------------------------------------')
        if db.connection:
            # --- THIS IS THE CORRECTED LINE ---
            actual_db_name = db.connection.name
            print(f"DEBUG: MongoEngine connected to database: {actual_db_name}")
            # --- END CORRECTED LINE ---
        else:
            print("DEBUG: MongoEngine connection not established.")
        print('----------------------------------------------------------------')

    from app.routes.routes import routes_bp
    app.register_blueprint(routes_bp, url_prefix="/api")

    return app