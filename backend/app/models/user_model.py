from mongoengine import Document, StringField, EmailField, DictField
class User(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    phone = StringField(required=True, unique=True)
    flat_number = StringField(required=True)
    apartment_name = StringField(required=False)  # New field
    building_name = StringField(required=False)   # Legacy field for backward compatibility
    role = StringField(required=False, default="user")
    profile_data = DictField(required=False)
    user_id = StringField(required=True, unique=True)
    floor_number=StringField(required=False)

    meta = {'collection': 'users'}