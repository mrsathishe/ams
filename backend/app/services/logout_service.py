from flask import request
from app.utils.response_helper import response
from app.constants import messages

def logout_user():
    # Add user logout logic here
    return response(messages.LOGOUT_SUCCESSFUL)