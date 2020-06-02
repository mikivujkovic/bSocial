## Parts

Project consists of several parts:

## backend

### api - Express app that handles users, posts, comments

### kafka - Express app that handles sending messages to kafka and websockets

### elasticsearch - Express app that sends kafka messages to elasticsearch

## frontend

### React app for handling user feeds and following and receiving websocket notifications

Things that are not done:

## Docker - Kafka, Zookeeper and Elasticsearch are in the docker-compose file. Node microservices and React app are not because I had problems with bcrypt. They have to be started manually. In the next few days I will dockerize everything so it can be started with the single command

## Testing - Unit tests will be written in the next few days

## Elasticsearch queries - I will write them in the next few days

## Comments in the code - will be done in the following days

## CSS for frontend - maybe sometime
