#!/bin/bash

if [ "$EZMASTER_MONGODB_HOST_PORT" != "" ]; then
  ./cli /app/example/data --connexionURI "mongodb://${EZMASTER_MONGODB_HOST_PORT:-lodex_db:27017}/lodex" --port 3000
else
  ./cli /app/example/data --connexionURI "mongodb://$MONGO_HOST_PORT/$MONGO_DATABASE" --port 3000
fi
