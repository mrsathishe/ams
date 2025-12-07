from mongoengine import Document, StringField, EmailField, DictField, BooleanField
class User(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    phone = StringField(required=True, unique=True)
    flat_number = StringField(required=True)
    apartment_name = StringField(required=False)
    building_name = StringField(required=False)
    role = StringField(required=False, default="user")
    profile_data = DictField(required=False)
    user_id = StringField(required=True, unique=True)
    floor_number = StringField(required=False)
    
    # Location fields
    country = StringField(required=False, max_length=100)
    zipcode = StringField(required=False, max_length=10)
    state = StringField(required=False, max_length=50)
    city = StringField(required=False, max_length=100)
    
    # Notification preferences
    subscribe_to_notifications = BooleanField(required=False, default=True)

    meta = {'collection': 'users'}