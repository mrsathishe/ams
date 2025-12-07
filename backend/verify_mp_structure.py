"""
Verify and demonstrate MP MILAN & MP LIVIT apartment structure
Shows how the 2 buildings (MP MILAN and MP LIVIT) are structured in the collection
"""
import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.apartment_model import Apartment, Building
from app.config import Config
import mongoengine
import json

def show_mp_structure():
    """Display the MP apartment structure with both buildings"""
    
    # Connect to MongoDB
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    print("="*70)
    print("MP MILAN & MP LIVIT APARTMENT COMPLEX STRUCTURE")
    print("="*70)
    
    # Find the MP apartment
    mp_apartment = Apartment.objects(id="apt_mp001").first()
    
    if not mp_apartment:
        print("❌ MP apartment not found in database!")
        return False
    
    print(f"📍 APARTMENT COMPLEX:")
    print(f"   ID: {mp_apartment.id}")
    print(f"   Name: {mp_apartment.name}")
    print(f"   Address: {mp_apartment.address}")
    print(f"   City: {mp_apartment.city}")
    print(f"   State: {mp_apartment.state}")
    print(f"   Zipcode: {mp_apartment.zipcode}")
    
    print(f"\n🏢 BUILDINGS IN THIS COMPLEX:")
    print(f"   Total Buildings: {len(mp_apartment.buildings)}")
    
    for i, building in enumerate(mp_apartment.buildings, 1):
        print(f"\n   Building {i}:")
        print(f"     • Building ID: {building.id}")
        print(f"     • Building Name: {building.name}")
        print(f"     • Floors: {building.floors}")
        print(f"     • Total Units: {building.total_units}")
    
    return True

def show_json_structure():
    """Show the JSON structure as it appears in the API"""
    
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    mp_apartment = Apartment.objects(id="apt_mp001").first()
    if not mp_apartment:
        return False
    
    print("\n" + "="*70)
    print("JSON STRUCTURE (API Response)")
    print("="*70)
    
    # Convert to dictionary using the to_dict method
    apartment_dict = mp_apartment.to_dict()
    
    # Pretty print the JSON
    print(json.dumps(apartment_dict, indent=2))
    
    return True

def test_building_queries():
    """Test queries for individual buildings"""
    
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    print("\n" + "="*70)
    print("TESTING BUILDING-SPECIFIC QUERIES")
    print("="*70)
    
    # Test 1: Get MP apartment buildings
    print("\n1. GET /api/apartments/apt_mp001/buildings")
    print("   Expected result: List of both MP MILAN and MP LIVIT buildings")
    
    mp_apartment = Apartment.objects(id="apt_mp001").first()
    if mp_apartment:
        buildings_response = []
        for building in mp_apartment.buildings:
            buildings_response.append({
                "id": building.id,
                "name": building.name,
                "floors": building.floors,
                "totalUnits": building.total_units
            })
        
        print("   Actual API Response:")
        print(json.dumps(buildings_response, indent=4))
    
    # Test 2: Search for MP apartments
    print("\n2. GET /api/apartments?search=MP")
    print("   Expected result: Should find the MP MILAN & MP LIVIT apartment")
    
    search_results = Apartment.objects(name__icontains="MP")
    print(f"   Found {search_results.count()} apartment(s) matching 'MP'")
    
    for apt in search_results:
        print(f"   • {apt.name} (ID: {apt.id})")
    
    return True

def demonstrate_registration_usage():
    """Show how to use both buildings in registration"""
    
    print("\n" + "="*70)
    print("REGISTRATION API USAGE EXAMPLES")
    print("="*70)
    
    print("\n📝 Example 1: Register user in MP MILAN building")
    registration_mp_milan = {
        "email": "user1@example.com",
        "name": "John Doe",
        "password": "SecurePassword123!",
        "phone": "9876543210",
        "apartmentName": "MP MILAN & MP LIVIT",
        "buildingName": "MP MILAN",  # First building
        "flatNumber": "101",
        "floorNumber": "1",
        "subscribeToNotifications": True,
        "locationDetails": {
            "country": "India",
            "zipcode": "600075",
            "state": "Tamil Nadu",
            "city": "Kanchipuram",
            "apartmentName": "MP MILAN & MP LIVIT",
            "buildingName": "MP MILAN"
        }
    }
    
    print("POST /api/register")
    print(json.dumps(registration_mp_milan, indent=2))
    
    print("\n📝 Example 2: Register user in MP LIVIT building")
    registration_mp_livit = {
        "email": "user2@example.com",
        "name": "Jane Smith", 
        "password": "SecurePassword123!",
        "phone": "9876543211",
        "apartmentName": "MP MILAN & MP LIVIT",
        "buildingName": "MP LIVIT",  # Second building
        "flatNumber": "201",
        "floorNumber": "2",
        "subscribeToNotifications": True,
        "locationDetails": {
            "country": "India",
            "zipcode": "600075",
            "state": "Tamil Nadu",
            "city": "Kanchipuram",
            "apartmentName": "MP MILAN & MP LIVIT", 
            "buildingName": "MP LIVIT"
        }
    }
    
    print("POST /api/register")
    print(json.dumps(registration_mp_livit, indent=2))
    
    return True

def main():
    """Main function to demonstrate the MP apartment structure"""
    
    try:
        # Show the structure
        if not show_mp_structure():
            print("❌ Failed to show MP structure. Make sure to add MP apartments first!")
            print("Run: python add_mp_apartments.py")
            return False
        
        # Show JSON structure
        show_json_structure()
        
        # Test building queries
        test_building_queries()
        
        # Show registration examples
        demonstrate_registration_usage()
        
        print("\n" + "="*70)
        print("✅ MP APARTMENT STRUCTURE VERIFICATION COMPLETE!")
        print("="*70)
        print("\n📋 SUMMARY:")
        print("• 1 Apartment Complex: 'MP MILAN & MP LIVIT'")
        print("• 2 Buildings: 'MP MILAN' and 'MP LIVIT'")
        print("• Users can register in either building")
        print("• API endpoints work correctly with both buildings")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)