import uuid
from models.user.user import User  # Import your user model
from run.extensions import db  # Import your database instance
from factory import create_app
from models.models_ import *
app = create_app()



def populate_fs_uniquifier():
    with app.app_context():
        try:
            # Start a transaction
            with db.session.begin():
                # Query all users
                users = User.query.all()
                
                for user in users:
                    # Assign a unique value to fs_uniquifier if it's None or empty
                    if not user.fs_uniquifier:
                        user.fs_uniquifier = str(uuid.uuid4())  # Generate a unique identifier
                        
                # Commit the changes
                db.session.commit()
                
        except Exception as e:
            print(f"An error occurred: {e}")
            db.session.rollback()  # Rollback in case of an error

# Run the function
populate_fs_uniquifier()