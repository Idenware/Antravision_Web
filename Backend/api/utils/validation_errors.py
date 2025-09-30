from flask import jsonify
from marshmallow import ValidationError

def register_validation_errors(app):
  @app.errorhandler(ValidationError)
  def handle_validation_error(error):
    return jsonify({
      'error': 'Erro de validação',
      'message': error.messages
    }), 422