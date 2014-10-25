// Package execcmd provides interface to shell commands
package execcmd

import (
    "regexp"
    "strings"
)

//==================================================================================================
// GetOlsrHNA returns a map keyed by gateway IP of HNA addresses the gateway advertises. The value 
// item of the map is an array of:
//   - HNA IP address as string
//   - mask as integer
//==================================================================================================
func GetOlsrHNA() map[string]interface{} {
    ok, outstr := ExecPipeWithArgs("echo", []string{"/hna"}, "nc", []string{"localhost","2006"})
    
    if !ok {
        return make(map[string]interface{})
    }
    
    gw_re := regexp.MustCompile("(\\d+\\.\\d+\\.\\d+\\.\\d+)/(\\d+)\\s+(\\d+\\.\\d+\\.\\d+\\.\\d+)")
    var gw_m []string = nil
    var mask int
    var hnalist [2]interface{}
    
    gwdict := make(map[string]interface{})
    
    for _, line := range strings.Split(outstr, "\n") {
        gw_m = gw_re.FindStringSubmatch(line)
        
        if gw_m != nil {
            StrToInt(gw_m[2], &mask)
            hnalist[0] = gw_m[1]
            hnalist[1] = mask
            gwdict[gw_m[3]] = hnalist
        }
    }    
    
    return gwdict
}
    
//==================================================================================================
// GetOlsrHosts returns a map keyed by IP address of hosts present in the mesh as reported by the
// namespace olsrd plugin. The value item of the map is the hostname as a string
//==================================================================================================
func GetOlsrHosts() map[string]string {
    ok, outstr := ExecWithArgs("cat", []string{"/var/run/hosts_olsr"})

    if !ok {
        return make(map[string]string)
    }

    name_re := regexp.MustCompile("(\\d+\\.\\d+\\.\\d+\\.\\d+)\\s+(\\S+)")
    var name_m []string = nil
    
    namedict := make(map[string]string)
    
    for _, line := range strings.Split(outstr, "\n") {
        name_m = name_re.FindStringSubmatch(line)
        
        if name_m != nil {
            namedict[name_m[1]] = name_m[2]
        }
    }
    
    return namedict
}

//==================================================================================================
// GetOlsrRoutes returns a map keyed by IP address of destination nodes in the mesh. The value item 
// of the map is an array of: 
//   - Destination mask as an integer
//   - Gateway IP as a string
//   - Metric i.e. number of hops to reach this node as an integer
//   - ETX as a float32
//   - Interface name as a string
//==================================================================================================
func GetOlsrRoutes() map[string]interface{} {
    ok, outstr := ExecPipeWithArgs("echo", []string{"/routes"}, "nc", []string{"localhost","2006"})

    if !ok {
        return make(map[string]interface{})
    }

    dest_re := regexp.MustCompile("(\\d+\\.\\d+\\.\\d+\\.\\d+)/(\\d+)\\s+(\\d+\\.\\d+\\.\\d+\\.\\d+)\\s+(\\d+)\\s+(\\S+)\\s+(\\S+)")
    var dest_m []string = nil
    var aint int
    var afloat float32
    var destlist [5]interface{}
    
    destdict := make(map[string]interface{})
    
    for _, line := range strings.Split(outstr, "\n") {
        dest_m = dest_re.FindStringSubmatch(line)
        
        if dest_m != nil {
            StrToInt(dest_m[2], &aint)
            destlist[0] = aint
            destlist[1] = dest_m[3]         
            StrToInt(dest_m[4], &aint)
            destlist[2] = aint
            StrToFloat32(dest_m[5], &afloat)
            destlist[3] = afloat
            destlist[4] = dest_m[6]
            destdict[dest_m[1]] = destlist
        }
    }
    
    return destdict
}
