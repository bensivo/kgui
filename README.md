# KGui
A kafka client made for people.

## Run Kgui

Kgui can run in 2 different runtime environments:
- Webapp, with a golang backend
- Compiled desktop application (using Wails v2)

### Webapp, using Docker
```
docker run -p 8080:8080 bensivo/kgui:latest
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

## Publish docker
### Build and Publish Docker image
We use docker buildx to publish a multi-platform image for x86 and arm processors.

This command was tested using ubuntu, with the latest version of docker installed.

```
docker buildx create --driver docker-container  --name builder

docker buildx build -t bensivo/kgui:latest --platform=linux/arm64,linux/amd64 --push .
docker buildx build -t bensivo/kgui:<version> --platform=linux/arm64,linux/amd64 --push .
```


## Build and Sign
We use 'gon' to sign our wails application.

Steps:

1. Build the app with:  `wails build`
2. Follow this guide to generate an apple developer certificate, adn add it to your local keystore
   - https://localazy.com/blog/how-to-automatically-sign-macos-apps-using-github-actions
3. Update all the values in ./build/darwin/gon-sign.json
   - APPLE_EMAIL - set the env variable
   - APPLE_PASSWORD - set the env variable
   - APPLICATION_IDENTITY - from `security find-identity -v -p codesigning`. Configured in step 1.
4. Run gon
    ```
    gon -log-level=info ./build/darwin/gon-sign.json
    ```

Potential issues:
- To sign the app, your system must trust the CA cert that apple used to generate your apple developer certificate. You can find all of Apple's certificates here: https://www.apple.com/certificateauthority/ 
  - Inspect your signing cert, and find the CA cert at apple.com. Then, make sure teh CA cert is installed on your machine under the 'system' keychain, and is trusted.

