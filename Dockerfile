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

RUN npm install --legacy-peer-deps
RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "dev" ]


# docker run -p 5173:5173 -d tiktokshop-folinas-frontend
# docker build -t tiktokshop-folinas-frontend .