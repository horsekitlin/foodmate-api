from foodmate import db
from datetime import datetime, timedelta
from flask import current_app
from foodmate.model.base import Base

class User(Base):
    uid = db.Column(db.String(64), primary_key = True) # Uid
    email = db.Column(db.String(64), unique=True) # 帳號（電子郵件）
    phone_number = db.Column(db.String(15)) # 電話號碼
    displayName = db.Column(db.String(64)) # 暱稱
    gender = db.Column(db.String(1)) # 性別 0 = 未選擇, 1 = Male, 2 = Female
    job_title = db.Column(db.String(24)) #職業
    rate = db.Column(db.Float) # 評價
    soulFood = db.Column(db.String(1)) # 靈魂食物 0 = 脆皮甜圈, 1 = 跳跳炸蝦, 2 = 安心壽司, 3 = 德國腸腸, 4 = 挨刀蘋果, 5 = 厭世披薩 
    disabled = db.Column(db.Boolean) # 帳號停用 False = 正常 , True = 停用
    info = db.Column(db.String(256)) # 自我介紹
    photo_url = db.Column(db.String(256)) # 大頭照
    isNotification = db.Column(db.Boolean) # 通知功能 True = 啟用, False = 停用
    isCamera = db.Column(db.Boolean) # 相機權限 True = 啟用, False = 停用
    isAlbum = db.Column(db.Boolean) # 相簿權限 True = 啟用, False = 停用
    createTime = db.Column(db.String(20)) # 創建時間
    lastSignInTime = db.Column(db.String(20)) # 上次登入時間

    def __repr__(self):
        return "uid={}, email={}, phone_number={}".format(
            self.uid, self.email, self.phone_number
        )
    
    @staticmethod
    def get_by_uid(uid):
        return db.session.query(User).filter(
            User.uid == uid
        ).first()
    
    @staticmethod
    def get_user_list():
        return db.session.query(User).all()