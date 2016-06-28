#!/bin/bash

mongo="C:/Program Files/MongoDB"

if [ $# -eq 1 -a "$1" != "skip" ]; then
	data=$1
elif [ $# -eq 2 ]; then
	if [ "$1" == "skip" ]; then
		data=$2
	else
		mongo=$1
		data=$2
	fi
elif [ $# -eq 3 -a "$1" == "skip" ]; then
	mongo=$2
	data=$3
else
	echo "win_x64.sh [skip] [mongo_location] <database>"
	exit 1
fi

RED=$(tput setaf 1)
UNDERLINE=$(tput smul)
NORMAL=$(tput sgr0)

if [ "$1" != "skip" ]; then
	printf "${UNDERLINE}Downloading some stuff...${NORMAL}\n"
	curl -o node-installer.msi https://nodejs.org/download/release/latest-v4.x/node-v4.4.6-x64.msi
	curl -o mongo-installer.msi http://downloads.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.2.7-signed.msi

	printf "\n${UNDERLINE}Checking sha256sums...${NORMAL}\n"
	if ! sha256sum -c win_x64.sha256; then
		exit 1
	fi

	printf "\n${UNDERLINE}Uninstalling existing installations...${NORMAL}\n"
	msiexec -x node-installer.msi
	msiexec -x mongo-installer.msi

	printf "\n${UNDERLINE}Running installers...${NORMAL}\n"
	msiexec -i node-installer.msi
	msiexec -i mongo-installer.msi

	printf "\n${UNDERLINE}Installing dependencies...${NORMAL}\n"
	cd ../mean
	npm install -g bower
	npm install -g grunt-cli
	npm install

	printf "\n${UNDERLINE}Cleaning up...${NORMAL}\n"
	cd ../installer
	rm node-installer.msi mongo-installer.msi
fi

"$mongo/Server/3.2/bin/mongod.exe" --dbpath "$data" &
cd ../mean
grunt