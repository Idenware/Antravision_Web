from .. import mongo
from bson import ObjectId
from datetime import datetime, timedelta

class CaseService:
  @staticmethod
  def add_case(data):
    result = mongo.db.cases.insert_one(data)
    return mongo.db.cases.find_one({'_id': ObjectId(result.inserted_id)})
  
  @staticmethod
  def get_all_cases():
    return list(mongo.db.cases.find())
  
  @staticmethod
  def get_case_by_id(case_id):
    return mongo.db.cases.find_one({'_id': ObjectId(case_id)})
  
  @staticmethod
  def get_case_by_location(localizacao):
    return list(mongo.db.cases.find({'localizacao': localizacao}))
  
  @staticmethod
  def get_case_by_proprietario(proprietario):
    return list(mongo.db.cases.find({'proprietario': proprietario}))
  
  @staticmethod
  def update_case(case_id, updated_case):
    updated_case['updated_at'] = datetime.utcnow()

    updated_case_doc = mongo.db.cases.find_one_and_update(
      {'_id': ObjectId(case_id)},
      {'$set': updated_case},
      return_document=True
    )

    return updated_case_doc
  
  @staticmethod
  def delete_case(case_id):
    mongo.db.cases.delete_one({'_id': ObjectId(case_id)})

  @staticmethod
  def get_recent_cases():
    try:
      return mongo.db.cases.count_documents({})
    except Exception as e:
      print(f"Erro ao Obter casos recentes: {str(e)}")
      return 0
    
  @staticmethod
  def get_affected_hectares():
    try:
      pipeline = [
        {
          "$addFields":{
            "hectares_numeric": {"$toDouble": "$hectares"}
          }
        },
        {
          "$group":{
            "_id": None,
            "totalHectares": {"$sum": "$hectares_numeric"}
          }
        }
      ]
      result = list(mongo.db.cases.aggregate(pipeline))
      return result[0]['totalHectares'] if result and 'totalHectares' in result[0] else 0
    
    except Exception as e:
      print(f"Erro ao obter hectares afetados: {str(e)}")
      return 0
    
  @staticmethod
  def get_status_geral():
        try:
            hoje = datetime.utcnow()
            semana_atual_inicio = hoje - timedelta(days=hoje.weekday())
            semana_anterior_inicio = semana_atual_inicio - timedelta(days=7)

            casos_semana_atual = mongo.db.cases.count_documents({
                "created_at": {"$gte": semana_atual_inicio}
            })
            
            casos_semana_anterior = mongo.db.cases.count_documents({
                "created_at": {"$gte": semana_anterior_inicio, "$lt": semana_atual_inicio}
            })

            if casos_semana_anterior > 0:
                variacao_semanal = ((casos_semana_atual - casos_semana_anterior) / casos_semana_anterior) * 100
            else:
                variacao_semanal = 100 if casos_semana_atual > 0 else 0

            if variacao_semanal > 20:
                status = "Crítico"
            elif variacao_semanal > 10:
                status = "Alerta"
            elif variacao_semanal > -10:
                status = "Estável"
            else:
                status = "Melhorando"

            total_casos = mongo.db.cases.count_documents({})
              
            pipeline = [
                {
                    "$group": {
                        "_id": None,
                        "total_casos": {"$sum": 1},
                        "gravidade_media": {"$avg": {"$toDouble": "$nivelInfestacao"}}
                    }
                }
            ]
            gravidade_result = list(mongo.db.cases.aggregate(pipeline))
            gravidade_media = gravidade_result[0]['gravidade_media'] if gravidade_result else 0.0
            
            return {
                "status": status,
                "total_casos": total_casos,
                "gravidade_media": gravidade_media,
                "nivel_gravidade": "Moderada" if 2.5 <= gravidade_media < 4 else "Alta" if gravidade_media >= 4 else "Baixa"
            }
        except Exception as e:
            print(f"Erro ao obter status geral: {str(e)}")
            return {
                "status": "Indisponível",
                "variacao_semanal": 0,
                "total_casos": 0,
                "gravidade_media": 0,
                "nivel_gravidade": "Indisponível"
            }
    
  @staticmethod
  def get_previsao_risco():
        try:
            casos_recentes = list(mongo.db.cases.find({
                "created_at": {"$gte": datetime.utcnow() - timedelta(hours=24)}
            }))
            
            casos_criticos = sum(1 for caso in casos_recentes if caso.get('nivelInfestacao') == 'Crítico')
            
            if casos_criticos > 5:
                return {
                    "tempo": "2h",
                    "nivel": "Alto",
                    "descricao": "Alto risco nas próximas horas"
                }
            elif casos_criticos > 2:
                return {
                    "tempo": "4h",
                    "nivel": "Médio",
                    "descricao": "Médio risco nas próximas horas"
                }
            else:
                return {
                    "tempo": "6h",
                    "nivel": "Baixo",
                    "descricao": "Baixo risco nas próximas horas"
                }
        except Exception as e:
            print(f"Erro ao obter previsão de risco: {str(e)}")
            return {
                "tempo": "Indisponível",
                "nivel": "Indisponível",
                "descricao": "Dados indisponíveis"
            }
        
  @staticmethod
  def get_health_distribution():
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$nivelInfestacao",
                        "count": {"$sum": 1}
                    }
                }
            ]
            
            distribuicao = list(mongo.db.cases.aggregate(pipeline))
            total = sum(item['count'] for item in distribuicao)
            
            
            resultado = {}
            for item in distribuicao:
                nivel = item['_id']
                if nivel == 'Saudável':
                    resultado['Saudavel'] = round((item['count'] / total) * 100, 1)
                elif nivel == 'Moderado':
                    resultado['Moderado'] = round((item['count'] / total) * 100, 1)
                elif nivel == 'Crítico':
                    resultado['Critico'] = round((item['count'] / total) * 100, 1)
            
            return resultado
        except Exception as e:
            print(f"Erro ao obter distribuição de saúde: {str(e)}")
            return {"saudavel": 0, "moderado": 0, "critico": 0}
   
  @staticmethod
  def get_nursery_overview():
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$localizacao",
                        "total_casos": {"$sum": 1},
                        "total_mudas": {"$sum": "$qtdMudas"},
                        "umidade_media": {"$avg": "$umidade"},
                        "casos_criticos": {
                            "$sum": {"$cond": [{"$eq": ["$nivelInfestacao", "Crítico"]}, 1, 0]}
                        },
                        "casos_moderados": {
                            "$sum": {"$cond": [{"$eq": ["$nivelInfestacao", "Moderado"]}, 1, 0]}
                        },
                        "casos_saudaveis": {
                            "$sum": {"$cond": [{"$eq": ["$nivelInfestacao", "Saudável"]}, 1, 0]}
                        }
                    }
                }
            ]
            
            metrics = list(mongo.db.cases.aggregate(pipeline))
            
            total_viveiros = len(metrics)
            total_casos = sum(item['total_casos'] for item in metrics)
            total_mudas = sum(item['total_mudas'] for item in metrics)
            total_casos_criticos = sum(item['casos_criticos'] for item in metrics)

            return {
                "total_viveiros": total_viveiros,
                "total_casos": total_casos,
                "total_mudas": total_mudas,
                "total_casos_criticos": total_casos_criticos,
            }
        except Exception as e:
            print(f"Erro ao obter métricas de saúde: {str(e)}")
            return {
                "total_viveiros": 0,
                "total_casos": 0,
                "total_mudas": 0,
                "total_casos_criticos": 0,
            }

class ModalService:
  @staticmethod
  def get_nursery_details(viveiro_name):
     try:
        casos_viveiro = list(mongo.db.cases.find({
           "localizacao": viveiro_name
        }))

        if not casos_viveiro:
           return None
        
        total_casos = len(casos_viveiro)
        caso_critico = sum(1 for caso in casos_viveiro if caso.get('nivelInfestacao') == 'Crítico')
        caso_moderado = sum(1 for caso in casos_viveiro if caso.get('nivelInfestacao') == 'Moderado')
        caso_saudaveis = sum(1 for caso in casos_viveiro if caso.get('nivelInfestacao') == 'Saudável')

        total_mudas = sum(caso.get('qtdMudas', 0) for caso in casos_viveiro)

        umidades = [caso.get('umidade', 0) for caso in casos_viveiro if caso.get('umidade') is not None]
        umidade_media = sum(umidades) / len(umidades) if umidades else 75

        percentual_doentes = (total_casos / total_mudas) * 100 if total_mudas > 0 else 0
        percentual_saudaveis = 100 - percentual_doentes

        if percentual_doentes > 10:
           status_geral = "Crítico"
        elif percentual_doentes > 5:
           status_geral = "Alerta"
        else:
           status_geral = "Normal"

        return {
           "nome": viveiro_name,
           "status_geral": status_geral,
           "total_mudas": total_mudas,
           "total_casos": total_casos,
           "percentual_doentes": round(percentual_doentes, 1),
           "umidade": round(umidade_media,1),
           "saudaveis": caso_saudaveis,
           "moderados": caso_moderado,
           "criticos": caso_critico,
           "percentual_saudaveis": round(percentual_saudaveis, 1)
        }
     except Exception as e:
        print(f"Erro ao obter detalhes do viveiro: {str(e)}")
        return None
        

