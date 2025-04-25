#!/bin/sh
echo "running....."

if [ -z "$BASE_API" ]
then
    echo "not defined"
else 
    echo "defined $BASE_API"
    echo "===start file===="
    cat /usr/share/nginx/html/assets/config.json
    echo "===original file===="
    sed -i -e "s|http://localhost:8000|$BASE_API|g" /usr/share/nginx/html/assets/config.json
    sed -i -e "s|0.0.1|$TERELEASE|g" /usr/share/nginx/html/assets/config.json
    if [ -n "$APIKEY" ]; then
        sed -i -e "s|1234567890abcdef|$APIKEY|g" /usr/share/nginx/html/assets/config.json
    fi
    echo "===replaces===="
    cat /usr/share/nginx/html/assets/config.json
    echo "===finished===="
fi


echo "end"


