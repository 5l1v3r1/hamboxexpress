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
  - See [Download instructions](https://golang.org/doc/install) for download and install. Major distributions have binary packages. 
  - For Raspberry Pi you have to build from source following [these intstructions](http://dave.cheney.net/2012/09/25/installing-go-on-the-raspberry-pi)
  - For now you have to build scripts manually assuming `go` binary is in your PATH. From `hamboxexpress` directory:
      1. `cd serverscripts/go`
      2. `export GOPATH=$(pwd)`
      3. `export GOBIN=$GOPATH/bin`
      4. `go install src/main/netstatus.go`
      5. `go install src/main/lanconfig.go`
- node.js (including npm). See [node.js](http://nodejs.org/) 
- bower: install with `sudo npm install -g bower`
- Mongo-DB: normally you will find it in your Linux distribution. 
  - For other platforms see [MongoDB](http://www.mongodb.org/)
  - For Raspberry-Pi this is a bit of a problem since it is not present in Raspbian distribution so you have either to
      - Compile it on the Raspberry-Pi: this takes nearly a day but there is no option to do cross-compilation. You can follow [these instructions](http://ni-c.github.io/heimcontrol.js/get-started.html)
      - Find a binary archive: you may try [this](http://www.widriksson.com/install-mongodb-raspberrypi/) or [this](https://github.com/brice-morin/ArduPi/tree/master/mongodb-rpi)
      
###On client side:

Any modern browser (HTML5, javascript)

## Install and run

1. Clone this repository
2. cd into the repository: `cd hamboxexpress`
3. Start mongoDB if not done already. It should be something like `sudo service mongodb start`
4. `npm install`
5. `npm start`
6. connect with your browser to the Hambox ethernet address on port 8000

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
