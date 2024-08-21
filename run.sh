#!/bin/bash

docker pull camunda/camunda-bpm-platform:latest
docker run -d --name camunda -p 8080:8080 camunda/camunda-bpm-platform:latest
sleep 30
node setup.db.js
node wokers.js
node create.groups.js
node deploy.js