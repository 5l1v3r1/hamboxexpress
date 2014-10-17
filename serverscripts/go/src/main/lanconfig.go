package main

import (
    "flag"
    "fmt"
    "strings"
    "execcmd"
    "simu"
    "encoding/json"
    "os"
)

type Options struct {
    ifaces []string
    wireless bool
}

//==================================================================================================
func getOptions() Options {
    ifacesPtr   := flag.String("interfaces", "", "interface device names comma separated e.g. wlan0,wlan1")
    wirelessPtr := flag.Bool("wireless", false, "select wireless interfaces")
    
    var options Options
    flag.Parse()
    
    for _, iface := range strings.Split(*ifacesPtr, ",") {
        options.ifaces = append(options.ifaces, iface)
    }
    
    options.wireless = *wirelessPtr
    
    return options
}


//==================================================================================================
func main() {
    options := getOptions()
    
    if options.wireless {
        
        var iwcfg map[string]interface{}
        var iwlist []map[string]interface{}
        var iwnames []string
        
        if len(os.Getenv("HAMBOXSIMU")) > 0  {
            iwnames = simu.IwDevList()
        } else {
            iwnames = execcmd.IwDevList()
        }
        
        for _, iwname := range iwnames {
            if len(os.Getenv("HAMBOXSIMU")) > 0  {
                iwcfg = execcmd.GetIfaceWirelessConfig(iwname, "serverscripts/go/simuroot/")
            } else {
                iwcfg = execcmd.GetIfaceWirelessConfig(iwname, "/")
            }
            
            if len(iwcfg) > 0 {
                iwlist = append(iwlist, iwcfg)
            }
        }
        
        iwlist_json, err := json.Marshal(iwlist)
        
        if (err != nil) {
            println(err.Error())
        }
        
        fmt.Println(string(iwlist_json))        
        
    } else {
        
        var iplist []map[string]interface{}
        iwnamedict := make(map[string]int)
        var iwnames []string
        var ethnames []string
        
        if len(os.Getenv("HAMBOXSIMU")) > 0  {
            iwnames = simu.IwDevList()
            ethnames = simu.IpEthList()
        } else {
            iwnames = execcmd.IwDevList()
            ethnames = execcmd.IpEthList()
        }
        
        for _, iwname := range iwnames {
            iwnamedict[iwname] = 0
        }
        
        for _, ethname := range ethnames {
            if _,ok := iwnamedict[ethname]; !ok { // exclude wireless 
                if len(os.Getenv("HAMBOXSIMU")) > 0  {
                    ethcfg := execcmd.GetIfaceWiredConfig(ethname, "serverscripts/go/simuroot/")
                    iplist = append(iplist, ethcfg)
                } else {
                    ethcfg := execcmd.GetIfaceWiredConfig(ethname, "/")
                    iplist = append(iplist, ethcfg)
                }
            }
        }
        
        iplist_json, err := json.Marshal(iplist)
        
        if (err != nil) {
            println(err.Error())
        }
        
        fmt.Println(string(iplist_json))        
    }
}
