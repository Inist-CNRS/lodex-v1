#!/bin/sh

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 example-name"
    exit 1
fi

if [ -e "data.json" ];  then
    cp ./data.json "example/$1.json"
else
    echo "data.json does not exist"
    exit 2
fi

if [ -d "example/$1/" ]; then
    cp ./data/* example/$1/
else
    echo "example/$1/ does not exist"
    exit 3
fi
