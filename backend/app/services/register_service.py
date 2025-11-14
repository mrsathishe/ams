from app.utils.response_helper import response
from marshmallow import ValidationError
from app.schemas.user_schema import UserSchema
from app.models.user_model import User
from app.utils.password_helper import hash_password


def register_user(data):
    try:
        validated_data = UserSchema().load(data)
    except ValidationError as err:
        return response(err.messages, status_code=400, status="FAILURE")

    if User.objects(email=validated_data['email']).first():
        return response('User with this email already exists', status_code=409)

    validated_data['password'] = hash_password(validated_data['password'])
    
    new_user = User(**validated_data)
    print(f'newuser: {new_user}')
    new_user.save()

    return response('User created successfully', status_code=201)