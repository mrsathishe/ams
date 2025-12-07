from mongoengine import Document, StringField, IntField, EmbeddedDocument, ListField, EmbeddedDocumentField


class Building(EmbeddedDocument):
    id = StringField(required=True)
    name = StringField(required=True, max_length=255)
    floors = IntField(default=1)
    total_units = IntField(default=0)


class Apartment(Document):
    id = StringField(required=True, unique=True, primary_key=True)
    name = StringField(required=True, max_length=255)
    address = StringField(max_length=500)
    city = StringField(required=True, max_length=100)
    state = StringField(required=True, max_length=50)
    zipcode = StringField(required=True, max_length=10)
    buildings = ListField(EmbeddedDocumentField(Building))

    meta = {'collection': 'apartments'}

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city,
            "state": self.state,
            "zipcode": self.zipcode,
            "buildings": [
                {
                    "id": building.id,
                    "name": building.name,
                    "floors": building.floors,
                    "totalUnits": building.total_units
                } for building in self.buildings
            ]
        }