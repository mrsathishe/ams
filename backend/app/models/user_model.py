from mongoengine import Document, StringField, EmailField, ValidationError
import re

def validate_phone(value):
    if not re.fullmatch(r'\d{10}', value):
        raise ValidationError("Phone number must be exactly 10 digits.")

class User(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    phone = StringField(required=True, validation=validate_phone)
    flat_number = StringField(required=True)
    building_name = StringField(required=True)

    meta = {'collection': 'users'}