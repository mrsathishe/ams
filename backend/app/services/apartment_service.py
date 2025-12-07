from app.models.apartment_model import Apartment
from app.utils.response_helper import response
from app.constants import messages
import re


def get_apartments(search=None, zipcode=None):
    """
    Get all apartments with optional search and zipcode filtering
    """
    try:
        query = {}
        
        # Apply search filter (case-insensitive)
        if search:
            query['name__icontains'] = search
        
        # Apply zipcode filter
        if zipcode:
            query['zipcode'] = zipcode
        
        apartments = Apartment.objects(**query)
        
        result = []
        for apt in apartments:
            result.append(apt.to_dict())
        
        return response(result, status_code=200)
    
    except Exception as e:
        return response(messages.INTERNAL_SERVER_ERROR, status_code=500)


def get_buildings_by_apartment(apartment_id):
    """
    Get all buildings for a specific apartment
    """
    try:
        apartment = Apartment.objects(id=apartment_id).first()
        
        if not apartment:
            return response("Apartment not found", status_code=404)
        
        buildings = []
        for building in apartment.buildings:
            buildings.append({
                "id": building.id,
                "name": building.name,
                "floors": building.floors,
                "totalUnits": building.total_units
            })
        
        return response(buildings, status_code=200)
    
    except Exception as e:
        return response(messages.INTERNAL_SERVER_ERROR, status_code=500)