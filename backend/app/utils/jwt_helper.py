"""
JWT Helper for token generation and validation
Uses simple JWT implementation that doesn't require external libraries
"""
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from app.utils.simple_jwt import SimpleJWTHelper


class JWTHelper:
    """JWT token management class using simple JWT implementation"""
    
    @staticmethod
    def generate_access_token(user_id, email, role='user'):
        """Generate JWT access token"""
        return SimpleJWTHelper.generate_access_token(user_id, email, role)
    
    @staticmethod
    def generate_refresh_token(user_id, email):
        """Generate JWT refresh token"""
        return SimpleJWTHelper.generate_refresh_token(user_id, email)
    
    @staticmethod
    def decode_token(token):
        """Decode and validate JWT token"""
        return SimpleJWTHelper.decode_token(token)
    
    @staticmethod
    def validate_access_token(token):
        """Validate access token and return user data"""
        return SimpleJWTHelper.validate_access_token(token)
    
    @staticmethod
    def validate_refresh_token(token):
        """Validate refresh token"""
        return SimpleJWTHelper.validate_refresh_token(token)
    
    @staticmethod
    def extract_token_from_header(auth_header):
        """Extract token from Authorization header"""
        return SimpleJWTHelper.extract_token_from_header(auth_header)


def jwt_required(f):
    """
    Decorator to require JWT authentication for routes
    
    Usage:
        @jwt_required
        def protected_route():
            # Access current_user here
            pass
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        token = JWTHelper.extract_token_from_header(auth_header)
        
        if not token:
            return jsonify({
                'message': 'Authorization token required',
                'status': 'FAILURE'
            }), 401
        
        # Validate token
        user_data = JWTHelper.validate_access_token(token)
        if not user_data:
            return jsonify({
                'message': 'Invalid or expired token',
                'status': 'FAILURE'
            }), 401
        
        # Add user data to request context
        request.current_user = user_data
        
        return f(*args, **kwargs)
    
    return decorated


def admin_required(f):
    """
    Decorator to require admin role
    
    Usage:
        @admin_required
        def admin_only_route():
            pass
    """
    @wraps(f)
    @jwt_required
    def decorated(*args, **kwargs):
        if request.current_user.get('role') != 'admin':
            return jsonify({
                'message': 'Admin access required',
                'status': 'FAILURE'
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated


# Helper functions for easy token generation
def generate_tokens_for_user(user):
    """
    Generate both access and refresh tokens for a user
    
    Args:
        user: User model instance
        
    Returns:
        dict: Contains access_token and refresh_token
    """
    access_token = JWTHelper.generate_access_token(
        user_id=user.user_id,
        email=user.email,
        role=user.role
    )
    
    refresh_token = JWTHelper.generate_refresh_token(
        user_id=user.user_id,
        email=user.email
    )
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'Bearer',
        'expires_in': 86400  # 24 hours in seconds
    }


def get_current_user():
    """
    Get current authenticated user from request context
    
    Returns:
        dict: User data if authenticated
        None: If not authenticated
    """
    return getattr(request, 'current_user', None)