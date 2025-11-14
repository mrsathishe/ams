# from app import app
from flask import request, Blueprint
from app.services import refresh_service, login_service, user_service, logout_service, register_service

routes_bp = Blueprint("routes_bp", __name__)

@routes_bp.route('/register', methods=['POST'])
def register():
    return register_service.register_user(request.get_json())

@routes_bp.route('/login', methods=['POST'])
def login():
    return login_service.login_user(request.get_json())

@routes_bp.route('/user', methods=['GET'])
def user():
    return user_service.get_user_details()

@routes_bp.route('/logout', methods=['POST'])
def logout():
    return logout_service.logout_user()

@routes_bp.route('/refresh', methods=['POST'])
def refresh_tokens():
    return refresh_service.refresh_user_tokens()