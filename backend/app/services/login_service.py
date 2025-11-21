import re
from app.utils.response_helper import response
from app.models.user_model import User
from app.utils.password_helper import hash_password
from app.schemas.login_schema import LoginSchema
from marshmallow import ValidationError
from app.constants import messages

def login_user(request_data):
    try:
        data = LoginSchema().load(request_data)
    except ValidationError as err:
        return response(message="Validation errors", data=err.messages, status_code=400, status=False)

    identifier = data['identifier']
    password = data['password']

    user = None
    if re.fullmatch(r'[^@]+@[^@]+\.[^@]+', identifier):
        user = User.objects(email=identifier).first()
    elif re.fullmatch(r'\d{10}', identifier):
        user = User.objects(phone=identifier).first()

    if user and user.password == hash_password(password):
        # In a real application, generate a JWT token here
        token = "some_generated_token"
        return response(
            message=messages.LOGIN_SUCCESSFUL,
            data={
                "user_id": str(user.id),
                "token": token
            },
            status_code=200,
            status=True
        )
    else:
        return response(message=messages.INVALID_CREDENTIALS, status_code=401, status=False)


# HTTP Status: 200 OK

# Response Body (JSON):

# {
#   "success": true,
#   "message": "Login successful",
#   "data": {
#     "user": {
#       "id": "674b42c4e4b5679105d59b9e",
#       "name": "Sathish",
#       "email": "sathish@example.com"
#     },
#     "token": "<jwt_token_here>"
#   }
# }

# HTTP Status: 401 Unauthorized

# {
#   "success": false,
#   "message": "Invalid email or password"
# }

# HTTP Status: 403 Forbidden

# {
#   "success": false,
#   "message": "Account not verified. Please verify your email."
# }

# HTTP Status: 400 Bad Request

# {
#   "success": false,
#   "message": "Validation error",
#   "errors": {
#     "email": "Invalid email format"
#   }
# }

# HTTP Status: 500 Internal Server Error

# {
#   "success": false,
#   "message": "Something went wrong. Please try again later."
# }
