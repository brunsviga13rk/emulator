FROM docker.io/node:20 AS builder

COPY . /brunsviga
WORKDIR /brunsviga

RUN npm ci
RUN npm run build

FROM docker.io/nginx:1.27.3-alpine as runtime

COPY --from=builder /brunsviga/dist /usr/share/nginx/html/
RUN chown -R 1000:1000 /usr/share/nginx/html/