# d2d - Directory to Directory Templating

<p align="center">
 <a href="https://www.npmjs.com/package/d2d" alt="d2d NPM Package">
  <img src="https://img.shields.io/npm/v/d2d" alt="Shield showing the latest NPM version"/></a>
 <a href="https://hub.docker.com/r/jeffspies/d2d" alt="d2d Docker Image">
  <img src="https://img.shields.io/docker/v/jeffspies/d2d?label=docker&sort=semver" alt="Shield showing the latest Docker version" /></a>  
 <a href="https://github.com/JeffSpies/d2d/blob/main/LICENSE" alt="d2d LICENSE file on Github">
  <img src="https://img.shields.io/github/license/jeffspies/d2d" alt="Shield showing the repo license" /><a>
</p>

> It's basic use is to generate a direcory of files from a source template directory and configuration file, but with a map file it can send templated files anywhere.

## Features
- 🚀 Uses the hyper-fast and robust [Eta](https://github.com/eta-dev/eta) templating engine 
- 🔨 Has a docker image for repeatable templating in your build processes

## Usage

### Docker
```sh
docker run \
  --user $(UID):$(GID) \
  -v $(PWD)/example/.env:/.env \
  -v $(PWD)/example/templates:/input \
  -v $(PWD)/example/build/templates:/output \
  jeffspies/d2d:latest
```
  
### CLI
```sh
npm install -g d2d
d2d --help
d2d example/templates example/build/templates --env example/.env
```

### Node Library
```sh
npm install d2d
# or
yarn add d2d
```
  
```js
import * as d2d from 'd2d'
// or
const d2d = require('d2d')
```
