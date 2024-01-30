FROM node:20-alpine3.16

WORKDIR /apptiktok

# COPY package.json .
# COPY package-lock.json .
# COPY vite.config.js .
# COPY tailwind.config.js .
# COPY postcss.config.js .
# COPY index.html .
# COPY ./src .
COPY . .

RUN npm install pm2 -g
RUN npm install --legacy-peer-deps
RUN npm run build

EXPOSE 5173

CMD ["pm2-runtime", "start", "npm", "--", "start"]
