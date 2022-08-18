#!/bin/bash

cp -rf /projects/eta/eta_app/build/* /var/www/eta.willytylee.com/

year="$(date '+%Y')"
month="$(date +'%-m')"
day="$(date +'%-d')"
time="$(date +'%H%M')"
version=${year:3:1}.${month}${day}.${time:0:3}
echo ${version} > /var/www/eta.willytylee.com/version.json
