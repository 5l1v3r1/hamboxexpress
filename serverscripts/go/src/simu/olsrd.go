// Package simu provides a simulation of interface to shell commands
package simu


//==================================================================================================
// GetMeshGraph returns the current mesh topology as a graph in dot format
//==================================================================================================
func GetMeshGraph() string {
    
    return `digraph topology
{
"10.217.97.197" -> "10.5.115.135"[label="1.000", style=solid];
"10.217.97.197"[shape=box];
"10.5.115.135" -> "10.110.116.160"[label="1.000"];
"10.5.115.135" -> "10.217.97.197"[label="1.000"];
"10.110.116.160" -> "10.5.115.135"[label="1.000"];
"10.217.97.197" -> "10.5.115.135"[label="1.000"];
"10.110.116.160" -> "44.0.0.0/8"[label="HNA"];
"44.0.0.0/8"[shape=diamond];
"10.5.115.135" -> "10.43.156.56/29"[label="HNA"];
"10.43.156.56/29"[shape=diamond];
}`

}

//==================================================================================================
// GetMeshGraphLatLon returns the current mesh topology as a series of javascript function calls
// just like what the nameservice olsrd plugin does in the /var/run/latlon.js file
//==================================================================================================
func GetMeshGraphLatLon() string {
    
    return `Self('10.217.97.197',43.581497,7.107303,0,'0.0.0.0','F5SFU-54GL-11A-F4EXB');
Node('10.110.116.160',43.739723,7.151774,0,'0.0.0.0','F5SFU-54G-11-home');
Node('10.5.115.135',43.749325,7.149012,0,'0.0.0.0','F5ZIG-StePetr');
PLink('10.110.116.160','10.5.115.135',1.000,1.000,1.000,43.749325,7.149012,0,43.739723,7.151774,0);
PLink('10.217.97.197','10.5.115.135',1.000,1.000,1.000,43.749325,7.149012,0,43.581497,7.107303,0);
PLink('10.5.115.135','10.110.116.160',1.000,1.000,1.000,43.739723,7.151774,0,43.749325,7.149012,0);
PLink('10.5.115.135','10.217.97.197',1.000,1.000,1.000,43.581497,7.107303,0,43.749325,7.149012,0);
`
}

//==================================================================================================
// GetOlsrHosts returns a map keyed by IP address of hosts present in the mesh as reported by the
// namespace olsrd plugin. The value item of the map is the hostname as a string
//==================================================================================================
func GetOlsrHosts() map[string]string {
    
    namesdict := make(map[string]string)
    
    namesdict["10.0.0.1"] = "f4exbhb01"
    namesdict["10.0.0.5"] = "f4exbcam01"
    
    return namesdict
}

//==================================================================================================
// GetOlsrHNA returns a map keyed by gateway IP of HNA addresses the gateway advertises. The value 
// item of the map is an array of:
//   - HNA IP address as string
//   - mask as integer
//==================================================================================================
func GetOlsrHNA() map[string]interface{} {
    gwdict := make(map[string]interface{})
    var hnalist [2]interface{}
    
    hnalist[0] = "44.0.0.0"
    hnalist[1] = 8
    gwdict["10.110.116.160"] = hnalist
    
    hnalist[0] = "10.43.156.56"
    hnalist[1] = 29
    gwdict["10.5.115.135"] = hnalist
    
    return gwdict
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
    destdict := make(map[string]interface{})
    var destlist [5]interface{}
    
    destlist[0] = 32
    destlist[1] = "10.5.115.135"
    destlist[2] = 1
    destlist[3] = float32(1.0)
    destlist[4] = "wlan0"
    destdict["10.5.115.135"] = destlist
    
    destlist[0] = 29
    destdict["10.43.156.56"] = destlist
    
    destlist[0] = 32
    destlist[2] = 2
    destlist[3] = float32(2.0)
    destdict["10.110.116.160"] = destlist
    
    destlist[0] = 8
    destdict["44.0.0.0"] = destlist
    
    return destdict 
}
