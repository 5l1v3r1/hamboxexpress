package main

import (
    "fmt"
    "execcmd"
    "simu"
    "os"
    "encoding/json"    
)

//==================================================================================================
func main() {

    var phydict map[int]interface{}
    var devdict map[string]int

    if len(os.Getenv("HAMBOXSIMU")) > 0  {
        phydict = simu.IwPhyAllDetails()
        devdict = simu.IwDevPhyList()
    } else {
        phydict = execcmd.IwPhyAllDetails()
        devdict = execcmd.IwDevPhyList()
    }
    
    devphydict := make(map[string]interface{})
    
    for iface, phynum := range devdict {
        devphydict[iface] = phydict[phynum]
    }
    
    devphydict_json, err := json.Marshal(devphydict)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(devphydict_json))        
}
