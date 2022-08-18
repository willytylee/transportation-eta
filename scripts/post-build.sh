#!/bin/bash

year="$(date '+%Y')"
month="$(date +'%-m')"
day="$(date +'%-d')"
time="$(date +'%H%M')"
version=${year:3:1}.${month}${day}.${time:0:3}
echo ${version} > ./build/
