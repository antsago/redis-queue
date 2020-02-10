FROM node:12

WORKDIR /usr/src/app

# Create run environment
COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD [ "node", "./src/index.js" ]