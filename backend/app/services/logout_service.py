from flask import request
from app.utils.response_helper import response

def logout_user():
    # Add user logout logic here
    return response('User logged out successfully')