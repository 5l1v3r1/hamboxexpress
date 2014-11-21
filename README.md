HamboxExpress
=============

Hamnet connection box control web interface constructed around Express, AngularJS, Bootstrap and Highcharts. Go language is used on server side for scripts interacting with the system.
This is a work in progress

# What is a Hambox?

Any computer or embedded computer (Raspberry Pi is the common choice) with a wireless LAN interface and a wired Ethernet interface which primary purpose is to serve as interface between your private LAN and the Hamnet. See [Hamnet](http://hamnetdb.net/). Hamnet is a kind of private network reserved for licenced amateur radio (a.k.a "hams") based on guess what... wireless networks.

Alternatively it can be used for any wireless "citizen wifi" type of network.

If you have an Amateur Radio License the wireless interface is preferably an interface that can access the specific Amateur Radio segments of the 2.3 or 5.7 GHz bands and work in reduced bandwidth modes a.k.a "half" and "quarter" modes. Practically these are adapters based on Atheros chipsets.

# What does HamboxExpress do?

HamboxExpress is a client-server web based interface which purpose is to control the Hambox.

The server resides on the Hambox and is based on node.js and MongoDB to keep the parameters and configurations.

# Getting started

## Requriements

###On server side:

- [Go language](https://golang.org). 
  - See [A tour of Go](https://tour.golang.org/#1) for a good tutoral.
  - See [Download instructions](https://golang.org/doc/install) for download and install. Major distributions have binary packages (Debian: golang-go). 
  - For Raspberry Pi you have to build from source following [these intstructions](http://dave.cheney.net/2012/09/25/installing-go-on-the-raspberry-pi)
- node.js (including npm). See [node.js](http://nodejs.org/) (Debian: nodejs npm)
  - In Debian node binary is installed as /usr/bin/nodejs. You need to create a symbolic link to node:
      1. `cd /usr/bin`
      2. `sudo ln -s nodejs node`
- bower: install with `sudo npm install -g bower`
- htdigest: install with `sudo npm install -g htdigest`
- Mongo-DB: normally you will find it in your Linux distribution (Debian: mongodb). 
  - For other platforms see [MongoDB](http://www.mongodb.org/)
  - For Raspberry-Pi this is a bit of a problem since it is not present in Raspbian distribution so you have either to
      - Compile it on the Raspberry-Pi: this takes nearly a day but there is no option to do cross-compilation. You can follow [these instructions](http://ni-c.github.io/heimcontrol.js/get-started.html)
      - Find a binary archive: you may try [this](http://www.widriksson.com/install-mongodb-raspberrypi/) or [this](https://github.com/brice-morin/ArduPi/tree/master/mongodb-rpi)
- network configuration: in `/etc/network` there should be one `interface.xxx` file per `xxx` netwok interface (ex: `eth0`) containing the interface configuration. The `interfaces` just includes them with `source` statements (ex: `source /etc/network/interface.eth0`). See `serverscripts/go/simuroot/etc/network` folder for an example.
- olsrd: it should be available from most distributions including Raspbian. You need the plugins package also (Debian: olsrd olsrd-plugins). For more information and source code see [olsrd website](http://www.olsr.org/).
  - You need a `/etc/olsrd/olsrd.conf`. See `serverscripts/go/simuroot/etc/olsrd/olsrd.conf` for an example.
  - To activate olsrd automatically uncomment `START_OLSRD="YES"` in `/etc/default/olsrd`
  - Reboot or launch olsrd: `sudo service olsrd start`
      
###On client side:

Any modern browser (HTML5, javascript)

## Install and run

1. Clone this repository
2. cd into the repository: `cd hamboxexpress`
3. Start mongoDB if not done already. It should be something like `sudo service mongodb start`
4. Create a password file in a `serverdata` directory:
  - `mkdir serverdata`
  - `htdigest -c serverdata/htpasswd "Config area" sysop`
  - Enter password for user `sysop` (or whatever user you decide to create)
  - You will need this login to start the client application
5. `npm install`
  - if asked for an angular version please choose reply for a 1.2.27 version
6. For now you have to build go scripts manually assuming `go` binary is in your PATH. From `hamboxexpress` cloned directory:
    1. `cd serverscripts/go`
    2. `export GOPATH=$(pwd)`
    3. `export GOBIN=$GOPATH/bin`
    4. `go install src/main/...` (do this for every .go file there)
    5. Alternatively if you use bash shell from the root of the cloned repository:
      - `source serverscripts/go/setenv.bash`
      - `find serverscripts/go/src/main/ -name *.go -exec go install {} \;`
    6. You may have to add `/sbin` to the path: `export PATH=/sbin:$PATH` in the shell that starts the server. Alternatively in Debian you can edit `/etc/profile` that sets `$PATH` for all users.
7. `npm start`
8. connect with your browser to the Hambox ethernet address on port 8000
  - Depending on the server machine and/or the network bandwidth the first load can take some time

## Limitations

- For now only IBSS (ad-hoc) mode for wireless is supported 

## Run behind a reverse proxy

Assume we want to expose the Hambox at the relative path /hambox/ from a server on the same network. Hambox address is `192.168.0.51` in this network. It should still be accessible directly at `http://192.168.0.51:8000/`. We will be using [nginx](http://nginx.org/en/) for the reverse proxy server. This is how the location section of the site configuration file should look like:

<pre><code>location /hambox/ {
        proxy\_set\_header X-Forwarded-Host $host;
        proxy\_set\_header X-Forwarded-Server $host;
        proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded_for;
        proxy\_set\_header Upgrade $http\_upgrade;
        proxy\_set\_header Connection "Upgrade";
        proxy\_pass http://192.168.0.51:8000/;
}
</pre></code>

This is pretty hard to put in place. This is how I made it work:

- in `views/index.html` all static paths are relative (i.e. not starting at root /)
- in `server.js` you have to add `app.enable('trust proxy');`
- in `public/javascripts/services.js` in the socket service you have to specify the path of the `socket.io` file seen from the client. See the code at the beginning of the service. This is designed to make the web sockets work in reverse proxy and direct mode.
