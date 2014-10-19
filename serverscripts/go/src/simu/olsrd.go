package simu


//==================================================================================================
func GetMeshGraph() string {
    
    return `digraph topology
{
"10.0.0.1" -> "10.0.0.5"[label="1.000", style=solid];
"10.0.0.1" -> "10.0.0.5"[label="1.000"];
"10.0.0.5" -> "10.0.0.1"[label="1.000"];
"10.0.0.1" -> "0.0.0.0/0"[label="HNA"];
"0.0.0.0/0"[shape=diamond];
}`

}

//==================================================================================================
func GetMeshGraphLatLon() string {
    
    return `Self('10.0.0.1',43.581497,7.107303,1,'0.0.0.0','f4exbhb01');
Node('10.0.0.5',43.694935,6.897651,0,'10.0.0.1','f4exbcam01');
PLink('10.0.0.5','10.0.0.1',1.000,1.000,1.000,43.581497,7.107303,1,43.694935,6.897651,0);
PLink('10.0.0.1','10.0.0.5',1.000,1.000,1.000,43.694935,6.897651,0,43.581497,7.107303,1);
`
}

//==================================================================================================
func GetOlsrHosts() map[string]string {
    
    namesdict := make(map[string]string)
    
    namesdict["10.0.0.1"] = "f4exbhb01"
    namesdict["10.0.0.5"] = "f4exbcam01"
    
    return namesdict
}
