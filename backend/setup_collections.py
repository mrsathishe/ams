"""
MongoDB Collections Setup Script
This script creates all necessary MongoDB collections with proper indexes
for the location-based registration system.
"""
import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.apartment_model import Apartment, Building
from app.models.user_model import User
from app.config import Config
import mongoengine

def create_collections_and_indexes():
    """Create MongoDB collections with proper indexes"""
    
    # Connect to MongoDB
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    print("Setting up MongoDB collections and indexes...")
    
    # 1. Create Users Collection with indexes
    print("\n1. Setting up Users collection...")
    
    # Ensure users collection exists
    User.drop_collection()  # Clear existing data for fresh setup
    
    # Create indexes for users collection
    User.create_index([("email", 1)], unique=True)
    User.create_index([("user_id", 1)], unique=True)
    User.create_index([("phone", 1)], unique=True)
    User.create_index([("city", 1), ("state", 1), ("zipcode", 1)])  # Location-based queries
    User.create_index([("apartment_name", 1)])
    User.create_index([("building_name", 1)])
    
    print("✓ Users collection created with indexes:")
    print("  - email (unique)")
    print("  - user_id (unique)")
    print("  - phone (unique)")
    print("  - location compound index (city, state, zipcode)")
    print("  - apartment_name")
    print("  - building_name")
    
    # 2. Create Apartments Collection with indexes
    print("\n2. Setting up Apartments collection...")
    
    # Ensure apartments collection exists
    Apartment.drop_collection()  # Clear existing data for fresh setup
    
    # Create indexes for apartments collection
    Apartment.create_index([("id", 1)], unique=True)
    Apartment.create_index([("name", 1)])
    Apartment.create_index([("city", 1), ("state", 1), ("zipcode", 1)])  # Location-based queries
    Apartment.create_index([("zipcode", 1)])  # For zipcode filtering
    
    print("✓ Apartments collection created with indexes:")
    print("  - id (unique, primary key)")
    print("  - name (for search functionality)")
    print("  - location compound index (city, state, zipcode)")
    print("  - zipcode (for filtering)")
    
    print("\n3. Collections summary:")
    print("✓ users - Stores user registration data with location details")
    print("✓ apartments - Stores apartment complexes with embedded buildings")
    
    print("\n4. Embedded Documents:")
    print("✓ buildings - Embedded in apartments collection")
    print("  - Each apartment can have multiple buildings")
    print("  - Buildings contain: id, name, floors, total_units")
    
    return True

def populate_sample_data():
    """Populate collections with sample data"""
    print("\n" + "="*50)
    print("POPULATING SAMPLE DATA")
    print("="*50)
    
    # Sample apartment data with buildings
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
    apartments_created = 0
    buildings_created = 0
    
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
            buildings_created += 1
        
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
        apartments_created += 1
        print(f"✓ Created: {apartment.name} ({len(buildings)} buildings)")
    
    print(f"\n✅ Sample data created successfully!")
    print(f"   • {apartments_created} apartments")
    print(f"   • {buildings_created} buildings")
    
    return True

def verify_collections():
    """Verify that collections were created successfully"""
    print("\n" + "="*50)
    print("VERIFYING COLLECTIONS")
    print("="*50)
    
    try:
        # Check Users collection
        user_count = User.objects.count()
        print(f"✓ Users collection: {user_count} documents")
        
        # Check Apartments collection
        apartment_count = Apartment.objects.count()
        total_buildings = sum(len(apt.buildings) for apt in Apartment.objects)
        print(f"✓ Apartments collection: {apartment_count} documents")
        print(f"✓ Total buildings (embedded): {total_buildings} documents")
        
        # Test search functionality
        chennai_apartments = Apartment.objects(city="Chennai").count()
        print(f"✓ Chennai apartments: {chennai_apartments}")
        
        # Test apartment search
        sunset_search = Apartment.objects(name__icontains="sunset").count()
        print(f"✓ Apartments matching 'sunset': {sunset_search}")
        
        print("\n✅ All collections verified successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error verifying collections: {str(e)}")
        return False

def main():
    """Main function to set up all collections"""
    print("="*60)
    print("MONGODB COLLECTIONS SETUP FOR LOCATION-BASED REGISTRATION")
    print("="*60)
    
    try:
        # Step 1: Create collections and indexes
        if create_collections_and_indexes():
            print("✅ Collections and indexes created successfully!")
        else:
            print("❌ Failed to create collections")
            return False
        
        # Step 2: Populate with sample data
        if populate_sample_data():
            print("✅ Sample data populated successfully!")
        else:
            print("❌ Failed to populate sample data")
            return False
        
        # Step 3: Verify collections
        if verify_collections():
            print("✅ Collections verified successfully!")
        else:
            print("❌ Collection verification failed")
            return False
        
        print("\n" + "="*60)
        print("🎉 SETUP COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("\nYour MongoDB database is ready for the location-based registration API!")
        print("\nAvailable endpoints:")
        print("• POST /api/register - Register users with location data")
        print("• GET /api/apartments - Get all apartments (with search/filter)")
        print("• GET /api/apartments/{id}/buildings - Get buildings for apartment")
        print("\nNext steps:")
        print("1. Start your Flask application")
        print("2. Test the API endpoints")
        print("3. Check the sample data in your MongoDB database")
        
        return True
        
    except Exception as e:
        print(f"❌ Setup failed with error: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)