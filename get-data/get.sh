#!/bin/bash

curl 'https://www.dunkindonuts.com/bin/servlet/dsl' -X POST -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0' -H 'Accept: */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: none' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'X-Requested-With: XMLHttpRequest' -H 'CSRF-Token: undefined' -H 'Origin: https://www.dunkindonuts.com' -H 'Connection: keep-alive' -H 'Referer: https://www.dunkindonuts.com/en/locations?location=01603' -H 'Sec-Fetch-Dest: empty' -H 'Sec-Fetch-Mode: cors' -H 'Sec-Fetch-Site: same-origin' -H 'DNT: 1' -H 'TE: trailers' --data-raw 'service=DSL&origin=42.23987959999999%2C-71.8393443&radius=250000&maxMatches=300000&pageSize=1&units=m&ambiguities=ignore' -o data.json

node ./dunkin-to-geojson.js > dunkin-location.json

mv dunkin-location.json ../data
rm data.json