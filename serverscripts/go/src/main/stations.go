package main

import (
    "flag"
    "fmt"
    "execcmd"
    "encoding/json"
    "os"
)


type Options struct {
    iface string
}

//==================================================================================================
func getOptions() Options {
    ifacePtr := flag.String("interface", "", "interface device name e.g. wlan0")
    
    var options Options
    flag.Parse()
    options.iface = *ifacePtr
    
    return options
}

//==================================================================================================
func main() {

    options := getOptions()

    if len(options.iface) == 0 {
        println("You must give interface name e.g -interface wlan0")
        os.Exit(2)
    }    
    
    stadict := execcmd.IwDevStaDump(options.iface)
    neighdict := execcmd.IpNeighborsList(options.iface)
    outdict := make(map[string]interface{})
    var stalist [9]interface{}
    
    for macaddr, sta := range stadict {
        
        copy(stalist[0:7], sta[:])
        
        if neigh, ok := neighdict[macaddr]; ok {
            copy(stalist[7:9], neigh[:])
        } else {
            copy(stalist[7:9], []interface{}{"",""})
        }
        
        outdict[macaddr] = stalist
    }
    
    outdict_json, err := json.Marshal(outdict)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(outdict_json))        
}
