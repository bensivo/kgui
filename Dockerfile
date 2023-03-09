FROM node:16 as angular

WORKDIR /app

ADD ./frontend/package*.json /app
RUN npm ci

ADD ./frontend /app
RUN npm run build


# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html

FROM golang:1.17.3-alpine

WORKDIR /app
COPY --from=angular /app/dist/app /app/frontend/dist/app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY ./internal ./internal
COPY ./cmd ./cmd

RUN go build -o kgui /app/cmd/kgui/main.go 

EXPOSE 8080

CMD ["./kgui"]
