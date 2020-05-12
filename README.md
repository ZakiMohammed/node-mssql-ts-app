# NodeJS get along with MSSQL using TS

#### Install Typescript Compiler Globally
```
npm i -g typescript
```
#### Typescript Initialize
```
tsc --init
```
#### Updating TS Configuration
1. Update `target` from "es5" to "es6"
2. Update the `outDir` from './' to './dist' which will contains the compiled JS files
3. Update the `rootDir` from './' to './src' which will contains TS files
4. Uncomment `moduleResolution` to "node"
```
{
    "compilerOptions": {
        "target": "es6",
        "outDir": "./dist",
        "rootDir": "./src",
        "moduleResolution": "node"
    }
}
```
#### Initialize NPM
Initialize NPM for further configurations
```
npm --init
```

#### Install Express
Run the following command to install express as dependencies
```
npm i express
npm i mssql
npm i msnodesqlv8
npm i dotenv
```

#### Install Dev Dependencies 
Run the following command to install typescript, ts-node, nodemon, @types/node, @types/express and @types/mssql as dev dependency (we don't need these for production we need it for development)
```
npm i -D typescript ts-node nodemon @types/node @types/express @types/mssql
```
The `-D` above is for dev-dependencies. The dependencies in `package.json` will be as follows after running the above command:
```
"dependencies": {
    "express": "^4.17.1"
},
"devDependencies": {
    "@types/express": "^4.17.6",
    "@types/node": "^13.13.5",
    "nodemon": "^2.0.3",
    "ts-node": "^8.10.1",
    "typescript": "^3.8.3"
}
```

#### Update Package JSON Script
Update the `package.json` script command as follows:
```
"scripts": {
    "start": "node dist/index",
    "dev": "nodemon dist/index",
    "build": "tsc -p .",
    "test": "npm test"
},
```
