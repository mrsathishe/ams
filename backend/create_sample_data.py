"""
Sample data script for apartments and buildings
Run this script to populate the database with sample apartment and building data
"""
import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.apartment_model import Apartment, Building
from app.config import Config
import mongoengine

def create_sample_data():
    """Create sample apartments and buildings"""
    
    # Connect to MongoDB
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    # Clear existing data
    Apartment.drop_collection()
    
    # Sample apartment data
    apartments_data = [
        {
            "id": "apt_001",
            "name": "Sunset Gardens Apartments",
            "address": "123 Main Street",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "zipcode": "600075",
            "buildings": [
                {"id": "bld_001a", "name": "Building A", "floors": 5, "total_units": 50},
                {"id": "bld_001b", "name": "Building B", "floors": 5, "total_units": 50},
                {"id": "bld_001c", "name": "Building C", "floors": 3, "total_units": 30}
            ]
        },
        {
            "id": "apt_002",
            "name": "Oak Ridge Complex",
            "address": "456 Oak Avenue",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "zipcode": "600001",
            "buildings": [
                {"id": "bld_002a", "name": "North Tower", "floors": 10, "total_units": 100},
                {"id": "bld_002b", "name": "South Tower", "floors": 10, "total_units": 100}
            ]
        },
        {
            "id": "apt_003",
            "name": "Downtown Lofts",
            "address": "789 Downtown Boulevard",
            "city": "Tiruvannamalai",
            "state": "Tamil Nadu",
            "zipcode": "604601",
            "buildings": [
                {"id": "bld_003a", "name": "Main Building", "floors": 15, "total_units": 150}
            ]
        },
        {
            "id": "apt_004",
            "name": "Marina View Towers",
            "address": "321 Harbor Drive",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "zipcode": "600028",
            "buildings": [
                {"id": "bld_004a", "name": "Tower 1", "floors": 20, "total_units": 200},
                {"id": "bld_004b", "name": "Tower 2", "floors": 20, "total_units": 200}
            ]
        },
        {
            "id": "apt_005",
            "name": "Mountain Peak Residences",
            "address": "654 Alpine Road",
            "city": "Mumbai",
            "state": "Maharashtra",
            "zipcode": "400001",
            "buildings": [
                {"id": "bld_005a", "name": "East Wing", "floors": 8, "total_units": 80},
                {"id": "bld_005b", "name": "West Wing", "floors": 8, "total_units": 80}
            ]
        },
        {
            "id": "apt_006",
            "name": "Tech Park Apartments",
            "address": "101 IT Corridor",
            "city": "Bangalore",
            "state": "Karnataka",
            "zipcode": "560001",
            "buildings": [
                {"id": "bld_006a", "name": "Block A", "floors": 12, "total_units": 120},
                {"id": "bld_006b", "name": "Block B", "floors": 12, "total_units": 120}
            ]
        },
        {
            "id": "apt_007",
            "name": "Heritage Homes",
            "address": "222 Heritage Lane",
            "city": "New Delhi",
            "state": "Delhi",
            "zipcode": "110001",
            "buildings": [
                {"id": "bld_007a", "name": "Classic Block", "floors": 6, "total_units": 60}
            ]
        },
        {
            "id": "apt_008",
            "name": "Riverside Residency",
            "address": "333 River Road",
            "city": "Hyderabad",
            "state": "Telangana",
            "zipcode": "500001",
            "buildings": [
                {"id": "bld_008a", "name": "Riverside Block", "floors": 14, "total_units": 140}
            ]
        }
    ]
    
    # Create apartments with buildings
    for apt_data in apartments_data:
        buildings = []
        for bld_data in apt_data.pop("buildings"):
            building = Building(
                id=bld_data["id"],
                name=bld_data["name"],
                floors=bld_data["floors"],
                total_units=bld_data["total_units"]
            )
            buildings.append(building)
        
        apartment = Apartment(
            id=apt_data["id"],
            name=apt_data["name"],
            address=apt_data["address"],
            city=apt_data["city"],
            state=apt_data["state"],
            zipcode=apt_data["zipcode"],
            buildings=buildings
        )
        apartment.save()
        print(f"Created apartment: {apartment.name} with {len(buildings)} buildings")
    
    print(f"\nSuccessfully created {len(apartments_data)} apartments with sample data!")

if __name__ == "__main__":
    create_sample_data()