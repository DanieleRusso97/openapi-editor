FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json vite.config.ts ./
COPY src ./src
COPY public ./public

RUN npm run build

CMD ["npm", "run", "preview"]