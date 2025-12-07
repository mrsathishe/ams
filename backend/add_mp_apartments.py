"""
Add MP MILAN & MP LIVIT apartment data to the database
This script adds the specific apartment complex with both buildings
"""
import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.apartment_model import Apartment, Building
from app.config import Config
import mongoengine

def add_mp_apartments():
    """Add MP MILAN & MP LIVIT apartment complex to database"""
    
    # Connect to MongoDB
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    print("Adding MP MILAN & MP LIVIT apartment complex...")
    
    # Check if apartment already exists
    existing_apartment = Apartment.objects(id="apt_mp001").first()
    if existing_apartment:
        print("MP apartment complex already exists, updating...")
        existing_apartment.delete()
    
    # Create buildings for MP complex
    mp_milan_building = Building(
        id="bld_mp001a",
        name="MP MILAN",
        floors=10,  # Assuming 10 floors, you can adjust this
        total_units=100  # Assuming 100 units, you can adjust this
    )
    
    mp_livit_building = Building(
        id="bld_mp001b", 
        name="MP LIVIT",
        floors=12,  # Assuming 12 floors, you can adjust this
        total_units=120  # Assuming 120 units, you can adjust this
    )
    
    # Create the apartment complex
    mp_apartment = Apartment(
        id="apt_mp001",
        name="MP MILAN & MP LIVIT",
        address="Plot No. 44B, Srinivasan Street, LIC Colony Extension, Pammal",
        city="Kanchipuram",
        state="Tamil Nadu", 
        zipcode="600075",
        buildings=[mp_milan_building, mp_livit_building]
    )
    
    # Save to database
    mp_apartment.save()
    
    print("✅ Successfully added MP MILAN & MP LIVIT apartment complex!")
    print(f"   Apartment ID: {mp_apartment.id}")
    print(f"   Apartment Name: {mp_apartment.name}")
    print(f"   Address: {mp_apartment.address}")
    print(f"   Location: {mp_apartment.city}, {mp_apartment.state} - {mp_apartment.zipcode}")
    print(f"   Buildings:")
    for building in mp_apartment.buildings:
        print(f"     - {building.name} (ID: {building.id}, Floors: {building.floors}, Units: {building.total_units})")
    
    return mp_apartment

def verify_mp_apartment():
    """Verify the MP apartment was added correctly"""
    
    print("\nVerifying MP apartment complex...")
    
    # Search by apartment ID
    apartment = Apartment.objects(id="apt_mp001").first()
    if apartment:
        print("✅ Found apartment by ID")
        
        # Test search by name
        search_result = Apartment.objects(name__icontains="MP MILAN").first()
        if search_result:
            print("✅ Found apartment by name search")
        
        # Test zipcode filter
        zipcode_results = Apartment.objects(zipcode="600075")
        print(f"✅ Found {zipcode_results.count()} apartments with zipcode 600075")
        
        # Test city filter
        city_results = Apartment.objects(city="Kanchipuram")
        print(f"✅ Found {city_results.count()} apartments in Kanchipuram")
        
        return True
    else:
        print("❌ MP apartment not found!")
        return False

def main():
    """Main function to add and verify MP apartment"""
    
    print("="*60)
    print("ADDING MP MILAN & MP LIVIT APARTMENT COMPLEX")
    print("="*60)
    
    try:
        # Add MP apartment
        mp_apartment = add_mp_apartments()
        
        # Verify it was added correctly
        if verify_mp_apartment():
            print("\n" + "="*60)
            print("✅ MP APARTMENT COMPLEX ADDED SUCCESSFULLY!")
            print("="*60)
            print("\nThe apartment is now available for:")
            print("• User registration with location validation")
            print("• Apartment search API")
            print("• Building selection in registration")
            
            print(f"\nAPI Usage Examples:")
            print(f"• GET /api/apartments?search=MP")
            print(f"• GET /api/apartments?zipcode=600075") 
            print(f"• GET /api/apartments/apt_mp001/buildings")
            print(f"• POST /api/register (with apartmentName: 'MP MILAN & MP LIVIT')")
            
            return True
        else:
            print("❌ Verification failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error adding MP apartment: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎉 You can now use 'MP MILAN & MP LIVIT' in your registration API!")
    sys.exit(0 if success else 1)