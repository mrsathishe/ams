from app.utils.response_helper import response
from app.models.user_model import User
# from flask_jwt_extended import get_jwt_identity

def get_user_details():
    # current_user_email = get_jwt_identity()
    current_user_email = 'sathish@gmail.com'
    user = User.objects(email=current_user_email).first()

    if not user:
        return response('User not found', status_code=404)

    user_data = {
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'flat_number': user.flat_number,
        'building_name': user.building_name
    }
    return response('User details', data=user_data)