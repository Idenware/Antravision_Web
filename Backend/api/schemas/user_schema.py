from .. import ma
from marshmallow import fields, validate
from datetime import datetime

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'email', 'phone', 'password', 'address')
    
    id = fields.Str(attribute='_id', dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3))
    email = fields.Str(required=True, validate=validate.Email())
    phone = fields.Str(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8, error="A senha deve ter pelo menos 8 caracteres!"), load_only=True)
    address = fields.Dict()