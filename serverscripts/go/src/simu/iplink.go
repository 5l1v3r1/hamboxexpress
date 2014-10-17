package simu

//==================================================================================================
func IpAddrShow() map[string]interface{} {
    
    var iface string 
    ipdict := make(map[string]interface{})
    var iparray [6]interface{}
    
    iface = "lo"
    iparray[0] = 1
    iparray[1] = "UNKNOWN"
    iparray[2] = "loopback"
    iparray[3] = "00:00:00:00:00:00"
    iparray[4] = "127.0.0.1"
    iparray[5] = 8
    ipdict[iface] = iparray
    
    iface = "eth0"
    iparray[0] = 2
    iparray[1] = "UP"
    iparray[2] = "ether"
    iparray[3] = "be:ef:de:ad:fe:01"
    iparray[4] = "192.168.0.51"
    iparray[5] = 24
    ipdict[iface] = iparray
    
    iface = "wlan0"
    iparray[0] = 3
    iparray[1] = "UP"
    iparray[2] = "ether"
    iparray[3] = "be:ef:de:ad:ff:01"
    iparray[4] = "10.0.0.1"
    iparray[5] = 24
    ipdict[iface] = iparray
    
    iface = "wlan1"
    iparray[0] = 4
    iparray[1] = "UP"
    iparray[2] = "ether"
    iparray[3] = "be:ef:de:ad:ff:02"
    iparray[4] = "10.0.0.100"
    iparray[5] = 24
    ipdict[iface] = iparray

    iface = "wlan2"
    iparray[0] = 5
    iparray[1] = "DOWN"
    iparray[2] = "ether"
    iparray[3] = "be:ef:de:ad:ff:03"
    iparray[4] = ""
    iparray[5] = 0
    ipdict[iface] = iparray

    return ipdict
}


//==================================================================================================
func IpEthList() []string {

    var iplist []string
    
    iplist = append(iplist, "eth0")
    iplist = append(iplist, "wlan0")
    iplist = append(iplist, "wlan1")
    iplist = append(iplist, "wlan2")
    
    return iplist
}

//==================================================================================================
func IpList() map[string]string {
    
    ipdict := make(map[string]string);

    ipdict["lo"] = "UNKNOWN"
    ipdict["eth0"] = "UP"
    ipdict["wlan0"] = "UP"
    ipdict["wlan1"] = "UP"
    ipdict["wlan2"] = "DOWN"

    return ipdict;
}

//==================================================================================================
func IpNeighborsList(iface string) map[string][2]interface{} {
    
    neighdict := make(map[string][2]interface{})
    var neigharray [2]interface{}
    var macaddr string
    
    if iface == "wlan0" {
        macaddr = "be:ef:de:ad:00:02"
        neigharray[0] = "10.0.0.5"
        neigharray[1] = "STALE"
        neighdict[macaddr] = neigharray
    }
    
    if iface == "wlan1" {
        macaddr = "be:ef:de:ad:01:01"
        neigharray[0] = "10.0.0.15"
        neigharray[1] = "REACHABLE"
        neighdict[macaddr] = neigharray
        
        macaddr = "be:ef:de:ad:01:03"
        neigharray[0] = "10.0.0.12"
        neigharray[1] = "STALE"
        neighdict[macaddr] = neigharray
    }
    
    return neighdict
}
