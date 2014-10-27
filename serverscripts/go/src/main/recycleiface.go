package main

import (
    "fmt"
    "flag"
    "execcmd"
    "os"
    "time"
)

type Options struct {
    iface string
}

//==================================================================================================
func getOptions() Options {
    ifacePtr := flag.String("interface", "", "name of the network interface to recycle")

    var options Options
    flag.Parse()
    options.iface = *ifacePtr

    return options
}
//==================================================================================================
func main() {
    
    options := getOptions()
    
    if len(options.iface) == 0 {
        fmt.Fprintln(os.Stderr, "You must give interface name e.g -interface wlan0")
        fmt.Fprintln(os.Stdout, "[]");
        os.Exit(2)
    } 

    var ok bool
    
    if len(os.Getenv("HAMBOXSIMU")) == 0  {
        ok = execcmd.RecycleInterface(options.iface)
    }
    
    if (!ok) {
        fmt.Fprintf(os.Stderr, "Error in recycling %s\n", options.iface)
        os.Exit(1)
    }
    
    time.Sleep(5e8)
    fmt.Fprintf(os.Stdout, "%s recycled\n", options.iface)
}
