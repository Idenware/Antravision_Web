from .. import mongo
from bson import ObjectId
from datetime import datetime

class NotificationService:

  @staticmethod
  def add_notification(notification_data):
    result = mongo.db.notifications.insert_one(notification_data)
    return mongo.db.notifications.find_one({'_id': ObjectId(result.inserted_id)})
  
  @staticmethod
  def get_notifications_by_user(user_id, read=None):
    query = {'user_id': user_id}
    if read is not None:
      query['read'] = read
    return list(mongo.db.notifications.find(query).sort('timestamp', -1))
  
  @staticmethod
  def unread_notifications_count(user_id):
    return mongo.db.notifications.count_documents({
      'user_id': user_id,
      'read': False
    })
  
  @staticmethod
  def mark_as_read(notification_id):
    updated_notification = mongo.db.notifications.find_one_and_update(
      {'_id': ObjectId(notification_id)},
      {'$set': {'read': True}},
      return_document = True
    )
    return updated_notification
  
  @staticmethod
  def delete_notification(notification_id):
    mongo.db.notifications.delete_one({'_id': ObjectId(notification_id)})
