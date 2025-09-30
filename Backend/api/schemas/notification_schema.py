from .. import ma
from marshmallow import fields

class NotificationSchema(ma.Schema):
    class Meta:
        fields = ('_id', 'message', 'user_id', 'type', 'read', 'timestamp')
        
    _id = fields.Str()
    message = fields.Str(required=True)
    user_id = fields.Str(required=True)
    type = fields.Str(required=True)
    read = fields.Boolean()
    timestamp = fields.DateTime()