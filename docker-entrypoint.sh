#!/bin/bash

if [ "$(cat /app/data.json)" == "{}" ]; then
	cp -f /app/config.sample.json /app/data.json
fi

exec /app/lodex /app/data
