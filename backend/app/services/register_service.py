from app.utils.response_helper import response
from marshmallow import ValidationError
from app.schemas.user_schema import UserSchema
from app.models.user_model import User
from app.utils.password_helper import hash_password
from app.constants import messages


def register_user(data):
    try:
        validated_data = UserSchema().load(data)
    except ValidationError as err:
        return response(err.messages, status_code=400, status="FAILURE")

    if User.objects(email=validated_data['email']).first():
        return response(messages.USER_ALREADY_EXISTS, status_code=409)

    validated_data['password'] = hash_password(validated_data['password'])

    last_user = User.objects.order_by('-user_id').first()
    if last_user and last_user.user_id and last_user.user_id.startswith('P'):
        last_id_num = int(last_user.user_id[1:])
        new_id_num = last_id_num + 1
        new_user_id = f'P{new_id_num:04d}'
    else:
        new_user_id = 'P0001'
    
    validated_data['user_id'] = new_user_id
    
    new_user = User(**validated_data)
    new_user.save()

    return response(messages.USER_CREATED_SUCCESSFULLY, status_code=201)