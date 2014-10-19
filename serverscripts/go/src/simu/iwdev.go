package simu

import (
    "math/rand"
    "time"
)

//==================================================================================================
func IwDevAllDetails() map[string]interface{} {
    
    iwdict := make(map[string]interface{})
    var iwarray [8]interface{}   
    var iface string
    
    iface = "wlan0"
    iwarray[0] = 0                    // phy#
    iwarray[1] = "be:ef:de:ad:ff:01"  // mac address
    iwarray[2] = "IBSS"               // wireless link type
    iwarray[3] = "BroadbandHamnet-v2" // ESSID
    iwarray[4] = -3                   // channel
    iwarray[5] = 2392                 // frequency
    iwarray[6] = 5                    // bandwidth
    iwarray[7] = 300                  // tx power (mBm)
    iwdict[iface] = iwarray
    
    iface = "wlan1"
    iwarray[0] = 0                    // phy#
    iwarray[1] = "be:ef:de:ad:ff:02"  // mac address
    iwarray[2] = "IBSS"               // wireless link type
    iwarray[3] = "BroadbandHamnet-v2" // ESSID
    iwarray[4] = -3                   // channel
    iwarray[5] = 2412                 // frequency
    iwarray[6] = 20                   // bandwidth
    iwarray[7] = 600                  // tx power (mBm)
    iwdict[iface] = iwarray
    
    iface = "wlan2"
    iwarray[0] = 0                    // phy#
    iwarray[1] = "be:ef:de:ad:ff:03"  // mac address
    iwarray[2] = "IBSS"               // wireless link type
    iwarray[3] = ""                   // ESSID
    iwarray[4] = 0                    // channel
    iwarray[5] = 0                    // frequency
    iwarray[6] = 0                    // bandwidth
    iwarray[7] = 0                    // tx power (mBm)
    iwdict[iface] = iwarray
    
    return iwdict
}


//==================================================================================================
func IwDevList() []string {

    var iwlist []string
    
    iwlist = append(iwlist, "wlan0")
    iwlist = append(iwlist, "wlan1")
    iwlist = append(iwlist, "wlan2")
    
    return iwlist
}


//==================================================================================================
func IwDevPhyList() map[string]int {

    devdict := make(map[string]int)
    
    devdict["wlan0"] = 0
    devdict["wlan1"] = 1
    devdict["wlan2"] = 2
    
    return devdict
}


//==================================================================================================
func getTxPower(iface string) int {
    
    if iface == "wlan0" {
        return 300
    }
    
    if iface == "wlan1" {
        return 600
    }
    
    return 0
}


//==================================================================================================
func IwDevStaDump(iface string) map[string][7]interface{} {

    var macaddr string
    stadict := make(map[string][7]interface{})
    var staarray [7]interface{}
    
    r := rand.New(rand.NewSource(time.Now().UnixNano()))
    
    if iface == "wlan0" {
        macaddr = "be:ef:de:ad:00:01"
        staarray[0] = 6144
        staarray[1] = 0
        staarray[2] = 0
        staarray[3] = -42 + r.Intn(5);
        staarray[4] = -40 + r.Intn(2);
        staarray[5] = 6.0
        staarray[6] = 6.0
        
        stadict[macaddr] = staarray
        
        macaddr = "be:ef:de:ad:00:02"
        staarray[1] = 300
        staarray[2] = 100
        staarray[3] = -70 + r.Intn(5)
        staarray[4] = -68 + r.Intn(2)
        staarray[5] = 0.25
        staarray[6] = 6.0
        
        stadict[macaddr] = staarray
    }
    
    if iface == "wlan1" {
        macaddr = "be:ef:de:ad:01:01"
        staarray[0] = 6144
        staarray[1] = 0
        staarray[2] = 0
        staarray[3] = -85 + r.Intn(5)
        staarray[4] = -83 + r.Intn(2)
        staarray[5] = 0.25
        staarray[6] = 0.25
        
        stadict[macaddr] = staarray
        
        macaddr = "be:ef:de:ad:01:02"
        staarray[3] = -42 + r.Intn(5)
        staarray[4] = -40 + r.Intn(2)
        staarray[5] = 6.0
        staarray[6] = 6.0
        
        stadict[macaddr] = staarray
        
        macaddr = "be:ef:de:ad:01:03"
        staarray[3] = -70 + r.Intn(5)
        staarray[4] = -68 + r.Intn(2)
        staarray[5] = 0.25
        staarray[6] = 6.0
        
        stadict[macaddr] = staarray
    }
    
    return stadict
}
