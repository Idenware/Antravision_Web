from .. import mongo
from bson import ObjectId
from ..utils.security import hash_password, verify_password
from datetime import datetime

class UserService:
    
    @staticmethod
    def add_user(user_data):
        if 'password' in user_data:
            user_data['password'] = hash_password(user_data['password'])
        
        now = datetime.utcnow()
        user_data['created_at'] = now
        user_data['updated_at'] = now

        result = mongo.db.users.insert_one(user_data)
        user = mongo.db.users.find_one({'_id': result.inserted_id})
        
       
        if user and '_id' in user:
            user['_id'] = str(user['_id'])
            user.pop('created_at', None)
            user.pop('updated_at', None)
            
        return user
    
    @staticmethod
    def get_users():
        users = list(mongo.db.users.find())
        # Convert ObjectId para string e remove campos de data
        for user in users:
            if '_id' in user:
                user['_id'] = str(user['_id'])
            user.pop('created_at', None)
            user.pop('updated_at', None)
        return users
    
    @staticmethod
    def get_user_by_id(user_id):
        try:
            user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
            if user and '_id' in user:
                user['_id'] = str(user['_id'])
                user.pop('created_at', None)
                user.pop('updated_at', None)
            return user
        except:
            return None
    
    @staticmethod
    def update_user(user_id, updated_data):
        if 'password' in updated_data:
            updated_data['password'] = hash_password(updated_data['password'])
        
        updated_data['updated_at'] = datetime.utcnow()
        try:
            updated_user = mongo.db.users.find_one_and_update(
                {'_id': ObjectId(user_id)},
                {'$set': updated_data},
                return_document=True
            )
        
            if updated_user and '_id' in updated_user:
                updated_user['_id'] = str(updated_user['_id'])
                updated_user.pop('created_at', None)
                updated_user.pop('updated_at', None)
                
            return updated_user
        except:
            return None
    
    @staticmethod
    def validate_login(email, password):
        user = mongo.db.users.find_one({'email': email})
        if user and verify_password(password, user['password']):
            if '_id' in user:
                user['_id'] = str(user['_id'])
            return user
        return None
    
    @staticmethod
    def delete_user(id):
        try:
            result = mongo.db.users.delete_one({'_id': ObjectId(id)})
            return result.deleted_count > 0
        except:
            return False