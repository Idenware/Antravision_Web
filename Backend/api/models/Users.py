from datetime import datetime

class User:
    def __init__(self, username, email, phone, password, address):
         self.username = username
         self.email = email
         self.phone = phone
         self.password = password
         self.address = address

    def to_dict(self):
         return {
              'username': self.username,
              'email': self.email,
              'phone': self.phone,
              'password': self.password,
              'address': self.address
         }