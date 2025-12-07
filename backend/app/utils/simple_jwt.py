"""
Simple JWT implementation without external dependencies
Uses base64 encoding and HMAC for signature
"""
import base64
import json
import hashlib
import hmac
from datetime import datetime, timedelta
import os

class SimpleJWT:
    """Simple JWT implementation using HMAC-SHA256"""
    
    @staticmethod
    def base64_url_encode(data):
        """Base64 URL-safe encode"""
        if isinstance(data, str):
            data = data.encode('utf-8')
        elif isinstance(data, dict):
            data = json.dumps(data, separators=(',', ':')).encode('utf-8')
        
        encoded = base64.urlsafe_b64encode(data).decode('utf-8')
        return encoded.rstrip('=')  # Remove padding
    
    @staticmethod
    def base64_url_decode(data):
        """Base64 URL-safe decode"""
        # Add padding if needed
        padding = 4 - len(data) % 4
        if padding != 4:
            data += '=' * padding
        
        try:
            decoded = base64.urlsafe_b64decode(data)
            return json.loads(decoded.decode('utf-8'))
        except:
            return None
    
    @staticmethod
    def get_secret():
        """Get JWT secret key"""
        return os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production').encode('utf-8')
    
    @staticmethod
    def create_signature(header_b64, payload_b64, secret):
        """Create HMAC signature"""
        message = f"{header_b64}.{payload_b64}".encode('utf-8')
        signature = hmac.new(secret, message, hashlib.sha256).digest()
        return SimpleJWT.base64_url_encode(signature)
    
    @staticmethod
    def generate_token(payload):
        """Generate JWT token"""
        # Header
        header = {
            "alg": "HS256",
            "typ": "JWT"
        }
        
        # Encode header and payload
        header_b64 = SimpleJWT.base64_url_encode(header)
        payload_b64 = SimpleJWT.base64_url_encode(payload)
        
        # Create signature
        signature = SimpleJWT.create_signature(header_b64, payload_b64, SimpleJWT.get_secret())
        
        # Combine all parts
        token = f"{header_b64}.{payload_b64}.{signature}"
        return token
    
    @staticmethod
    def verify_token(token):
        """Verify and decode JWT token"""
        try:
            # Split token
            parts = token.split('.')
            if len(parts) != 3:
                return None
            
            header_b64, payload_b64, signature = parts
            
            # Verify signature
            expected_signature = SimpleJWT.create_signature(
                header_b64, payload_b64, SimpleJWT.get_secret()
            )
            
            if signature != expected_signature:
                return None
            
            # Decode payload
            payload = SimpleJWT.base64_url_decode(payload_b64)
            if not payload:
                return None
            
            # Check expiration
            if 'exp' in payload:
                exp_timestamp = payload['exp']
                if datetime.utcnow().timestamp() > exp_timestamp:
                    return None  # Token expired
            
            return payload
            
        except Exception:
            return None


class SimpleJWTHelper:
    """JWT Helper using simple JWT implementation"""
    
    @staticmethod
    def generate_access_token(user_id, email, role='user'):
        """Generate access token"""
        now = datetime.utcnow()
        payload = {
            'user_id': user_id,
            'email': email,
            'role': role,
            'type': 'access',
            'iat': int(now.timestamp()),
            'exp': int((now + timedelta(hours=24)).timestamp()),
            'iss': 'ams-api',
            'aud': 'ams-client'
        }
        return SimpleJWT.generate_token(payload)
    
    @staticmethod
    def generate_refresh_token(user_id, email):
        """Generate refresh token"""
        now = datetime.utcnow()
        payload = {
            'user_id': user_id,
            'email': email,
            'type': 'refresh',
            'iat': int(now.timestamp()),
            'exp': int((now + timedelta(days=30)).timestamp()),
            'iss': 'ams-api',
            'aud': 'ams-client'
        }
        return SimpleJWT.generate_token(payload)
    
    @staticmethod
    def decode_token(token):
        """Decode and validate token"""
        return SimpleJWT.verify_token(token)
    
    @staticmethod
    def validate_access_token(token):
        """Validate access token"""
        payload = SimpleJWT.verify_token(token)
        if not payload or payload.get('type') != 'access':
            return None
        
        # Import here to avoid circular imports
        from app.models.user_model import User
        
        user = User.objects(user_id=payload.get('user_id')).first()
        if not user:
            return None
        
        return {
            'user_id': payload.get('user_id'),
            'email': payload.get('email'),
            'role': payload.get('role', 'user'),
            'user': user
        }
    
    @staticmethod
    def validate_refresh_token(token):
        """Validate refresh token"""
        payload = SimpleJWT.verify_token(token)
        if not payload or payload.get('type') != 'refresh':
            return None
        
        # Import here to avoid circular imports
        from app.models.user_model import User
        
        user = User.objects(user_id=payload.get('user_id')).first()
        if not user:
            return None
        
        return {
            'user_id': payload.get('user_id'),
            'email': payload.get('email'),
            'user': user
        }
    
    @staticmethod
    def extract_token_from_header(auth_header):
        """Extract token from Authorization header"""
        if not auth_header:
            return None
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None
        
        return parts[1]


# Update the existing JWT helper to use the simple implementation
JWTHelper = SimpleJWTHelper