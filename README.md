# redis-queue
Repository to try a redis queue.

It consist of three different services:
  - Redis: a redis database
  - Producer: to add messages to the queue
  - Processor: to receive and process the messages

To start it run "docker-compose up" and then "npm start" the producer service to
add messages as necessary.

The repositories have been developed with Node v12.14.1. Producer will likely run with
anything ES8+, but it has not been tested. Processor needs, at least,
ES10, but no other versions have been tested either. Try 'nvm' if you normally use a different version.

For development try "docker-compose up redis" and "npm run dev" in processor.

Tests are only present in processor (producer is quite simple), to run them use "npm test"