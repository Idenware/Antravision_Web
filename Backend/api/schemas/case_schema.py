from .. import ma
from marshmallow import fields, validate

class CaseSchema(ma.Schema):
    class Meta:
        fields = ('_id', 'localizacao', 'nivelInfestacao', 'status', 'dataDeteccao', 'proprietario', 'observacoes', 'hectares', 'qtdMudas', 'umidade', 'created_at', 'updated_at')
        
    _id = fields.Str()
    localizacao = fields.Str(required=True)
    nivelInfestacao = fields.Str(required=True)
    status = fields.Str(required=True)
    dataDeteccao = fields.Str(required=True)
    proprietario = fields.Str(required=True)
    observacoes = fields.Str(required=True)
    hectares = fields.Number(required=True)
    qtdMudas = fields.Number(required=True)
    umidade = fields.Number(required=True)
    created_at = fields.DateTime()
    updated_at = fields.DateTime()