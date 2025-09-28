FROM docker.io/node:24 AS builder

COPY . /brunsviga
WORKDIR /brunsviga

ENV REACT_APP_BASE_PATH="/"

RUN npm ci
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.28-alpine3.21-slim as runtime

COPY --from=builder /brunsviga/dist /usr/share/nginx/html/
RUN chown -R root:root /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html/
