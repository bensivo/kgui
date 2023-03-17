# KGui
A minimalist and simple kafka client application.

## Run Kgui

Kgui can run in 2 different runtime environments:
- Webapp, with a golang backend
- Compiled desktop application (using Wails v2)

### Webapp, using Docker
```
docker build -t kgui .

docker run -p 8080:8080 kgui
```

Then open your browser to http://localhost:8080/app

### Webapp, running natively

In one terminal, compile the angular app with watch compilation:
```
cd frontend
npm i
npm run build
    // or `npm run build:watch` for live updates
```

In another terminal, run the go application
```
go mod download
go run cmd/kgui/main.go
```

Then open your browser to http://localhost:8080/app

### Run as Desktop app
To build wails for desktop.

Make sure you have the following versions installed:
- golang 1.17.3
- node.js 16.13.0

First, install the wails cli following the instructions [here](https://wails.io/docs/gettingstarted/installation/).

Then, to run the app with live-compilation:
```
wails dev
```

Or compiled it into a desktop executable:
```
wails build
```

Desktop mode has only been tested on MacOS.