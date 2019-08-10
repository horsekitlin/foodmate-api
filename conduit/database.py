from sqlalchemy.orm import relationship

from .compat import basestring
from .extensions import db

Column = db.Column
relationship = relationship
Model = db.Model

class SurrogatePK(object):
  __table_args__ = {'extend_existing': True}

  id = db.Column(db.Integer, primary_key=True)

  def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}

  @classmethod
  def get_by_id(cls, record_id):
    if any(
      (isinstance(record_id, basestring) and record_id.isdigit(),
      isinstance(record_id, (int, float))),
    ):
      return cls.query.get(int(record_id))

  