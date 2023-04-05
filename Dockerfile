FROM node:16 as angular

WORKDIR /app

ADD ./frontend/package*.json /app
RUN npm ci

ADD ./frontend /app
RUN npm run build

FROM golang:1.20.2-alpine3.17 as golang 
WORKDIR /app
COPY --from=angular /app/dist/app /app/frontend/dist/app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY ./internal ./internal
COPY ./cmd ./cmd

RUN go build -o kgui /app/cmd/kgui/main.go 

FROM alpine:3.17
WORKDIR /app

COPY --from=angular /app/dist/app /app/frontend/dist/app
COPY --from=golang /app/kgui /app/kgui

EXPOSE 8080
CMD ["./kgui"]
