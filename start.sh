#!/bin/bash

MONGO_HOME="C:/Program Files/MongoDB"
DEFAULT_DB="C:/data/db"

RED=$(tput setaf 1)
UNDERLINE=$(tput smul)
NORMAL=$(tput sgr0)

KERNEL=$(uname -s)

# Fail gracefully is user attempts to run on Linux or macOS
if [ "${KERNEL^^}" == "LINUX" -o "${KERNEL^^}" == "DARWIN" ]; then
    printf "\n${RED}This script only supports Bash on Windows.${NORMAL}\n"
    exit 1
fi

mongo="$MONGO_HOME"
if [ -z $1 ]; then
    data="$DEFAULT_DB"
else
    data="$1"
fi

printf "\n${UNDERLINE}Starting Mongo...${NORMAL}\n"
"$mongo/Server/3.2/bin/mongod.exe" --dbpath "$data" > /dev/null &

printf "\n${UNDERLINE}Deleting front/dist...${NORMAL}\n"
cd Spore/front
rm -rf dist

printf "\n${UNDERLINE}Installing node_modules for front...${NORMAL}\n"
npm install

printf "\n${UNDERLINE}Creating new build for front...${NORMAL}\n"
npm run build:prod

printf "\n${UNDERLINE}Installing node_modules for back...${NORMAL}\n"
cd ../back
npm install

printf "\n${UNDERLINE}Starting Spore...${NORMAL}\n"
npm start
