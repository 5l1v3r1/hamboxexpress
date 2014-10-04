HamboxExpress
=============

Hamnet connection box control web interface constructed around Express, AngularJS, Bootstrap and Highcharts
This is a work in progress

# What is a Hambox?

Any computer or embedded computer (Raspberry Pi is the common choice) with a wireless LAN interface and a wired Ethernet interface which primary purpose is to serve as interface between your private LAN and the Hamnet. See [Hamnet](http://hamnetdb.net/). Hamnet is a kind of private network reserved for licenced amateur radio (a.k.a "hams") based on guess what... wireless networks.

If you have an Amateur Radio License the wireless interface is preferably an interface that can access the specific Amateur Radio segments of the 2.3 or 5.7 GHz bands and work in reduced bandwidth modes a.k.a "half" and "quarter" modes. Practically these are adapters based on Atheros chipsets.

# What does HamboxExpress do?

HamboxExpress is a client-server web based interface which purpose is to control the Hambox.

The server resides on the Hambox and is based on node.js and MongoDB to keep the parameters and configurations.

# Getting started

## Requriements

###On server side:

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
