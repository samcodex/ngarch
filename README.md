# NgArch
NgArch is an Angular application architecture tool, analyzing the static structure of the Angular application and visually displaying the modules, components, services and data models in multiple diagrams. This repo is the web app(client) of the NgArch

## Description
NgArch is an Angular application architecture tool, analyzing the static structure of the Angular application and visually displaying the modules, components, services and data models in multiple diagrams.

NgArch(Angular application architecture tool) contains two parts.
The server, called ngarch-server, is a node + express application. 
The client, called ngarch, is an Angular 5 application.

The server analyzes the Typescript source code and extracts the elements of the Angular application. The client visually shows the elements and the structure of the application in multiple diagrams.

<p>Early Loading and Lazy Loading</p>
<img src="https://github.com/samcodex/ngarch/blob/master/assets/modules_loading_groups.png" width="500px"/>
<br>

<p>Modules, Components, Servers and Data Models Diagram</p>
<img src="https://github.com/samcodex/ngarch/blob/master/assets/modules_components.png" width="500px"/>


## Usage
Install ngarch-app which contains the server(ngarch-server) and the client(ngarch).

`git clone https://github.com/samcodex/ngarch-app.git`
then
npm install

### To launch the server
npm start
The server uses port 3000

### To access the client
In browser, enter 'http://localhost:3000'

### To install ngarch-server
npm install ngarch-server

### To install ngarch
npm install ngarch
