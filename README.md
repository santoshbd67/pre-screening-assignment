# Steps to deploy this Application
#### Note: I'm going to deploy this application on EC2 Instance as for the demo i have choose the default aws services like vpc and created instance of t2.medium and installed the required pakages like docker,docker-compose etc and created a new user

## 1.Clone the Repository and created branch
```
    git clone https://github.com/va2pt/pre-screening-assignment.git
    git checkout -b solutions-santosh
```
## 2.Make changes in source code
Made the some changes in frontend docker file App.js file backend data.py file so that frontend and backend can connect each other below are file which i have changed

    
##### frontend.dockerfile
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
