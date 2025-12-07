import re
from app.utils.response_helper import response
from app.models.user_model import User
from app.utils.password_helper import hash_password, compare_password
from app.utils.jwt_helper import generate_tokens_for_user
from app.schemas.login_schema import LoginSchema
from marshmallow import ValidationError
from app.constants import messages

def login_user(request_data):
    """
    Authenticate user and generate JWT tokens
    
    Args:
        request_data (dict): Login request containing identifier and password
        
    Returns:
        dict: Response with user data and JWT tokens or error message
    """
    try:
        data = LoginSchema().load(request_data)
    except ValidationError as err:
        return response(message="Validation errors", data=err.messages, status_code=400, status="FAILURE")

    identifier = data['identifier']
    password = data['password']

    # Find user by email or phone
    user = None
    if re.fullmatch(r'[^@]+@[^@]+\.[^@]+', identifier):
        user = User.objects(email=identifier).first()
    elif re.fullmatch(r'\d{10}', identifier):
        user = User.objects(phone=identifier).first()

    # Verify user exists and password is correct
    if user and compare_password(password, user.password):
        try:
            # Generate JWT tokens
            tokens = generate_tokens_for_user(user)
            
            # Prepare user data for response (without sensitive info)
            user_data = {
                "id": user.user_id,
                "email": user.email,
                "name": user.name,
                "phone": user.phone,
                "role": user.role,
                "apartmentName": user.apartment_name,
                "buildingName": user.building_name,
                "flatNumber": user.flat_number,
                "floorNumber": user.floor_number
            }
            
            # Add location details if available
            if user.country:
                user_data["locationDetails"] = {
                    "country": user.country,
                    "zipcode": user.zipcode,
                    "state": user.state,
                    "city": user.city
                }
            
            return response(
                message=messages.LOGIN_SUCCESSFUL,
                data={
                    "user": user_data,
                    "tokens": tokens
                },
                status_code=200,
                status="SUCCESS"
            )
            
        except Exception as e:
            # Log the error in production
            print(f"Token generation error: {str(e)}")
            return response(
                message="Failed to generate authentication tokens",
                status_code=500,
                status="FAILURE"
            )
    else:
        return response(
            message=messages.INVALID_CREDENTIALS,
            status_code=401,
            status="FAILURE"
        )
