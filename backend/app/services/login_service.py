from app.utils.response_helper import response
from app.models.user_model import User
from app.utils.password_helper import hash_password

def login_user(request_data):

    message = ''
    status_code = 200
    status = True
    data = {}
    print("email" not in request_data)
    print("password" not in request_data)
    print(request_data['email'] == '')
    print(request_data['password'] == '')
    if("email" not in request_data or "password" not in request_data or request_data['email'] == '' or request_data['password'] == ''):
        print('inside if')
        message = 'Invalid email or password'
        status_code = 401
        status = False
    else:
        user = User.objects(email=request_data['email']).first()
        print(f'user: ${user}')
        if not user:
            message = 'Invalid email or password'
            status_code = 401
            status = False
        elif user.password == hash_password(request_data['password']):
            message = 'User logged in successfully'
            status_code = 401
            status = False
            data = {
                'user': user,
                'token': '1234567890' # replace with actual token
            }
        else:
            message = 'Invalid email or password'
            status_code = 401
            status = False

    return response(message=message, data=data, status_code=status_code, status=status)


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
