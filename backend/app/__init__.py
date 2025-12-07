from flask import Flask 
from flask_mongoengine import MongoEngine
from app.config import Config

db = MongoEngine()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Add CORS headers manually
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
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
    
    # Register CLI commands
    from app.commands import register_commands
    register_commands(app)

    return app