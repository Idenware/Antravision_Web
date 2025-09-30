from flask import Flask, jsonify
from flask_restful import Api
from flask_pymongo import PyMongo
from flask_marshmallow import Marshmallow
from flask_cors import CORS

from .config import Config
from .utils.validation_errors import register_validation_errors

mongo = PyMongo()
ma = Marshmallow()

def create_app():
  app = Flask(__name__)
  register_validation_errors(app)
  app.config.from_object(Config)

  CORS(app)
  mongo.init_app(app)
  ma.init_app(app)
  

  from .resources.auth import Login
  from .resources.users import UserDetail, UserList
  from .resources.case import CaseDetail, CaseList
  from .resources.notifications import NotificationDetail, NotificationList

  api = Api(app)

  api.add_resource(Login, '/api/login') 
  api.add_resource(UserList, '/api/users') 
  api.add_resource(UserDetail, '/api/users/<id>') 
  api.add_resource(CaseList, '/api/case') 
  api.add_resource(CaseDetail, '/api/case/<id>') 
  api.add_resource(NotificationList, '/api/notifications') 
  api.add_resource(NotificationDetail, '/api/notifications/<id>')

  @app.route('/')
  def index():
      return jsonify({"message": "API está Rodando"})

  return app