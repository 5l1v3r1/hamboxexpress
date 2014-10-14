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

//==================================================================================================
func IpList() map[string]string {
    app := "ip"
    args := [2]string{"link", "list"}
    
    cmd := exec.Command(app, args[0], args[1])
    out, err := cmd.Output()
    
    if err != nil {
        println(err.Error())
        os.Exit(2)
    }
    
    var outstr = string(out)
    hdr_re := regexp.MustCompile("\\d+: (\\S+):.*state (\\S+) .*")   
    var hdr_m []string = nil
    ipdict := make(map[string]string);

    for _, line := range strings.Split(outstr, "\n"){
        hdr_m = hdr_re.FindStringSubmatch(line);

        if (hdr_m != nil) {
            ipdict[hdr_m[1]] = hdr_m[2];
        }
    }

    return ipdict;
}

//==================================================================================================
func IpNeighborsList(iface string) map[string][2]interface{} {
    
    //192.168.0.21 lladdr 74:44:01:88:01:4b STALE      <= ip, mac (key), status
    //192.168.0.23  FAILED                             <= no mac -> skipped
    //192.168.0.254 lladdr 00:24:d4:b0:bb:fa STALE
    //192.168.0.8 lladdr 2c:b0:5d:be:f6:10 STALE
    //192.168.0.22 lladdr 10:fe:ed:40:75:b8 STALE
    //1.1.1.1 lladdr 10:fe:ed:40:75:b8 STALE
    //192.168.0.3 lladdr 10:fe:ed:40:75:b8 STALE       
    //192.168.0.11 lladdr 2e:60:57:97:49:01 REACHABLE  
    
    // possible states:
    
    // none -- the state of the neighbour is void. <- grey
    // incomplete -- the neighbour is in the process of resolution. <- yellow
    // reachable -- the neighbour is valid and apparently reachable. <- green
    // stale -- the neighbour is valid, but is probably already unreachable, so the kernel will try to check it at the first transmission. <- yellow
    // delay -- a packet has been sent to the stale neighbour and the kernel is waiting for confirmation. <- yellow
    // probe -- the delay timer expired but no confirmation was received. The kernel has started to probe the neighbour with ARP/NDISC messages. <- yellow
    // failed -- resolution has failed. <- red
    // noarp -- the neighbour is valid. No attempts to check the entry will be made. <- blue
    // permanent -- it is a noarp entry, but only the administrator may remove the entry from the neighbour table. <- light blue
    
    ok, outstr := ExecWithArgs("ip", []string{"neigh", "show", "dev", iface})
    
    if !ok {
        os.Exit(2)
    }
    
    line_re := regexp.MustCompile("(\\S+) lladdr (\\S+) (\\S+)")
    var line_m []string = nil
    var first bool = true
    
    neighdict := make(map[string][2]interface{})
    var neigharray [2]interface{}
    var macaddr string
    neigharray[0] = ""
    neigharray[1] = ""

    for _, line := range strings.Split(outstr, "\n"){
        
        line_m = line_re.FindStringSubmatch(line)
        
        if line_m != nil {
            if (!first) {
                neighdict[macaddr] = neigharray
            }
            neigharray[0] = line_m[1]
            macaddr = line_m[2]
            neigharray[1] = line_m[3]
            first = false
            line_m = nil // consume
        }
    }    
    
    neighdict[macaddr] = neigharray // last one
    
    return neighdict
}
