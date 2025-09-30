from flask_restful import Resource
from flask import make_response, jsonify, request

from ..services.case_service import CaseService
from ..schemas.case_schema import CaseSchema

class CaseList(Resource):
  def get(self):
    
    dados = CaseService.get_all_cases()

    case_schema = CaseSchema(many=True)
    return make_response(case_schema.jsonify(dados), 200)
  
  def post(self):
    case_schema = CaseSchema()
    errors = case_schema.validate(request.json)
    if errors:
      return make_response(jsonify(errors), 400)
    
    json_data = request.get_json()
    result = CaseService.add_case(json_data)
    return make_response(case_schema.jsonify(result), 201)

class CaseDetail(Resource):
  def get(self, id):
    dado = CaseService.get_case_by_id(id)
    if dado is None:
      return make_response(jsonify({"message": "Dados não encontrados"}), 404)
    
    data_schema = CaseSchema()
    return make_response(data_schema.jsonify(dado), 200)
  
  def put(self, id):
    dado = CaseService.get_case_by_id(id)
    if dado is None:
      return make_response(jsonify({"message": "Dados não encontrados"}), 404)
    
    data_schema = CaseSchema()
    errors = data_schema.validate(request.json, partial=True)
    if errors:
      return make_response(jsonify(errors), 400)
    
    json_data = request.get_json()
    updated_case = CaseService.update_case(id, json_data)
    return make_response(data_schema.jsonify(updated_case), 200)
  
  def delete(self, id):
    dado_bd = CaseService.get_case_by_id(id)
    if dado_bd is None:
      return make_response(jsonify({"message": "Dados não encontrados"}), 404)
    
    CaseService.delete_case(id)
    return make_response(jsonify({"message": "Dados excluidos com sucesso"}), 200)