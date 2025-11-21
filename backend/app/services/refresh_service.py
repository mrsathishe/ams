from flask import request
from app.utils.response_helper import response
from app.constants import messages

def refresh_user_tokens():
    return response(messages.TOKEN_REFRESHED_SUCCESSFULLY, data={'token': '1234567890'})