#!/bin/bash

# Kill background jobs on exit
trap 'trap - INT TERM EXIT; kill $(jobs -p) &> /dev/null; exit' INT TERM EXIT

DEFAULT_DB="C:/data/db"
MONGO_HOME="C:/Program Files/MongoDB"

RED=$(tput setaf 1)
UNDERLINE=$(tput smul)
NORMAL=$(tput sgr0)

KERNEL=$(uname -s)

# Fail gracefully is user attempts to run on Linux or macOS
if [ "${KERNEL^^}" == "LINUX" -o "${KERNEL^^}" == "DARWIN" ]; then
    printf "\n${RED}This script only supports Bash on Windows.${NORMAL}\n"
    exit 1
fi

data=${DEFAULT_DB}
mongo=${MONGO_HOME}

while getopts 'pd:' flag; do
    case "${flag}" in
        p) production=true ;;
        d) data="${OPTARG}" ;;
    esac
done

printf "\n${UNDERLINE}Starting Mongo...${NORMAL}\n"
mkdir -p "$data"
"$mongo/Server/3.2/bin/mongod.exe" --dbpath "$data" > /dev/null &

printf "\n${UNDERLINE}Deleting front/dist...${NORMAL}\n"
cd Spore/front
rm -rf dist

printf "\n${UNDERLINE}Installing node_modules for front...${NORMAL}\n"
npm install

if [ "$production" = true ]; then
    printf"\n${UNDERLINE}Building front-end for production...${NORMAL}\n"
    npm run build:prod
else
    printf "\n${UNDERLINE}Starting front-end development server...${NORMAL}\n"
    npm start &
fi

printf "\n${UNDERLINE}Installing node_modules for back...${NORMAL}\n"
cd ../back
npm install

printf "\n${UNDERLINE}Starting back-end...${NORMAL}\n"
npm start
