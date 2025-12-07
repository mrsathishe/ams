from app.utils.response_helper import response
from marshmallow import ValidationError
from app.schemas.location_schema import RegisterRequestSchema
from app.models.user_model import User
from app.models.apartment_model import Apartment
from app.utils.password_helper import hash_password
from app.constants import messages


def register_user(data):
    try:
        validated_data = RegisterRequestSchema().load(data)
    except ValidationError as err:
        return response(err.messages, status_code=400, status="FAILURE")

    # Check if user already exists
    if User.objects(email=validated_data['email']).first():
        return response(messages.USER_ALREADY_EXISTS, status_code=409)

    # Get apartment and building IDs from locationDetails
    location_details = validated_data['locationDetails']
    apartment_id = location_details['apartmentId']
    building_id = location_details['buildingId']
    
    # Validate apartment exists and fetch location data from DB
    apartment = Apartment.objects(id=apartment_id).first()
    if not apartment:
        return response({"error": "Invalid apartment ID"}, status_code=400)
    
    # Validate building exists in the apartment
    building_found = None
    for building in apartment.buildings:
        if building.id == building_id:
            building_found = building
            break
    
    if not building_found:
        return response({"error": "Invalid building ID for the selected apartment"}, status_code=400)

    # Hash password
    validated_data['password'] = hash_password(validated_data['password'])

    # Generate new user ID
    last_user = User.objects.order_by('-user_id').first()
    if last_user and last_user.user_id and last_user.user_id.startswith('P'):
        last_id_num = int(last_user.user_id[1:])
        new_id_num = last_id_num + 1
        new_user_id = f'P{new_id_num:04d}'
    else:
        new_user_id = 'P0001'
    
    validated_data['user_id'] = new_user_id
    
    # Remove locationDetails from validated_data
    validated_data.pop('locationDetails')
    
    # Map field names to user model fields
    validated_data['apartment_name'] = validated_data.pop('apartmentName', '')
    validated_data['building_name'] = validated_data.pop('buildingName', '')
    validated_data['flat_number'] = validated_data.pop('flatNumber', '')
    validated_data['floor_number'] = validated_data.pop('floorNumber', None)
    validated_data['subscribe_to_notifications'] = validated_data.pop('subscribeToNotifications', True)
    
    # Auto-map location details from apartment collection
    validated_data['country'] = 'India'  # Default country
    validated_data['zipcode'] = apartment.zipcode
    validated_data['state'] = apartment.state
    validated_data['city'] = apartment.city
    
    # Create new user
    new_user = User(**validated_data)
    new_user.save()

    # Prepare response data
    response_data = {
        "message": "User registered successfully",
        "user": {
            "id": new_user.user_id,
            "email": new_user.email,
            "name": new_user.name,
            "phone": new_user.phone,
            "apartmentName": new_user.apartment_name,
            "buildingName": new_user.building_name,
            "flatNumber": new_user.flat_number,
            "floorNumber": new_user.floor_number,
            "locationDetails": {
                "country": new_user.country,
                "zipcode": new_user.zipcode,
                "state": new_user.state,
                "city": new_user.city
            },
            "createdAt": new_user.id.generation_time.isoformat()
        }
    }

    return response(response_data, status_code=201)