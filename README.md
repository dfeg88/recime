# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* LJMU Final Year Project: A Usability-led Development of a Web-based Recipe Application

### How do I get set up? ###

1) MongoDB (database)

* Install version 3.6.3 (Community Server) from https://www.mongodb.com/download-center#community
* The MSI installer offers the option of installing the MongoDB GUI - Compass, install if you wish to view the data outside of CLI queries
* To run a local instance of MongoDB, navigate to its directory and open 'mongod.exe'. An example path would be C:\Program Files\MongoDB\Server\3.6\bin

2) Node.js

* Install the recommended version of Node.js on your machine from https://nodejs.org/
* Node Package Manager (npm) installs with node, which will be required to install all project dependencies prior to launching the application
* Once installation is completed, open your CLI and run 'node -v' and 'npm -v' to ensure that they have both installed correctly

3) Angular CLI

* Angular CLI allows you to 'serve' the angular project on port 4200 by default through the CLI (useful for development)
* Execute the following command to install it on your machine: 'npm install -g @angular/cli'
* To check it has installed, run the command 'ng -v' in your CLI, which should output the version number

### Installing project dependencies from package.json files ###

* Both the Node.js and Angular front-end have dependencies that need to be installed. Within each, the package.json file contains these dependencies
* In your CLI, navigate to the'reciMe' folder and execute the command 'npm install' or 'npm i'
* Once this has completed, there should be an extra folder called node_modules within this directory
* Do the same for the Angular part of the project by using the CLI to go into the 'recime-app' folder. Once again, run 'npm install' or 'npm i'
* Once this has completed, there should be an extra folder called node_modules within this directory

### How do I run the project locally? ###

* You will need three CLI windows open: one for MongoDB, one to run the Node server, and one the serve the Angular front-end
* To run MongoDB, navigate to its directory (example: C:\Program Files\MongoDB\Server\3.6\bin) and double click mongod.exe
* In the second CLI, cd into the 'reciMe' folder and type 'npm start'. If successful a message should appear saying 'Server started on port 3000'
* In the third CLI, cd into the reciMe/recime-app folder and type 'ng serve --o'. This will start the Angular project on port 4200. The '--o' will automatically open the project in your browser