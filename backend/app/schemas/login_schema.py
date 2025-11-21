from marshmallow import Schema, fields, validate, validates_schema, ValidationError

class LoginSchema(Schema):
    identifier = fields.Str(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
