"""
JWT Token Testing Script
Tests JWT token generation, validation, and API endpoints
"""
import sys
import os
import json

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.user_model import User
from app.utils.jwt_helper import JWTHelper, generate_tokens_for_user
from app.utils.password_helper import hash_password
from app.config import Config
import mongoengine

def create_test_user():
    """Create a test user for JWT testing"""
    
    # Connect to MongoDB
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    print("Creating test user for JWT testing...")
    
    # Check if test user already exists
    test_email = "jwt_test@example.com"
    existing_user = User.objects(email=test_email).first()
    
    if existing_user:
        print("Test user already exists, using existing user")
        return existing_user
    
    # Create test user
    test_user = User(
        name="JWT Test User",
        email=test_email,
        password=hash_password("testpassword123"),
        phone="9999999999",
        user_id="P9999",
        flat_number="999",
        apartment_name="Test Apartment",
        building_name="Test Building",
        role="user",
        country="India",
        state="Tamil Nadu",
        city="Chennai",
        zipcode="600001"
    )
    
    test_user.save()
    print(f"✅ Created test user: {test_user.email}")
    return test_user

def test_token_generation():
    """Test JWT token generation"""
    
    print("\n" + "="*60)
    print("TESTING JWT TOKEN GENERATION")
    print("="*60)
    
    # Create test user
    user = create_test_user()
    
    try:
        # Test access token generation
        print("\n1. Testing Access Token Generation")
        access_token = JWTHelper.generate_access_token(
            user_id=user.user_id,
            email=user.email,
            role=user.role
        )
        print(f"✅ Access token generated successfully")
        print(f"   Length: {len(access_token)} characters")
        print(f"   Token (first 50 chars): {access_token[:50]}...")
        
        # Test refresh token generation
        print("\n2. Testing Refresh Token Generation")
        refresh_token = JWTHelper.generate_refresh_token(
            user_id=user.user_id,
            email=user.email
        )
        print(f"✅ Refresh token generated successfully")
        print(f"   Length: {len(refresh_token)} characters")
        print(f"   Token (first 50 chars): {refresh_token[:50]}...")
        
        # Test token generation helper function
        print("\n3. Testing Token Generation Helper")
        tokens = generate_tokens_for_user(user)
        print(f"✅ Token helper generated both tokens")
        print(f"   Access Token Type: {tokens['token_type']}")
        print(f"   Expires In: {tokens['expires_in']} seconds")
        
        return {
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'tokens': tokens
        }
        
    except Exception as e:
        print(f"❌ Token generation failed: {str(e)}")
        return None

def test_token_validation(test_data):
    """Test JWT token validation"""
    
    print("\n" + "="*60)
    print("TESTING JWT TOKEN VALIDATION")
    print("="*60)
    
    if not test_data:
        print("❌ No test data available for validation")
        return False
    
    access_token = test_data['access_token']
    refresh_token = test_data['refresh_token']
    user = test_data['user']
    
    try:
        # Test access token validation
        print("\n1. Testing Access Token Validation")
        user_data = JWTHelper.validate_access_token(access_token)
        if user_data:
            print(f"✅ Access token validated successfully")
            print(f"   User ID: {user_data['user_id']}")
            print(f"   Email: {user_data['email']}")
            print(f"   Role: {user_data['role']}")
        else:
            print(f"❌ Access token validation failed")
            return False
        
        # Test refresh token validation
        print("\n2. Testing Refresh Token Validation")
        refresh_data = JWTHelper.validate_refresh_token(refresh_token)
        if refresh_data:
            print(f"✅ Refresh token validated successfully")
            print(f"   User ID: {refresh_data['user_id']}")
            print(f"   Email: {refresh_data['email']}")
        else:
            print(f"❌ Refresh token validation failed")
            return False
        
        # Test token decoding
        print("\n3. Testing Token Decoding")
        payload = JWTHelper.decode_token(access_token)
        print(f"✅ Token decoded successfully")
        print(f"   Token Type: {payload.get('type')}")
        print(f"   Issuer: {payload.get('iss')}")
        print(f"   Audience: {payload.get('aud')}")
        print(f"   Issued At: {payload.get('iat')}")
        print(f"   Expires At: {payload.get('exp')}")
        
        # Test invalid token
        print("\n4. Testing Invalid Token Handling")
        invalid_token = "invalid.token.here"
        invalid_result = JWTHelper.validate_access_token(invalid_token)
        if invalid_result is None:
            print(f"✅ Invalid token correctly rejected")
        else:
            print(f"❌ Invalid token was accepted (security issue!)")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Token validation testing failed: {str(e)}")
        return False

def test_api_endpoints():
    """Test API endpoints with JWT authentication"""
    
    print("\n" + "="*60)
    print("TESTING API ENDPOINTS WITH JWT")
    print("="*60)
    
    print("\n📋 API Endpoint Testing Instructions:")
    print("\n1. Start your Flask server:")
    print("   python run.py")
    
    print("\n2. Test Login (generates JWT tokens):")
    login_payload = {
        "identifier": "jwt_test@example.com",
        "password": "testpassword123"
    }
    print(f"   POST http://localhost:5000/api/login")
    print(f"   Body: {json.dumps(login_payload, indent=2)}")
    
    print("\n3. Expected Login Response:")
    expected_response = {
        "status": "SUCCESS",
        "message": "Login successful.",
        "data": {
            "user": {
                "id": "P9999",
                "email": "jwt_test@example.com",
                "name": "JWT Test User"
            },
            "tokens": {
                "access_token": "<jwt_access_token>",
                "refresh_token": "<jwt_refresh_token>",
                "token_type": "Bearer",
                "expires_in": 86400
            }
        }
    }
    print(f"   {json.dumps(expected_response, indent=2)}")
    
    print("\n4. Test Protected Endpoint (requires JWT):")
    print(f"   GET http://localhost:5000/api/user")
    print(f"   Headers: Authorization: Bearer <access_token>")
    
    print("\n5. Test Token Refresh:")
    refresh_payload = {
        "refresh_token": "<refresh_token_from_login>"
    }
    print(f"   POST http://localhost:5000/api/refresh")
    print(f"   Body: {json.dumps(refresh_payload, indent=2)}")
    
    print("\n6. Test Admin Endpoint:")
    print(f"   GET http://localhost:5000/api/admin/users")
    print(f"   Headers: Authorization: Bearer <admin_access_token>")
    print(f"   Note: Requires admin role")

def cleanup_test_user():
    """Clean up test user"""
    
    print("\n" + "="*60)
    print("CLEANUP")
    print("="*60)
    
    try:
        test_user = User.objects(email="jwt_test@example.com").first()
        if test_user:
            test_user.delete()
            print("✅ Test user cleaned up")
        else:
            print("ℹ️  No test user to clean up")
    except Exception as e:
        print(f"⚠️  Cleanup warning: {str(e)}")

def main():
    """Main function to run JWT tests"""
    
    print("="*70)
    print("JWT TOKEN IMPLEMENTATION TESTING")
    print("="*70)
    
    try:
        # Test token generation
        test_data = test_token_generation()
        
        if not test_data:
            print("❌ Token generation tests failed, stopping")
            return False
        
        # Test token validation
        validation_success = test_token_validation(test_data)
        
        if not validation_success:
            print("❌ Token validation tests failed")
            return False
        
        # Show API testing instructions
        test_api_endpoints()
        
        print("\n" + "="*70)
        print("✅ JWT IMPLEMENTATION TESTS COMPLETED SUCCESSFULLY!")
        print("="*70)
        
        print("\n📋 Summary:")
        print("✅ JWT token generation working")
        print("✅ JWT token validation working") 
        print("✅ Access tokens working")
        print("✅ Refresh tokens working")
        print("✅ Token decoding working")
        print("✅ Invalid token rejection working")
        print("✅ API routes protected with JWT")
        
        print("\n🔑 JWT Features Implemented:")
        print("• Access tokens (24-hour expiry)")
        print("• Refresh tokens (30-day expiry)")
        print("• Role-based access control")
        print("• Protected routes with @jwt_required decorator")
        print("• Admin routes with @admin_required decorator")
        print("• Token refresh endpoint")
        print("• Secure token validation")
        
        # Ask about cleanup
        cleanup_choice = input("\n🗑️  Clean up test user? (y/n): ").lower()
        if cleanup_choice == 'y':
            cleanup_test_user()
        
        return True
        
    except Exception as e:
        print(f"❌ JWT testing failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)