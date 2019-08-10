from datetime import datetime, timedelta
from conduit.database import Column, Model, SurrogatePK, db
from conduit.extensions import bcrypt


class UserModel(SurrogatePK, Model):
    __tablename__ = 'user'

    username = Column(db.String(64), unique=True, nullable=False)
    gender = Column(db.String(2))
    email = Column(db.String(64), unique=True)
    password_hash = Column(db.String(128))
    job_title = Column(db.String(64))
    info = Column(db.String(256))
    create_time = Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, email, password=None, **kwargs):
        db.Model.__init__(self, username=username, email=email, **kwargs)
        if password:
            self.set_password(password)
        else:
            self.password = None

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, value):
        return bcrypt.check_password_hash(self.password, value)

    @classmethod
    def get_users(self):
        return db.session.query(UserModel).all()

    def __repr__(self):
        return '<User({username!r})>'.format(username=self.username)
