# KGui
A desktop kafka client written using [Wails](https://wails.io).

## Installation
Currently the only way to install kgui is to build it from source.

This app was developed using versions:
- golang 1.17.3
- node.js 16.13.0

First, install wails following the instructions [here](https://wails.io/docs/gettingstarted/installation/).

Then, build the application on your machine.
```
$ git clone https://gitlab.com/bensivo/kgui.git
$ cd kgui
$ wails build
```

The application will be built into the 'build' folder.


## Development
### Browser
Run an in-browser instance with 2 terminals:
```
$ cd frontend
$ npm i
$ npm run start
```
```
$ go run cmd/kgui/main.go
```

Then navigate to your browser at http://localhost:4200



### Native
Some features, like file dialogs, are not available when developing in a browser. To develop locally using native windows, run:
```
wails dev
```