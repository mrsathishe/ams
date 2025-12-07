from flask import request
from app.utils.response_helper import response
from app.utils.jwt_helper import JWTHelper, generate_tokens_for_user
from app.constants import messages

def refresh_user_tokens():
    """
    Refresh JWT tokens using a valid refresh token
    
    Returns:
        dict: New access and refresh tokens or error message
    """
    try:
        # Get refresh token from request body
        request_data = request.get_json() or {}
        refresh_token = request_data.get('refresh_token')
        
        if not refresh_token:
            return response(
                message="Refresh token is required",
                status_code=400,
                status="FAILURE"
            )
        
        # Validate refresh token
        user_data = JWTHelper.validate_refresh_token(refresh_token)
        
        if not user_data:
            return response(
                message="Invalid or expired refresh token",
                status_code=401,
                status="FAILURE"
            )
        
        # Generate new tokens
        user = user_data['user']
        new_tokens = generate_tokens_for_user(user)
        
        return response(
            message=messages.TOKEN_REFRESHED_SUCCESSFULLY,
            data={
                "tokens": new_tokens
            },
            status_code=200,
            status="SUCCESS"
        )
        
    except Exception as e:
        print(f"Token refresh error: {str(e)}")
        return response(
            message="Failed to refresh tokens",
            status_code=500,
            status="FAILURE"
        )