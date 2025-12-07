"""
Test the apartments API endpoint
This script tests the actual API endpoint you're using: /api/apartments?zipcode=600075
"""
import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.apartment_model import Apartment
from app.config import Config
import mongoengine
import json

def test_zipcode_filter():
    """Test the zipcode=600075 filter that matches your API call"""
    
    # Connect to MongoDB
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    print("="*70)
    print("TESTING: GET /api/apartments?zipcode=600075")
    print("="*70)
    
    # This is what the API endpoint does internally
    zipcode = "600075"
    apartments = Apartment.objects(zipcode=zipcode)
    
    print(f"🔍 Searching for apartments with zipcode: {zipcode}")
    print(f"📊 Found {apartments.count()} apartment(s)")
    
    if apartments.count() == 0:
        print("\n❌ No apartments found!")
        print("💡 Make sure you've added the sample data:")
        print("   python add_mp_apartments.py")
        print("   OR")
        print("   flask setup-db")
        return []
    
    # Convert to API response format
    result = []
    for apt in apartments:
        result.append(apt.to_dict())
    
    print(f"\n📋 API Response for: http://localhost:5000/api/apartments?zipcode=600075")
    print("="*70)
    print(json.dumps(result, indent=2))
    
    print(f"\n📍 Apartments in zipcode {zipcode}:")
    for apt in result:
        print(f"   • {apt['name']} ({apt['city']}, {apt['state']})")
        print(f"     - Address: {apt['address']}")
        print(f"     - Buildings: {len(apt['buildings'])}")
        for building in apt['buildings']:
            print(f"       * {building['name']} (ID: {building['id']})")
        print()
    
    return result

def test_other_api_calls():
    """Test other related API calls"""
    
    print("\n" + "="*70)
    print("OTHER USEFUL API ENDPOINTS")
    print("="*70)
    
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    # Test 1: All apartments
    print("\n1️⃣ GET /api/apartments (All apartments)")
    all_apartments = Apartment.objects()
    print(f"   Total apartments in database: {all_apartments.count()}")
    for apt in all_apartments:
        print(f"   • {apt.name} ({apt.zipcode})")
    
    # Test 2: Search MP apartments
    print("\n2️⃣ GET /api/apartments?search=MP")
    mp_apartments = Apartment.objects(name__icontains="MP")
    print(f"   MP apartments found: {mp_apartments.count()}")
    for apt in mp_apartments:
        print(f"   • {apt.name}")
    
    # Test 3: Get buildings for MP apartment
    print("\n3️⃣ GET /api/apartments/apt_mp001/buildings")
    mp_apartment = Apartment.objects(id="apt_mp001").first()
    if mp_apartment:
        buildings = []
        for building in mp_apartment.buildings:
            buildings.append({
                "id": building.id,
                "name": building.name,
                "floors": building.floors,
                "totalUnits": building.total_units
            })
        print(f"   Buildings in MP apartment:")
        print(json.dumps(buildings, indent=4))
    else:
        print("   ❌ MP apartment not found!")

def check_server_status():
    """Provide guidance on running the server"""
    
    print("\n" + "="*70)
    print("🚀 RUNNING YOUR FLASK SERVER")
    print("="*70)
    
    print("\nTo test the actual API endpoint, make sure your Flask server is running:")
    print("\n1. Start the Flask server:")
    print("   python run.py")
    print("   OR")
    print("   flask run --port=5000")
    
    print("\n2. Test the endpoint:")
    print("   curl http://localhost:5000/api/apartments?zipcode=600075")
    print("   OR open in browser:")
    print("   http://localhost:5000/api/apartments?zipcode=600075")
    
    print("\n3. Other endpoints to test:")
    print("   • http://localhost:5000/api/apartments")
    print("   • http://localhost:5000/api/apartments?search=MP")
    print("   • http://localhost:5000/api/apartments/apt_mp001/buildings")

def main():
    """Main function to test the API endpoint"""
    
    try:
        # Test the zipcode filter
        result = test_zipcode_filter()
        
        # Test other endpoints
        test_other_api_calls()
        
        # Provide server guidance
        check_server_status()
        
        print("\n" + "="*70)
        print("✅ API ENDPOINT TESTING COMPLETE!")
        print("="*70)
        
        if len(result) > 0:
            print(f"\n🎉 Your API endpoint should return {len(result)} apartment(s) for zipcode 600075")
            print("This includes the MP MILAN & MP LIVIT apartment complex!")
        else:
            print("\n⚠️  No data found. Please add the apartment data first:")
            print("   python add_mp_apartments.py")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)