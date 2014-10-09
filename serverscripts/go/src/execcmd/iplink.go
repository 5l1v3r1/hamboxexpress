package execcmd

import (
    "strings"
    "regexp"
    "os"
    "os/exec"
)

//==================================================================================================
func IpAddrShow() map[string]interface{} {
    app := "ip"
    args := [2]string{"addr", "show"}
    
    cmd := exec.Command(app, args[0], args[1])
    out, err := cmd.Output()
    
    if err != nil {
        println(err.Error())
        os.Exit(2)
    }
    
    var outstr = string(out)
    
    hdr_re := regexp.MustCompile("(\\d+): (\\S+):.*state (\\S+) .*")
    link_re := regexp.MustCompile(".*link/(\\S*) (\\S*) brd.*")
    link_none_re := regexp.MustCompile(".*link/none.*")
    inet_re := regexp.MustCompile(".*inet (\\S+)/(\\d+) .*")    
    
    var hdr_m []string = nil
    var link_m []string = nil
    var link_none_m []string = nil
    var inet_m []string = nil
    
    var iface string 
    var aint int
    
    ipdict := make(map[string]interface{})
    var iparray [6]interface{}
    iparray[0] = 0
    iparray[4] = ""
    iparray[5] = 0
    
    for _, line := range strings.Split(outstr, "\n"){
        
        hdr_m = hdr_re.FindStringSubmatch(line)
        link_m = link_re.FindStringSubmatch(line)
        link_none_m = link_none_re.FindStringSubmatch(line)
        inet_m = inet_re.FindStringSubmatch(line)
        
        if (hdr_m != nil) {
            if iparray[0] != 0 {
                ipdict[iface] = iparray
                iparray[4] = ""
                iparray[5] = 0
            }
            StrToInt(hdr_m[1], &aint)
            iparray[0] = aint
            iface = hdr_m[2]
            iparray[1] = hdr_m[3]
            hdr_m = nil // consume
        }
        if link_m != nil {
            iparray[2] = link_m[1]
            iparray[3] = link_m[2]
            link_m = nil // consume
        }
        if link_none_m != nil {
            iparray[2] = "none"
            iparray[3] = ""
            link_none_m = nil // consume
        }
        if inet_m != nil {
            iparray[4] = inet_m[1]
            StrToInt(inet_m[2], &aint)
            iparray[5] = aint
            inet_m = nil // consume          
        }
    }
    
    ipdict[iface] = iparray // last one
    
    return ipdict
}


//==================================================================================================
func IpEthList() []string {
    app := "ip"
    args := [2]string{"link", "list"}
    
    cmd := exec.Command(app, args[0], args[1])
    out, err := cmd.Output()
    
    if err != nil {
        println(err.Error())
        os.Exit(2)
    }
    
    var outstr = string(out)

    hdr_re := regexp.MustCompile("\\d+: (\\S+):.*state \\S+ .*")
    link_re := regexp.MustCompile(".*link/(\\S*) \\S* brd.*")
    
    var hdr_m []string = nil
    var iface_m []string = nil
    var iface string
    var iplist []string
    
    for _, line := range strings.Split(outstr, "\n"){
        
        hdr_m = hdr_re.FindStringSubmatch(line)
        iface_m = link_re.FindStringSubmatch(line)
        
        if (hdr_m != nil) {
            iface = hdr_m[1]
            hdr_m = nil // consume
        }
        if iface_m != nil {
            if iface_m[1] == "ether" {
                iplist = append(iplist, iface)
            }
            iface_m = nil // consume
        }
    }    
    
    return iplist
}
