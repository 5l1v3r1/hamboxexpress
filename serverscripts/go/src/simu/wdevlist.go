package simu

import (
    "fmt"
    "encoding/json"
)

//==================================================================================================
func GetWirelessIfaces() {
    outlist := [2]string{"wlan0", "wlan1"}

    outlist_json, err := json.Marshal(outlist)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(outlist_json))        
}

