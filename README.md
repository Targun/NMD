Docker Node.js 101
===============

## Requirements

- [boot2docker](http://boot2docker.io) is a VM to test docker on your local machine
- A [docker hub](http://hub.docker.com) account
- A [Digital Ocean](http://digitalocean.com) account

## Building on Boot2Docker
1: Meed to download both node and mongo to the machine.
```
docker pull mongo
```
```
docker pull node
```

2. cd into repo
2. Start a mongo intance
```
docker run --name some-mongo -d mongo
```

2. Run:(you can name in whatever you want)
```
docker build -t targun/nmd .
```
3. Connect application to DB
```
docker run -it --name some-app -P --link some-mongo:mongo -d targun/nmd
```

## Building & running your droplet
1. Login to Docker Account, click "+ Add Repository", and select automated build. Then select the github repository. 

2. root into your digital ocean machine with:
```
ssh root@0.0.0.0
```
3. Pull all the requirments
```
docker pull mongo
```
```
docker pull node
```
```
docker pull targun/nmd
```

## Handy Commands
- docker run <image>
- docker start <name || id>
- docker stop <name || id>
- docker ps [-a includes stopped containers]
- docker rm <name || id>
- docker exec -it <name> bash


Test image command:
```
docker run -p 8080:80 tutum/hello-world
```
