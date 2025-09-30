from flask_restful import Resource
from flask import make_response, jsonify, request

from ..services.notification_service import NotificationService
from ..schemas.notification_schema import NotificationSchema

class NotificationList(Resource):
    def get(self):
        user_id = request.args.get('user_id')
        
        if not user_id:
            return make_response(jsonify({"error": "O ID é obrigatório"}), 400)
        
        notifications = NotificationService.get_notifications_by_user(user_id)
        notification_schema = NotificationSchema(many=True)
        
        return make_response(jsonify({
            "notifications": notification_schema.dump(notifications)
        }), 200)
    
    def post(self):
        notification_schema = NotificationSchema()
        errors = notification_schema.validate(request.json)
        if errors:
            return make_response(jsonify(errors), 400)
        
        json_data = request.get_json()
        result = NotificationService.add_notification(json_data)
        return make_response(notification_schema.jsonify(result), 201)

class NotificationDetail(Resource):
    def patch(self, id):
        updated_notification = NotificationService.mark_as_read(id)
        if updated_notification is None:
            return make_response(jsonify({"message": "Notificação não encontrada"}), 404)
        
        notification_schema = NotificationSchema()
        return make_response(notification_schema.jsonify(updated_notification), 200)
    
    def delete(self, id):
        notification = NotificationService.get_notifications_by_user(id)
        if notification is None:
            return make_response(jsonify({"message": "Notificação não encontrada"}), 404)
        
        NotificationService.delete_notification(id)
        return make_response(jsonify({"message": "Notificação excluída com sucesso"}), 200)