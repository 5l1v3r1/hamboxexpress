package main

import (
    "fmt"
    "simu"
    "execcmd"
    "encoding/json"
    "os"
)

//==================================================================================================
func main() {

    var namesdict map[string]string

    if len(os.Getenv("HAMBOXSIMU")) > 0  {
        namesdict = simu.GetOlsrHosts()
    } else {
        namesdict = execcmd.GetOlsrHosts()
    }
    
    namesdict_json, err := json.Marshal(namesdict)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(namesdict_json))        

}
