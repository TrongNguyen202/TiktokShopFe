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

EXPOSE 4173

CMD [ "npm", "run", "preview", "--host", "0.0.0.0"]


# docker run -p 80:5173 -d tiktokshop-folinas-fe
# docker build -t tiktokshop-folinas-fe .   
