# from app import app
from flask import request, Blueprint, jsonify
from app.services import refresh_service, login_service, user_service, logout_service, register_service, update_password_service, apartment_service
from app.utils.jwt_helper import jwt_required, admin_required

routes_bp = Blueprint("routes_bp", __name__)

@routes_bp.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@routes_bp.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return jsonify({'status': 'ok'}), 200

# Public routes (no authentication required)
@routes_bp.route('/register', methods=['POST'])
def register():
    return register_service.register_user(request.get_json())

@routes_bp.route('/login', methods=['POST'])
def login():
    return login_service.login_user(request.get_json())

@routes_bp.route('/refresh', methods=['POST'])
def refresh_tokens():
    return refresh_service.refresh_user_tokens()

# Public apartment routes (for registration flow)
@routes_bp.route('/apartments', methods=['GET'])
def get_apartments():
    search = request.args.get('search')
    zipcode = request.args.get('zipcode')
    return apartment_service.get_apartments(search=search, zipcode=zipcode)

@routes_bp.route('/apartments/<apartment_id>/buildings', methods=['GET'])
def get_buildings_by_apartment(apartment_id):
    return apartment_service.get_buildings_by_apartment(apartment_id)

# Protected routes (JWT authentication required)
@routes_bp.route('/user', methods=['GET'])
@jwt_required
def user():
    return user_service.get_user_details()

@routes_bp.route('/logout', methods=['POST'])
@jwt_required
def logout():
    return logout_service.logout_user()

@routes_bp.route('/updatePassword', methods=['POST'])
@jwt_required
def update_password():
    return update_password_service.update_password(request.get_json())

# Admin-only routes (admin role required)
@routes_bp.route('/admin/users', methods=['GET'])
@admin_required
def admin_get_users():
    # This would be an admin-only endpoint to list all users
    return jsonify({
        'message': 'Admin users endpoint - would list all users',
        'status': 'SUCCESS'
    }), 200

# Health check endpoint
@routes_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'SUCCESS',
        'message': 'API is healthy',
        'version': '1.0.0'
    }), 200