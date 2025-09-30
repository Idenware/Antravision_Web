from datetime import datetime

class Notification:
    def __init__(self, message, user_id, type, read=False):
        self.message = message
        self.user_id = user_id
        self.type = type
        self.read = read
        self.timestamp = datetime.utcnow()

    def to_dict(self):
        return{
            'message': self.message,
            'user_id': self.user_id,
            'type': self.type,
            'read': self.read,
            'timestamp': self.timestamp
        }