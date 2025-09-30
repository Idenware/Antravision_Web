from datetime import datetime

class Case:
    def __init__(self, localizacao, nivelInfestacao, status, dataDeteccao, proprietario, observacoes, hectares, qtdMudas, umidade):
        self.localizacao = localizacao
        self.nivelInfestacao = nivelInfestacao
        self.status = status
        self.dataDeteccao = dataDeteccao
        self.proprietario = proprietario
        self.observacoes = observacoes
        self.hectares = hectares
        self.qtdMudas = qtdMudas
        self.umidade = umidade
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'localizacao': self.localizacao,
            'nivelInfestacao': self.nivelInfestacao,
            'status': self.status,
            'dataDeteccao': self.dataDeteccao,
            'proprietario': self.proprietario,
            'observacoes': self.observacoes,
            'hectares': self.hectares,
            'qtdMudas': self.qtdMudas,
            'umidade': self.umidade,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }