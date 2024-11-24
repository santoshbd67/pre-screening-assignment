# Steps to deploy this Application
#### Note: I'm going to deploy this application on EC2 Instance as for the demo i have choose the default aws services like vpc and created instance of t2.medium and installed the required pakages like docker,docker-compose etc and created a new user

## 1.Clone the Repository and created branch
```
    git clone https://github.com/va2pt/pre-screening-assignment.git
    git checkout -b solutions-santosh
```
## 2.Make changes in source code
Made the some changes in frontend docker file App.js file backend data.py file so that frontend and backend can connect each other below are file which i have changed

    
##### frontend.Dockerfile
```
    FROM node:14

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./  
RUN npm install web-vitals
RUN npm install


COPY . .
# Set the backend URL for the frontend
ENV REACT_APP_BACKEND_URL=http://public_ip_instance:8000 
CMD ["npm", "start"]
EXPOSE 3000
```
#### backend.Dockerfile
```
# Use the official Python image from the Docker Hub
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt ./

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Command to run the FastAPI application using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] # made the changes in port

# Expose the port that Uvicorn will run on
EXPOSE 8000
```
#### App.js
```
import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for message display

  // Use an environment variable for the backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://public_ip_instance:8000"; # Instead of local host i changed to public ip of instance

  const handleSubmit = async (action) => {
    try {
      const response = await fetch(`${BACKEND_URL}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      // Set message based on response from the server
      if (response.ok) {
        setMessage(data.message || 'Success!'); // Success scenario
      } else {
        setMessage(data.message || 'Something went wrong.'); // Error scenario
      }

    } catch (error) {
      setMessage('Network error! Please try again.'); // Network error handling
    }
  };

  return (
    <div>
      <h1>Hello!</h1>
      <div>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passcode (4 digits)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength="4"
        />
        <button onClick={() => handleSubmit('create_user')}>Create User</button>
        <button onClick={() => handleSubmit('login')}>Login</button>
      </div>
      {message && <p>{message}</p>} {/* Display message to the user */}
    </div>
  );
}

export default App;
```
#### database.py
```
import os
import psycopg2

# Fetch the database connection URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")  # Make sure the environment variable is correctly named

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)
```

## 3.Created multi-stage docker file so that i can build and run the frontend backend and postresql in a docker-compose file
docker-compose.yml
```
version: '3.8'

services:
  db:
    image: postgres:14
    container_name: postgres-db
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: database_name
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: backend.Dockerfile
    container_name: backend-service
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/database_name
    ports:
      - "8000:8000"
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
      dockerfile: frontend.Dockerfile
    container_name: frontend-service
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```
## 4.Build and Run the dokcer container for frontend backend and postgresql
```
docker-compose up --build -d
```
## 5.Access the application 
##### forntend http://Instace_public_Ip:3000
##### backend http://Instace_public_Ip:8000/docs

## Create new user in UI
Access the application and add the new user
<img width="960" alt="frontend" src="https://github.com/user-attachments/assets/f3cfa5a2-22c6-47b1-858f-00f06ffaaf67">

<img width="960" alt="backend" src="https://github.com/user-attachments/assets/749acd73-f59a-4658-830e-c4e2dfb81b5a">


