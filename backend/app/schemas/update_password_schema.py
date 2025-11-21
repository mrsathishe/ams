from marshmallow import Schema, fields, validate

class UpdatePasswordSchema(Schema):
    email = fields.Email(required=True)
    user_id = fields.Str(required=True)
    phone = fields.Str(required=True, validate=validate.Regexp(r'^\d{10}$'))
    new_password = fields.Str(required=True, validate=validate.Length(min=6))