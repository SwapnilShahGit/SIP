#!/bin/bash

tslint src/**/*.ts > tslint.txt
tslint src/app/**/*.ts >> tslint.txt
