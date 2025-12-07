"""
Flask CLI commands for database operations
"""
import click
from flask import current_app
from app.utils.db_init import setup_database, init_database, create_sample_apartments
from app.models.apartment_model import Apartment, Building

@click.command()
def init_db():
    """Initialize database collections and indexes."""
    click.echo('Initializing database...')
    if init_database():
        click.echo('✅ Database initialized successfully!')
    else:
        click.echo('❌ Database initialization failed!')

@click.command() 
def create_sample_data():
    """Create sample apartment data."""
    click.echo('Creating sample apartment data...')
    if create_sample_apartments():
        click.echo('✅ Sample data created successfully!')
    else:
        click.echo('❌ Failed to create sample data!')

@click.command()
def setup_db():
    """Complete database setup - collections, indexes, and sample data."""
    click.echo('Setting up complete database...')
    if setup_database():
        click.echo('✅ Database setup completed successfully!')
        click.echo('Your location-based registration API is ready!')
    else:
        click.echo('❌ Database setup failed!')

@click.command()
def add_mp_apartments():
    """Add MP MILAN & MP LIVIT apartment complex to database."""
    click.echo('Adding MP MILAN & MP LIVIT apartment complex...')
    
    try:
        # Check if apartment already exists
        existing_apartment = Apartment.objects(id="apt_mp001").first()
        if existing_apartment:
            click.echo('MP apartment complex already exists, updating...')
            existing_apartment.delete()
        
        # Create buildings for MP complex
        mp_milan_building = Building(
            id="bld_mp001a",
            name="MP MILAN",
            floors=10,
            total_units=100
        )
        
        mp_livit_building = Building(
            id="bld_mp001b", 
            name="MP LIVIT",
            floors=12,
            total_units=120
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
        
        click.echo('✅ Successfully added MP MILAN & MP LIVIT apartment complex!')
        click.echo(f'   Apartment ID: {mp_apartment.id}')
        click.echo(f'   Apartment Name: {mp_apartment.name}')
        click.echo(f'   Address: {mp_apartment.address}')
        click.echo(f'   Location: {mp_apartment.city}, {mp_apartment.state} - {mp_apartment.zipcode}')
        click.echo(f'   Buildings:')
        for building in mp_apartment.buildings:
            click.echo(f'     - {building.name} (ID: {building.id})')
        
        click.echo('\n🎉 You can now use "MP MILAN & MP LIVIT" in your registration API!')
        
    except Exception as e:
        click.echo(f'❌ Error adding MP apartments: {str(e)}')

def register_commands(app):
    """Register CLI commands with Flask app"""
    app.cli.add_command(init_db)
    app.cli.add_command(create_sample_data) 
    app.cli.add_command(setup_db)
    app.cli.add_command(add_mp_apartments)