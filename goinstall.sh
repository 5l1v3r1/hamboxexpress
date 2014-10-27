#!/bin/bash
source serverscripts/go/setenv.bash
find serverscripts/go/src/main -type f -exec go install {} \;
