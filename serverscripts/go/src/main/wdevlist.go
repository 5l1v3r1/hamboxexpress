package main

import (
    "fmt"
    "flag"
    "execcmd"
    "simu"
    "encoding/json"
    "os"
)

type Options struct {
    all bool
}

//==================================================================================================
func getOptions() Options {
    allPtr := flag.Bool("all", false, "list all interfaces including those that are down")

    var options Options
    flag.Parse()
    options.all = *allPtr

    return options
}
//==================================================================================================
func main() {
    
    options := getOptions()

    if len(os.Getenv("HAMBOXSIMU")) > 0  {
        simu.GetWirelessIfaces();
        return;
    }

    ipdict := execcmd.IpList()
    iwdict := execcmd.IwDevAllDetails()
    iwlist := make([]string, 0, 4)

    for iface, _ := range iwdict {
        if state,ok := ipdict[iface]; ok {
            if (state == "UP") || (options.all) {
                iwlist = append(iwlist, iface)
            }
        }
    }
    
    iwlist_json, err := json.Marshal(iwlist)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(iwlist_json))
}
