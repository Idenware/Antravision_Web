from flask_restful import Resource
from flask import make_response, jsonify, request
from marshmallow import ValidationError

from ..services.user_service import UserService
from ..schemas.user_schema import UserSchema

class UserList(Resource):
    def get(self):
        users = UserService.get_users()
        return make_response(jsonify(users), 200)
    
    def post(self):
        user_schema = UserSchema()
        try:
            data = user_schema.load(request.get_json())
        except ValidationError as err:
            return make_response(jsonify(err.messages), 400)
            
        result = UserService.add_user(data)
        
        
        if 'password' in result:
            result.pop('password', None)
            
        return make_response(jsonify(result), 201)

class UserDetail(Resource):
    def get(self, id):
        user = UserService.get_user_by_id(id)
        if user is None:
            return make_response(jsonify({"message": "Usuário não encontrado"}), 404)
            
        return make_response(jsonify(user), 200)
    
    def put(self, id):
        user_bd = UserService.get_user_by_id(id)
        if user_bd is None:
            return make_response(jsonify({"message": "Usuário não encontrado"}), 404)
        
        user_schema = UserSchema()
        try:
            data = user_schema.load(request.get_json(), partial=True)
        except ValidationError as err:
            return make_response(jsonify(err.messages), 400)
        
        updated_user = UserService.update_user(id, data)
        if updated_user:
            
            if 'password' in updated_user:
                updated_user.pop('password', None)
            return make_response(jsonify(updated_user), 200)
        else:
            return make_response(jsonify({"message": "Erro ao atualizar usuário"}), 500)
    
    def delete(self, id):
        user_bd = UserService.get_user_by_id(id)
        if user_bd is None:
            return make_response(jsonify({"message": "Usuário não encontrado"}), 404)
        
        UserService.delete_user(id)
        return make_response(jsonify({"message": "Usuário excluido com sucesso"}), 200)