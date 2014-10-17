package execcmd

import (
    "fmt"
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
        fmt.Fprintln(os.Stderr, err.Error());
        return make(map[string]interface{});
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
            first = false
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
func IwDevPhyList() map[string]int {

    ok, outstr := ExecWithArgs("iw", []string{"dev"})
    
    if !ok {
        return make(map[string]int)
    }

    phy_re := regexp.MustCompile("phy#(\\d+)")
    iface_re := regexp.MustCompile("\\s+Interface (\\S+)")
    var phy_m []string = nil
    var iface_m []string = nil

    var iface string
    var phynum int
    var first bool = true
    devdict := make(map[string]int)
    
    for _, line := range strings.Split(outstr, "\n") {
        
        phy_m = phy_re.FindStringSubmatch(line)
        iface_m = iface_re.FindStringSubmatch(line)
        
        if (phy_m != nil) {
            if !first {
                devdict[iface] = phynum
            }
            StrToInt(phy_m[1], &phynum)
            first = false
            phy_m = nil // consume
        }
        if iface_m != nil {
            iface = iface_m[1]
            iface_m = nil // consume
        }
    }
    
    devdict[iface] = phynum // last one
    
    return devdict
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


//==================================================================================================
func IwDevStaDump(iface string) map[string][7]interface{} {

    //Station c0:4a:00:11:ef:0d (on wlan0) <= macaddr (key)
    //       inactive time:  850 ms
    //       rx bytes:       35837612
    //       rx packets:     354027
    //       tx bytes:       403360
    //       tx packets:     5655          <= txpackets
    //       tx retries:     0             <= txretries
    //       tx failed:      0             <= txfailed
    //       signal:         -41 dBm       <= signal
    //       signal avg:     -40 dBm       <= signalavg
    //       tx bitrate:     6.0 MBit/s    <= bitratetx
    //       rx bitrate:     0.3 MBit/s    <= bitraterx
    //       authorized:     yes
    //       authenticated:  yes
    //       preamble:       long
    //       WMM/WME:        no
    //       MFP:            no
    //       TDLS peer:      no

    ok, outstr := ExecWithArgs("iw", []string{"dev", iface, "station", "dump"})
    
    if !ok {
        return make(map[string][7]interface{});
    }
        
    macaddr_re   := regexp.MustCompile("Station (\\S+) \\S+")
    txpackets_re := regexp.MustCompile("\\s+tx packets:\\s+(\\S+)")
    txretries_re := regexp.MustCompile("\\s+tx retries:\\s+(\\S+)")
    txfailed_re  := regexp.MustCompile("\\s+tx failed:\\s+(\\S+)")
    signal_re    := regexp.MustCompile("\\s+signal:\\s+(\\S+) dBm")
    signalavg_re := regexp.MustCompile("\\s+signal avg:\\s+(\\S+) dBm")
    bitratetx_re := regexp.MustCompile("\\s+tx bitrate:\\s+(\\S+) MBit/s")
    bitraterx_re := regexp.MustCompile("\\s+rx bitrate:\\s+(\\S+) MBit/s")
    
    var macaddr_m []string = nil
    var txpackets_m []string = nil
    var txretries_m []string = nil
    var txfailed_m []string = nil
    var signal_m []string = nil
    var signalavg_m []string = nil
    var bitratetx_m []string = nil
    var bitraterx_m []string = nil
    
    var aint int
    var afloat float32
    var macaddr string
    var first bool = true
    
    stadict := make(map[string][7]interface{})
    var staarray [7]interface{}
    staarray[0] = 0
    staarray[1] = 0
    staarray[2] = 0
    staarray[3] = 0
    staarray[4] = 0
    staarray[5] = 0.0
    staarray[6] = 0.0

    for _, line := range strings.Split(outstr, "\n"){
        
        macaddr_m = macaddr_re.FindStringSubmatch(line)
        txpackets_m = txpackets_re.FindStringSubmatch(line)
        txretries_m = txretries_re.FindStringSubmatch(line)
        txfailed_m = txfailed_re.FindStringSubmatch(line)
        signal_m = signal_re.FindStringSubmatch(line)
        signalavg_m = signalavg_re.FindStringSubmatch(line)
        bitratetx_m = bitratetx_re.FindStringSubmatch(line)
        bitraterx_m = bitraterx_re.FindStringSubmatch(line)
        
        if macaddr_m != nil {
            if !first {
                stadict[macaddr] = staarray
                staarray[0] = 0
                staarray[1] = 0
                staarray[2] = 0
                staarray[3] = 0
                staarray[4] = 0
                staarray[5] = 0.0
                staarray[6] = 0.0
            }
            macaddr = macaddr_m[1]
            first = false
            macaddr_m = nil // consume
        }
        if txpackets_m != nil {
            StrToInt(txpackets_m[1], &aint)
            staarray[0] = aint
            txpackets_m = nil // consume
        }
        if txretries_m != nil {
            StrToInt(txretries_m[1], &aint)
            staarray[1] = aint
            txretries_m = nil // consume
        }
        if txfailed_m != nil {
            StrToInt(txfailed_m[1], &aint)
            staarray[2] = aint
            txfailed_m = nil // consume
        }
        if signal_m != nil {
            StrToInt(signal_m[1], &aint)
            staarray[3] = aint
            signal_m = nil // consume
        }
        if signalavg_m != nil {
            StrToInt(signalavg_m[1], &aint)
            staarray[4] = aint
            signalavg_m = nil // consume
        }
        if bitratetx_m != nil {
            StrToFloat32(bitratetx_m[1], &afloat)
            staarray[5] = afloat
            bitratetx_m = nil // consume
        }
        if bitraterx_m != nil {
            StrToFloat32(bitraterx_m[1], &afloat)
            staarray[6] = afloat
            bitraterx_m = nil // consume
        }
    } 
    
    stadict[macaddr] = staarray // last one
    
    return stadict          
}
