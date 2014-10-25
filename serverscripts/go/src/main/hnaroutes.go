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

    hnaroutesdict := make(map[string]interface{})

    if len(os.Getenv("HAMBOXSIMU")) > 0  {
        hnaroutesdict["hna"] = simu.GetOlsrHNA()
        hnaroutesdict["routes"] = simu.GetOlsrRoutes()
    } else {
        hnaroutesdict["hna"] = execcmd.GetOlsrHNA()
        hnaroutesdict["routes"] = execcmd.GetOlsrRoutes()
    }
    
    hnaroutesdict_json, err := json.Marshal(hnaroutesdict)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(hnaroutesdict_json))        
}
