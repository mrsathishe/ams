"""
Direct MongoDB script to add MP MILAN & MP LIVIT apartment
This script directly connects to MongoDB without Flask dependencies
"""
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def add_mp_apartment_direct():
    """Add MP apartment directly to MongoDB"""
    
    # Get MongoDB connection details from environment
    db_user = os.getenv("MONGODB_USER_NAME")
    db_pass = os.getenv("MONGODB_PASSWORD") 
    base_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DB_NAME", "ams")
    
    # Build connection URI
    if base_uri and db_user and db_pass:
        mongo_uri = base_uri.replace("<db_user_name>", db_user).replace("<db_password>", db_pass).replace("<db_name>", db_name)
    else:
        mongo_uri = f"mongodb://localhost:27017/{db_name}"
    
    print("Connecting to MongoDB...")
    print(f"Database: {db_name}")
    
    try:
        # Connect to MongoDB
        client = MongoClient(mongo_uri)
        db = client[db_name]
        apartments_collection = db.apartments
        
        # Check if MP apartment already exists
        existing = apartments_collection.find_one({"id": "apt_mp001"})
        if existing:
            print("MP apartment already exists, removing old version...")
            apartments_collection.delete_one({"id": "apt_mp001"})
        
        # Create MP apartment document
        mp_apartment = {
            "id": "apt_mp001",
            "name": "MP MILAN & MP LIVIT",
            "address": "Plot No. 44B, Srinivasan Street, LIC Colony Extension, Pammal",
            "city": "Kanchipuram", 
            "state": "Tamil Nadu",
            "zipcode": "600075",
            "buildings": [
                {
                    "id": "bld_mp001a",
                    "name": "MP MILAN",
                    "floors": 10,
                    "total_units": 100
                },
                {
                    "id": "bld_mp001b",
                    "name": "MP LIVIT", 
                    "floors": 12,
                    "total_units": 120
                }
            ]
        }
        
        # Insert the apartment
        result = apartments_collection.insert_one(mp_apartment)
        
        print("✅ Successfully added MP MILAN & MP LIVIT apartment!")
        print(f"   Document ID: {result.inserted_id}")
        print(f"   Apartment ID: apt_mp001")
        print(f"   Apartment Name: MP MILAN & MP LIVIT")
        print(f"   Address: Plot No. 44B, Srinivasan Street, LIC Colony Extension, Pammal")
        print(f"   Location: Kanchipuram, Tamil Nadu - 600075")
        print(f"   Buildings: MP MILAN, MP LIVIT")
        
        # Verify the data was added
        print("\nVerifying data...")
        verification = apartments_collection.find_one({"id": "apt_mp001"})
        if verification:
            print("✅ Verification successful - MP apartment found in database")
            
            # Test the zipcode filter
            zipcode_results = list(apartments_collection.find({"zipcode": "600075"}))
            print(f"✅ Apartments with zipcode 600075: {len(zipcode_results)}")
            
            for apt in zipcode_results:
                print(f"   • {apt['name']} (ID: {apt['id']})")
        else:
            print("❌ Verification failed - apartment not found")
            
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_api_response():
    """Simulate what the API should return"""
    
    # Get MongoDB connection details
    db_user = os.getenv("MONGODB_USER_NAME")
    db_pass = os.getenv("MONGODB_PASSWORD")
    base_uri = os.getenv("MONGODB_URI") 
    db_name = os.getenv("DB_NAME", "ams")
    
    if base_uri and db_user and db_pass:
        mongo_uri = base_uri.replace("<db_user_name>", db_user).replace("<db_password>", db_pass).replace("<db_name>", db_name)
    else:
        mongo_uri = f"mongodb://localhost:27017/{db_name}"
    
    try:
        client = MongoClient(mongo_uri)
        db = client[db_name]
        apartments_collection = db.apartments
        
        print("\n" + "="*70)
        print("TESTING API RESPONSE: GET /api/apartments?zipcode=600075")
        print("="*70)
        
        # Query apartments with zipcode 600075 (same as API does)
        results = list(apartments_collection.find({"zipcode": "600075"}))
        
        print(f"Found {len(results)} apartment(s) with zipcode 600075:")
        
        api_response = []
        for apt in results:
            # Convert to API response format
            apartment_dict = {
                "id": apt["id"],
                "name": apt["name"], 
                "address": apt["address"],
                "city": apt["city"],
                "state": apt["state"],
                "zipcode": apt["zipcode"],
                "buildings": []
            }
            
            # Convert buildings
            for building in apt["buildings"]:
                apartment_dict["buildings"].append({
                    "id": building["id"],
                    "name": building["name"],
                    "floors": building["floors"],
                    "totalUnits": building["total_units"]
                })
            
            api_response.append(apartment_dict)
            print(f"  • {apt['name']} ({apt['city']}, {apt['state']})")
        
        print(f"\n📋 Expected API Response:")
        import json
        print(json.dumps(api_response, indent=2))
        
        client.close()
        return api_response
        
    except Exception as e:
        print(f"❌ Error testing API response: {str(e)}")
        return []

if __name__ == "__main__":
    print("="*70)
    print("ADDING MP MILAN & MP LIVIT APARTMENT TO DATABASE")
    print("="*70)
    
    success = add_mp_apartment_direct()
    
    if success:
        test_api_response()
        
        print("\n" + "="*70)
        print("🎉 MP APARTMENT SUCCESSFULLY ADDED!")
        print("="*70)
        print("\nYour API endpoint should now return:")
        print("http://localhost:5000/api/apartments?zipcode=600075")
        print("\nThis will include the MP MILAN & MP LIVIT apartment with both buildings!")
    else:
        print("\n❌ Failed to add MP apartment")
        
    print("\nNext steps:")
    print("1. Start your Flask server: python run.py")
    print("2. Test the API: http://localhost:5000/api/apartments?zipcode=600075")