from marshmallow import Schema, fields, validate, ValidationError, validates_schema
import re

def validate_phone(value):
    if not re.fullmatch(r'\d{10}', value):
        raise ValidationError("Phone number must be exactly 10 digits.")

class ProfileDataSchema(Schema):
    preferences = fields.Dict(required=False)

class UserSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    phone = fields.Str(required=True, validate=validate_phone)
    flat_number = fields.Str(required=True)
    apartment_name = fields.Str(required=False)
    building_name = fields.Str(required=False)
    flat_number = fields.Str(required=False)
    floor_number = fields.Str(required=False)
    role = fields.Str(required=False, validate=validate.OneOf(["user", "admin"]), load_default="user")
    profile_data = fields.Nested(ProfileDataSchema, required=False)
    user_id = fields.Str(required=False)