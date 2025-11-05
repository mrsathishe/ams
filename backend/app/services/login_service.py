from flask import request
from app.utils.response_helper import response

def login_user():
    username = request.form.get('username')
    password = request.form.get('password')
    # Add user login logic here
    return response('User logged in successfully', data={'token': '1234567890'})