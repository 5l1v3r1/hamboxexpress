package execcmd

import (
    "strings"
    "regexp"
    "os"
    "os/exec"
)


//==================================================================================================
func IwDevAllDetails() map[string]interface{} {
    app := "iw"
    args := [1]string{"dev"}
    
    cmd := exec.Command(app, args[0])
    out, err := cmd.Output()
    
    if err != nil {
        println(err.Error())
        os.Exit(2)
    }
    
    var outstr = string(out)
    
    phy_re := regexp.MustCompile("phy#(\\d+)")
    iface_re := regexp.MustCompile("\\s+Interface (\\S+)")
    mac_re := regexp.MustCompile("\\s+addr (\\S+)")
    ssid_re := regexp.MustCompile("\\s+ssid (\\S+)")
    type_re := regexp.MustCompile("\\s+type (\\S+)")
    chan_re := regexp.MustCompile("\\s+channel (\\S+) (\\S+).+width: (\\d+) MHz.*")
    
    var phy_m []string = nil
    var iface_m []string = nil
    var mac_m []string = nil
    var ssid_m []string = nil
    var type_m []string = nil
    var chan_m []string = nil
    
    var iface string
    var aint int
    var first bool = true
    
    iwdict := make(map[string]interface{})
    var iwarray [8]interface{}
    iwarray[3] = ""
    iwarray[4] = 0
    iwarray[5] = 0
    iwarray[6] = 0
    iwarray[7] = 0
    
    for _, line := range strings.Split(outstr, "\n"){
        
        phy_m = phy_re.FindStringSubmatch(line)
        iface_m = iface_re.FindStringSubmatch(line)
        mac_m = mac_re.FindStringSubmatch(line)
        ssid_m = ssid_re.FindStringSubmatch(line)
        type_m = type_re.FindStringSubmatch(line)
        chan_m = chan_re.FindStringSubmatch(line)
        
        if (phy_m != nil) {
            if !first {
                iwdict[iface] = iwarray
                iwarray[3] = ""
                iwarray[4] = 0
                iwarray[5] = 0
                iwarray[6] = 0
                iwarray[7] = 0
            }
            StrToInt(phy_m[1], &aint)
            iwarray[0] = aint
            phy_m = nil // consume
        }
        if iface_m != nil {
            iface = iface_m[1]
            iface_m = nil // consume
        }
        if mac_m != nil {
            iwarray[1] = mac_m[1]
            mac_m = nil // consume
        }
        if ssid_m != nil {
            iwarray[3] = ssid_m[1]
            ssid_m = nil // consume          
        }
        if type_m != nil {
            iwarray[2] = type_m[1]
            type_m = nil // consume          
        }
        if chan_m != nil {
            StrToInt(chan_m[1], &aint)
            iwarray[4] = aint
            StrToInt(chan_m[2][1:len(chan_m[2])], &aint)
            iwarray[5] = aint
            StrToInt(chan_m[3], &aint)
            iwarray[6] = aint
            iwarray[7] = getTxPower(iface)
            chan_m = nil // consume          
        }
    }
    
    iwdict[iface] = iwarray // last one
    
    return iwdict
}


//==================================================================================================
func IwDevList() []string {
    app := "iw"
    args := [1]string{"dev"}
    
    cmd := exec.Command(app, args[0])
    out, err := cmd.Output()
    
    if err != nil {
        println(err.Error())
        os.Exit(2)
    }
    
    var outstr = string(out)

    var iwlist []string
    iface_re := regexp.MustCompile("\\s+Interface (\\S+)")
    var iface_m []string = nil
    
    for _, line := range strings.Split(outstr, "\n"){
        
        iface_m = iface_re.FindStringSubmatch(line)
        
        if iface_m != nil {
            iwlist = append(iwlist, iface_m[1])
            iface_m = nil // consume
        }
    }    
    
    return iwlist
}


//==================================================================================================
func getTxPower(iface string) int {
    app := "iwconfig"
    args := [1]string{iface}
    
    cmd := exec.Command(app, args[0])
    out, err := cmd.Output()
    
    if err != nil {
        println(err.Error())
        os.Exit(2)
    }
    
    var outstr = string(out)
    
    txpwr_re := regexp.MustCompile("\\s*Tx-Power=(\\d+) dBm")
    var txpwr_m []string = nil
    var txpower int = 0

    for _, line := range strings.Split(outstr, "\n"){
        txpwr_m = txpwr_re.FindStringSubmatch(line)
        
        if txpwr_m != nil {
            StrToInt(txpwr_m[1], &txpower)
            txpower *= 100
        }
    } 
    
    return txpower          
}
