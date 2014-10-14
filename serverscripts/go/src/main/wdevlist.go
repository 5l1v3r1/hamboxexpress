package main

import (
    "fmt"
    "execcmd"
    "simu"
    "encoding/json"
    "os"
)


//==================================================================================================
func main() {
    
    if len(os.Getenv("HAMBOXSIMU")) > 0  {
        simu.GetWirelessIfaces();
        return;
    }

    ipdict := execcmd.IpList()
    iwdict := execcmd.IwDevAllDetails()
    iwlist := make([]string, 0, 4)

    for iface, _ := range iwdict {
        if state,ok := ipdict[iface]; ok {
            if state == "UP" {
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
