# bionet-api
Bionet Api provides programmatic access to an instance of bionet node via a proxy server. The api provides a set of functions for performing queries, retrieving datasets, creating data objects, session authentication and more. Api access is provided for python and javascript.

# License and copyright
License: AGPLv3

Copyright 2018 BioBricks Foundation

# Installing

```
git clone https://github.com/biobricks/bionet-api
```

# Installing pre-requisites

Note: you might want to use your system's built in method for installing the latest version of nodejs rather than using nvm.

## nodejs using nvm method (recommended for development)

```
# install nvm
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# install node
nvm install --lts
```

## nodejs using package manager

The following is for Debian/Ubuntu based distros only. Instructions for many popular distros available [here](https://nodejs.org/en/download/package-manager/). 

```
curl -sL https://deb.nodesource.com/setup_6.x > /tmp/node_setup
# look at /tmp/node_setup and ensure that the script does what's expected
sudo -E bash /tmp/node_setup
sudo apt install nodejs
```

## npm packages

```
# install node packages
cd bionet-api/
npm install
```

# Running the bionet proxy server

## bionetProxyServer.js

## Usage examples:
```
Run the following commands from bionet-api:

Connect to server and login as user, listen for requests on port 8088:
node ./src/bionetProxyServer -protocol=https -host=endylab.stanford.edu -listen=8088 -username=xxxx -password=xxxx

Generate host configuration file
node ./src/bionetProxyServer -genHostConfig -protocol=https -host=endylab.stanford.edu -username=xxxx -password=xxxx >config.json

Connect to server via token, listen for requests on port 8088:
node ./src/bionetProxyServer -hostConfig=config.json -listen=8088

Upload batch of virtuals, create physical instances and place into container (note: replace container_id with actual id)

node ./src/bionetProxyServer -hostConfig=config.json -import_file=./tests/bulkUploadTest1.csv -import_format=csv \
-upload_method=virtual_to_physical -upload_container=container_id

```
# Running the python api example

## examples/bionetPythonApiExample.py

## Usage:
```
Run the following commands from bionet-api:

If bionet proxy service is not running, start proxy:
node ./src/bionetProxyServer -hostConfig=config.json -listen=8088

In separate terminal, run the following 
python3 ./examples/bionetPythonApiExample.py
```
