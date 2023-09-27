#!/bin/bash 
rm -fr ./web 
node build.mjs 
docker-compose up -d web

directories=""

for dir in web/*; do  
   if [ "$dir" != "web/~partytown" ]; then
      line=$(echo  $dir | sed -r "s/.{4}//")   
      directories="$directories http://localhost:8080/$line"
   fi
done
docker run --shm-size=1g --network=host --rm -v "$(pwd)/web":/sitespeed.io sitespeedio/sitespeed.io:26.1.0-plus1 $directories $SITESPEED_OPTIONS