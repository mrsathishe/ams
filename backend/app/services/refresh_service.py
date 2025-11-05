from flask import request
from app.utils.response_helper import response

def refresh_user_tokens():
    return response('Tokens refreshed successfully', data={'token': '1234567890'})