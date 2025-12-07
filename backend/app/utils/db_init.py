"""
Database initialization utilities
Can be imported and used within the Flask application
"""
from app.models.apartment_model import Apartment, Building
from app.models.user_model import User
import mongoengine

def init_database():
    """Initialize database collections and indexes"""
    
    print("Initializing database collections...")
    
    try:
        # Create Users collection indexes
        User.create_index([("email", 1)], unique=True, background=True)
        User.create_index([("user_id", 1)], unique=True, background=True)
        User.create_index([("phone", 1)], unique=True, background=True)
        User.create_index([("city", 1), ("state", 1), ("zipcode", 1)], background=True)
        User.create_index([("apartment_name", 1)], background=True)
        User.create_index([("building_name", 1)], background=True)
        
        # Create Apartments collection indexes
        Apartment.create_index([("id", 1)], unique=True, background=True)
        Apartment.create_index([("name", 1)], background=True)
        Apartment.create_index([("city", 1), ("state", 1), ("zipcode", 1)], background=True)
        Apartment.create_index([("zipcode", 1)], background=True)
        
        print("✓ Database collections and indexes created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error initializing database: {str(e)}")
        return False

def create_sample_apartments():
    """Create sample apartment data if collections are empty"""
    
    # Check if apartments already exist
    if Apartment.objects.count() > 0:
        print("Sample apartments already exist, skipping creation.")
        return True
    
    print("Creating sample apartment data...")
    
    try:
        # Sample data including MP MILAN & MP LIVIT
        apartments_data = [
            {
                "id": "apt_mp001",
                "name": "MP MILAN & MP LIVIT", 
                "address": "Plot No. 44B, Srinivasan Street, LIC Colony Extension, Pammal",
                "city": "Kanchipuram",
                "state": "Tamil Nadu", 
                "zipcode": "600075",
                "buildings": [
                    {"id": "bld_mp001a", "name": "MP MILAN", "floors": 10, "total_units": 100},
                    {"id": "bld_mp001b", "name": "MP LIVIT", "floors": 12, "total_units": 120}
                ]
            },
            {
                "id": "apt_001", "name": "Sunset Gardens Apartments", "address": "123 Main Street",
                "city": "Chennai", "state": "Tamil Nadu", "zipcode": "600075",
                "buildings": [
                    {"id": "bld_001a", "name": "Building A", "floors": 5, "total_units": 50},
                    {"id": "bld_001b", "name": "Building B", "floors": 5, "total_units": 50},
                    {"id": "bld_001c", "name": "Building C", "floors": 3, "total_units": 30}
                ]
            },
            {
                "id": "apt_002", "name": "Oak Ridge Complex", "address": "456 Oak Avenue", 
                "city": "Chennai", "state": "Tamil Nadu", "zipcode": "600001",
                "buildings": [
                    {"id": "bld_002a", "name": "North Tower", "floors": 10, "total_units": 100},
                    {"id": "bld_002b", "name": "South Tower", "floors": 10, "total_units": 100}
                ]
            },
            {
                "id": "apt_003", "name": "Downtown Lofts", "address": "789 Downtown Boulevard",
                "city": "Tiruvannamalai", "state": "Tamil Nadu", "zipcode": "604601", 
                "buildings": [
                    {"id": "bld_003a", "name": "Main Building", "floors": 15, "total_units": 150}
                ]
            },
            {
                "id": "apt_004", "name": "Marina View Towers", "address": "321 Harbor Drive",
                "city": "Chennai", "state": "Tamil Nadu", "zipcode": "600028",
                "buildings": [
                    {"id": "bld_004a", "name": "Tower 1", "floors": 20, "total_units": 200},
                    {"id": "bld_004b", "name": "Tower 2", "floors": 20, "total_units": 200}
                ]
            },
            {
                "id": "apt_005", "name": "Mountain Peak Residences", "address": "654 Alpine Road",
                "city": "Mumbai", "state": "Maharashtra", "zipcode": "400001",
                "buildings": [
                    {"id": "bld_005a", "name": "East Wing", "floors": 8, "total_units": 80},
                    {"id": "bld_005b", "name": "West Wing", "floors": 8, "total_units": 80}
                ]
            }
        ]
        
        # Create apartments
        for apt_data in apartments_data:
            buildings = []
            for bld_data in apt_data.pop("buildings"):
                building = Building(
                    id=bld_data["id"], name=bld_data["name"],
                    floors=bld_data["floors"], total_units=bld_data["total_units"]
                )
                buildings.append(building)
            
            apartment = Apartment(buildings=buildings, **apt_data)
            apartment.save()
        
        print(f"✓ Created {len(apartments_data)} sample apartments (including MP MILAN & MP LIVIT)")
        return True
        
    except Exception as e:
        print(f"❌ Error creating sample apartments: {str(e)}")
        return False

def setup_database():
    """Complete database setup - collections, indexes, and sample data"""
    
    print("Setting up database for location-based registration...")
    
    # Initialize collections and indexes
    if not init_database():
        return False
    
    # Create sample data
    if not create_sample_apartments():
        return False
    
    print("✅ Database setup completed successfully!")
    return True