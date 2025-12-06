FROM node:18-alpine

WORKDIR /app

COPY saftey-framework/package*.json ./

RUN npm install

COPY saftey-framework/ .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
