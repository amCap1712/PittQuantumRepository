from pymongo import MongoClient

client = MongoClient()
db = client.test

print("# Properties Documents: " + str(db.properties.count_documents(filter={})))
print("# Molecule Documents: " + str(db.molecules.count_documents(filter={})))

print("Deleting")
db.properties.drop()
db.molecules.drop()

print("# Properties Documents: " + str(db.properties.count_documents(filter={})))
print("# Molecule Documents: " + str(db.molecules.count_documents(filter={})))
