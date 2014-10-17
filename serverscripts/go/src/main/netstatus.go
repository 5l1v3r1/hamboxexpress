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
    
    netdict := make(map[string]interface{})
    
    if len(os.Getenv("HAMBOXSIMU")) > 0  {    
        netdict["ip"] = simu.IpAddrShow()
        netdict["iw"] = simu.IwDevAllDetails()
    } else {
        netdict["ip"] = execcmd.IpAddrShow()
        netdict["iw"] = execcmd.IwDevAllDetails()
    }
    
    netdict_json, err := json.Marshal(netdict)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(netdict_json))        
}
