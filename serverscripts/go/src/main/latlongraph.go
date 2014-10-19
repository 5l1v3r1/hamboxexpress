package main

import (
    "fmt"
    "simu"
    "execcmd"
    "os"
)

//==================================================================================================
func main() {

    if len(os.Getenv("HAMBOXSIMU")) > 0  {
        fmt.Println(simu.GetMeshGraphLatLon())
    } else {
        //fmt.Println(execcmd.GetTopoDotGraph())
        ok, outstr := execcmd.ExecWithArgs("cat", []string{"/var/run/latlon.js"})
        
        if !ok {
            fmt.Println("Self('10.0.0.1',43.581497,7.107303,1,'0.0.0.0','please wait...');")
            return
        }
        
        fmt.Printf("%s", outstr)
    }
}
