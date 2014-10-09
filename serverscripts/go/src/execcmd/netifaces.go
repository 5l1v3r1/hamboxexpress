package execcmd

import (
    "fmt"
    "strings"
    "regexp"
    "os"
    "os/exec"
)

//==================================================================================================
func GetIfaceWirelessConfig(iface string) map[string]interface{} {
    
    //auto wlan0
    //iface wlan0 inet manual
    //up /sbin/iw dev wlan0 set type ibss
    //up /sbin/ip link set wlan0 up
    //up /sbin/iw dev wlan0 ibss join BroadbandHamnet-v2 2392 5MHZ fixed-freq 82:CC:16:64:64:41
    //post-up /sbin/ip addr add 10.0.0.1/24 dev wlan0
    //post-up /sbin/iw dev wlan0 set txpower fixed 300
    //pre-down /sbin/iw dev wlan0 ibss leave    
    
    app := "cat"
    args := [1]string{"/etc/network/interface." + iface}
    
    cmd := exec.Command(app, args[0])
    out, err := cmd.Output()
    
    if err != nil {
        println(err.Error())
        os.Exit(2)
    }
    
    var outstr = string(out)
    
    inet_re := regexp.MustCompile(fmt.Sprintf("iface %s inet (\\S+)", iface))
    type_re := regexp.MustCompile(fmt.Sprintf("up /sbin/iw dev %s set type (\\S+)", iface))
    ibss_re := regexp.MustCompile(fmt.Sprintf("up /sbin/iw dev %s ibss join (\\S+) (\\d+) (\\d+)MHZ fixed-freq (\\S+)", iface)) 
    addr_re := regexp.MustCompile(fmt.Sprintf("post-up /sbin/ip addr add (\\S+)/(\\d+) dev %s", iface))
    pwr_re  := regexp.MustCompile(fmt.Sprintf("post-up /sbin/iw dev %s set txpower fixed (\\d+)", iface))    
    
    var inet_m []string = nil
    var type_m []string = nil
    var ibss_m []string = nil
    var addr_m []string = nil
    var pwr_m []string = nil
    var aint int
       
    ifacedict := make(map[string]interface{})
    ifacedict["iface"] = iface
    
    for _, line := range strings.Split(outstr, "\n"){
        inet_m = inet_re.FindStringSubmatch(line)
        type_m = type_re.FindStringSubmatch(line)
        ibss_m = ibss_re.FindStringSubmatch(line)
        addr_m = addr_re.FindStringSubmatch(line)
        pwr_m = pwr_re.FindStringSubmatch(line)

        if inet_m != nil {
            ifacedict["inet"] = inet_m[1]
            inet_m = nil // consume          
        }
        if type_m != nil {
            ifacedict["type"] = type_m[1]
            type_m = nil // consume          
        }
        if ibss_m != nil {
            ifacedict["essid"] = ibss_m[1]
            StrToInt(ibss_m[2], &aint)
            ifacedict["freq"] = aint
            StrToInt(ibss_m[3], &aint)
            ifacedict["bw"] = aint
            ifacedict["bssid"] = ibss_m[4]
            ibss_m = nil // consume          
        }
        if addr_m != nil {
            ifacedict["ipaddr"] = addr_m[1]
            StrToInt(addr_m[2], &aint)
            ifacedict["ipmask"] = aint
            addr_m = nil // consume          
        }
        if pwr_m != nil {
            StrToInt(pwr_m[1], &aint)
            ifacedict["mbm"] = aint
            pwr_m = nil // consume          
        }
    }
        
    
    return ifacedict
}

//==================================================================================================
func GetIfaceWiredConfig(iface string) map[string]interface{} {
    
    //iface eth0 inet static
    //address 192.168.0.51
    //netmask 255.255.255.0
    
    app := "cat"
    args := [1]string{"/etc/network/interface." + iface}
    
    cmd := exec.Command(app, args[0])
    out, err := cmd.Output()
    
    if err != nil {
        println(err.Error())
        os.Exit(2)
    }
    
    var outstr = string(out)
    
    inet_re := regexp.MustCompile(fmt.Sprintf("iface %s inet (\\S+)", iface))
    addr_re := regexp.MustCompile("address (\\S+)")
    mask_re := regexp.MustCompile("netmask (\\S+)")
    
    var inet_m []string = nil
    var addr_m []string = nil
    var mask_m []string = nil
    
    var mode string = ""
    var addr string = ""
    var mask string = ""
       
    ifacedict := make(map[string]interface{})
    ifacedict["iface"] = iface
    
    for _, line := range strings.Split(outstr, "\n"){
        
        inet_m = inet_re.FindStringSubmatch(line)
        addr_m = addr_re.FindStringSubmatch(line)
        mask_m = mask_re.FindStringSubmatch(line)
        
        if inet_m != nil {
            mode = inet_m[1]
        }
        if mode == "static" {
            if addr_m != nil {
                addr = addr_m[1]
            }
            if mask_m != nil {
                mask = mask_m[1]
            }
        }
    }
        
    ifacedict["mode"] = mode
    ifacedict["addr"] = addr
    ifacedict["mask"] = mask
    
    return ifacedict
}
