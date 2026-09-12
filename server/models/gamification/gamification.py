# import datetime as dt

# from models.relational_tables.association_tables import skills_category_skill
# from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
# from sqlalchemy.orm import relationship
# from startup.setup_db import Base


# class SkillsCategory(Base):
#     __tablename__ = "skills_category"
#     id = Column(Integer, primary_key=True)
#     name = Column(String(100), nullable=False)


# class Skill(Base):
#     __tablename__ = "skill"

#     id = Column(Integer, primary_key=True)
#     name = Column(String(50), nullable=False)
#     description = Column(String(255), nullable=True)
#     users = relationship("User", secondary="user_skill", backref="skills")
#     categories = relationship(
#         "SkillsCategory", secondary=skills_category_skill, backref="skills"
#     )


# class UserSkill(Base):
#     __tablename__ = "user_skill"
#     user_id = Column(
#         Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True
#     )
#     skill_id = Column(Integer, ForeignKey("skill.id"), primary_key=True)
#     user = relationship("User", back_populates="user_skills")
#     skill = relationship("Skill", back_populates="user_skills")


# class Badge(Base):
#     __tablename__ = "badge"

#     id = Column(Integer, primary_key=True)
#     name = Column(String(50), nullable=False)
#     description = Column(Text)
#     avatar = Column(String(100), nullable=True)
#     category_id = Column(Integer, ForeignKey("skills_category.id"), nullable=True)


# class Goal(Base):
#     __tablename__ = "goal"

#     id = Column(Integer, primary_key=True)
#     user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
#     skill_id = Column(Integer, ForeignKey("skill.id"), nullable=False)
#     skill = relationship("Skill", backref="goals")
#     target_level = Column(Integer, nullable=False)
#     start_date = Column(DateTime, nullable=False, default=dt.datetime.now())
#     end_date = Column(dt.datetime)
