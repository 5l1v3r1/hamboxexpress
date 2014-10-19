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
        fmt.Println(simu.GetMeshGraph())
    } else {
        //fmt.Println(execcmd.GetTopoDotGraph())
        ok, outstr := execcmd.ExecPipeWithArgs("echo", []string{"/all"}, "nc", []string{"localhost","2004"})
        
        if !ok {
            fmt.Println("digraph topology{\"olsrd dot draw plugin not configured\"}")
            return
        }
        
        fmt.Printf("%s", outstr)
    }
}
