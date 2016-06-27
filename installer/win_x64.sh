#!/bin/bash

RED=$(tput setaf 1)
UNDERLINE=$(tput smul)
NORMAL=$(tput sgr0)

db_path=$1

printf "${UNDERLINE}Downloading some stuff...${NORMAL}\n"
curl -o node-installer.msi https://nodejs.org/download/release/latest-v4.x/node-v4.4.6-x64.msi
curl -o mongo-installer.msi http://downloads.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.2.7-signed.msi

printf "\n${UNDERLINE}Checking sha256sums...${NORMAL}\n"
if ! sha256sum -c win_x64.sha256; then
	exit 1
fi

printf "\n${UNDERLINE}Running installer...${NORMAL}\n"
msiexec -i node-installer.msi
msiexec -i mongo-installer.msi

printf "\n${UNDERLINE}Getting MEAN git repo...${NORMAL}\n"
git submodule init
git submodule update

printf "\n${UNDERLINE}Installing dependencies...${NORMAL}\n"
cd ../mean
npm install -g bower
npm install -g grunt-cli
npm install

printf "\n${UNDERLINE}Cleaning up...${NORMAL}\n"
cd ../installer
rm node-installer.msi mongo-installer.msi

printf "\n${RED}Remember to launch mongodb and then run grunt!\n"
printf "	mongod.exe --dbpath \"path_to_database\"\n"
printf "	grunt${NORMAL}\n"
