#!/bin/bash

if ! [ -f key.pem -a -f cert.pem ]; then
	if [ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]; then
		openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "//C=CA\O=SOTI"
	else
		openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=CA/O=SOTI"
	fi
fi
