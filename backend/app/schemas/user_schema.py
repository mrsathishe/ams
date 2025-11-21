from marshmallow import Schema, fields, validate, ValidationError
import re

def validate_phone(value):
    if not re.fullmatch(r'\d{10}', value):
        raise ValidationError("Phone number must be exactly 10 digits.")

class UserSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    phone = fields.Str(required=True, validate=validate_phone)
    flat_number = fields.Str(required=True)
    building_name = fields.Str(required=True)
    user_id = fields.Str(required=False)