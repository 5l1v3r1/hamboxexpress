// Package execcmd provides interface to shell commands
package execcmd

import (
    "fmt"
)

//==================================================================================================
// RecycleInterface brings down the specified network interface then up
// Returns latest command success 
//==================================================================================================
func RecycleInterface(iface string) bool {
    ok1, _ := ExecWithArgs("sudo", []string{"ip", "link", "set", iface, "down"})
    
    if !ok1 {
        fmt.Printf("failed to bring down %s\n", iface)
        return ok1
    }
    
    fmt.Printf("interface %s is down\n", iface)
    
    ok2, _ := ExecWithArgs("sudo", []string{"ifup", iface})
    
    if !ok2 {
        fmt.Printf("failed to bring up %s\n", iface)
    }

    fmt.Printf("interface %s is up\n", iface)

    return ok2
}
