#!/bin/bash
RED=$(tput setaf 1)
UNDERLINE=$(tput smul)
NORMAL=$(tput sgr0)

mongo="C:/Program Files/MongoDB"
data=$1
printf "\n${UNDERLINE}Starting Mongo...${NORMAL}\n"
"$mongo/Server/3.2/bin/mongod.exe" --dbpath "$data" > /dev/null &
printf "\n${UNDERLINE}Deleting Current Dist Folder...${NORMAL}\n"
cd Spore/front
rm -rf dist
npm install
printf "\n${UNDERLINE}Creating new build...${NORMAL}\n"
npm run build:prod
cd ../back
npm install
printf "\n${UNDERLINE}Starting Spore...${NORMAL}\n"
npm start
