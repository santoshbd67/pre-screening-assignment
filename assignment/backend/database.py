import os
import psycopg2

# Fetch the database connection URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")  # Make sure the environment variable is correctly named

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)
