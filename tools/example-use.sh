#!/bin/sh

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 example-name"
    exit 1
fi

if [ -e "example/$1.json" ];  then
    cp "example/$1.json" ./data.json
else
    echo "example/$1.json does not exist"
    exit 2
fi

if [ -d "example/$1/" ]; then
    cp example/$1/* ./data/
else
    echo "example/$1/ does not exist"
    exit 3
fi
