package main

import (
    "fmt"
    "execcmd"
    "encoding/json"
)


//==================================================================================================
func main() {
    
    netdict := make(map[string]interface{})
    netdict["ip"] = execcmd.IpAddrShow()
    netdict["iw"] = execcmd.IwDevAllDetails()
    
    netdict_json, err := json.Marshal(netdict)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(netdict_json))        
}
