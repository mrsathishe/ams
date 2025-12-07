from marshmallow import Schema, fields, validate


class LocationDetailsSchema(Schema):
    apartmentId = fields.Str(required=True, validate=validate.Length(min=1))
    buildingId = fields.Str(required=True, validate=validate.Length(min=1))


class RegisterRequestSchema(Schema):
    email = fields.Email(required=True)
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    password = fields.Str(required=True, validate=validate.Length(min=8))
    phone = fields.Str(required=True)
    apartmentName = fields.Str(required=True, validate=validate.Length(min=1))
    buildingName = fields.Str(required=True, validate=validate.Length(min=1))
    flatNumber = fields.Str(required=True, validate=validate.Length(min=1))
    floorNumber = fields.Str(required=False, allow_none=True)
    subscribeToNotifications = fields.Bool(required=False, load_default=True)
    locationDetails = fields.Nested(LocationDetailsSchema, required=True)