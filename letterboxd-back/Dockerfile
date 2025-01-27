FROM node:22.13.0-alpine

LABEL maintainer="Matheus S.Silva"

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD ["start"]
