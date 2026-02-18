FROM node:22-alpine
RUN npm install -g @angular/cli
WORKDIR /app
RUN chown -R node:node /app
USER node
EXPOSE 4200
