from flask import request
from app.utils.response_helper import response
from app.models.user_model import User
from app.utils.jwt_helper import get_current_user
from app.constants import messages

def get_user_details():
    """
    Get current authenticated user details
    
    Returns:
        dict: User details or error message
    """
    # Get current user from JWT token (set by jwt_required decorator)
    current_user = get_current_user()
    
    if not current_user:
        return response(
            message="Authentication required",
            status_code=401,
            status="FAILURE"
        )
    
    user = current_user['user']
    
    if not user:
        return response(
            message=messages.USER_NOT_FOUND,
            status_code=404,
            status="FAILURE"
        )

    # Prepare user data (without sensitive information)
    user_data = {
        'id': user.user_id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'role': user.role,
        'apartmentName': user.apartment_name,
        'buildingName': user.building_name,
        'flatNumber': user.flat_number,
        'floorNumber': user.floor_number,
        'subscribeToNotifications': user.subscribe_to_notifications
    }
    
    # Add location details if available
    if user.country:
        user_data['locationDetails'] = {
            'country': user.country,
            'zipcode': user.zipcode,
            'state': user.state,
            'city': user.city
        }
    
    return response(
        message='User details retrieved successfully',
        data=user_data,
        status_code=200,
        status="SUCCESS"
    )