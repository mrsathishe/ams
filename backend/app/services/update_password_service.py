from app.utils.response_helper import response
from app.models.user_model import User
from app.utils.password_helper import hash_password
from app.schemas.update_password_schema import UpdatePasswordSchema
from marshmallow import ValidationError
from app.constants import messages

def update_password(request_data):
    try:
        data = UpdatePasswordSchema().load(request_data)
    except ValidationError as err:
        return response(message="Validation errors", data=err.messages, status_code=400, status=False)

    email = data['email']
    user_id = data['user_id']
    phone = data['phone']
    new_password = data['new_password']

    user = User.objects(email=email, user_id=user_id, phone=phone).first()

    if user:
        user.password = hash_password(new_password)
        user.save()
        return response(message=messages.PASSWORD_UPDATE_SUCCESSFUL, status_code=200, status=True)
    else:
        return response(message=messages.USER_NOT_FOUND, status_code=401, status=False)