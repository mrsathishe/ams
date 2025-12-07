"""
MongoDB Collections Creation Script (Minimal)
Creates only the necessary collections and indexes without sample data
"""
import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.apartment_model import Apartment
from app.models.user_model import User
from app.config import Config
import mongoengine

def create_collections():
    """Create MongoDB collections with indexes"""
    
    print("Connecting to MongoDB...")
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    print("Creating collections and indexes...")
    
    # Users Collection
    print("\n1. Creating Users collection...")
    try:
        # Ensure collection exists and create indexes
        User.create_index([("email", 1)], unique=True)
        User.create_index([("user_id", 1)], unique=True) 
        User.create_index([("phone", 1)], unique=True)
        User.create_index([("city", 1), ("state", 1), ("zipcode", 1)])
        User.create_index([("apartment_name", 1)])
        User.create_index([("building_name", 1)])
        print("✓ Users collection created with indexes")
    except Exception as e:
        print(f"Users collection: {str(e)}")
    
    # Apartments Collection  
    print("\n2. Creating Apartments collection...")
    try:
        # Ensure collection exists and create indexes
        Apartment.create_index([("id", 1)], unique=True)
        Apartment.create_index([("name", 1)])
        Apartment.create_index([("city", 1), ("state", 1), ("zipcode", 1)])
        Apartment.create_index([("zipcode", 1)])
        print("✓ Apartments collection created with indexes")
    except Exception as e:
        print(f"Apartments collection: {str(e)}")
    
    print("\n✅ Collections setup completed!")
    print("\nCollections created:")
    print("• users - For user registration data")
    print("• apartments - For apartment and building data")

if __name__ == "__main__":
    create_collections()