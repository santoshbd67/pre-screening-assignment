FROM node:14

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./  
RUN npm install web-vitals
RUN npm install


COPY . .
# Set the backend URL for the frontend
ENV REACT_APP_BACKEND_URL=http://54.144.214.4:8000
CMD ["npm", "start"]
EXPOSE 3000
