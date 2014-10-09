package main

import (
    "flag"
    "fmt"
    "strings"
    "execcmd"
    "encoding/json"
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
        
        var iwlist []map[string]interface{}
        
        iwnames := execcmd.IwDevList()
        
        for _, iwname := range iwnames {
            iwcfg := execcmd.GetIfaceWirelessConfig(iwname      )
            iwlist = append(iwlist, iwcfg)
        }
        
        iwlist_json, err := json.Marshal(iwlist)
        
        if (err != nil) {
            println(err.Error())
        }
        
        fmt.Println(string(iwlist_json))        
        
    } else {
        
        var iplist []map[string]interface{}
        iwnamedict := make(map[string]int)
        iwnames := execcmd.IwDevList()
        
        for _, iwname := range iwnames {
            iwnamedict[iwname] = 0
        }
        
        ethnames := execcmd.IpEthList()
        
        for _, ethname := range ethnames {
            if _,ok := iwnamedict[ethname]; !ok { // exclude wireless 
                ethcfg := execcmd.GetIfaceWiredConfig(ethname)
                iplist = append(iplist, ethcfg)
            }
        }
        
        iplist_json, err := json.Marshal(iplist)
        
        if (err != nil) {
            println(err.Error())
        }
        
        fmt.Println(string(iplist_json))        
    }
}
