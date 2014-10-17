package simu


//==================================================================================================
func IwPhyAllDetails() map[int]interface{} {
    
    var modelist   = []string{"IBSS", "managed", "AP", "AP/VLAN", "monitor", "mesh", "P2P-client", "P2P-GO"}
    var freqlist_2a = []int{2332, 2337, 2342, 2347, 2352, 2357, 2362, 2367, 2372, 2377, 2382, 2387, 2392, 2412, 2417, 2422, 2427, 2432, 2437, 2442, 2447, 2452, 2457, 2462, 2467, 2472}
    var freqlist_2b = []int{2412, 2417, 2422, 2427, 2432, 2437, 2442, 2447, 2452, 2457, 2462, 2467, 2472}
    var freqlist_5  = []int{5680, 5685, 5690, 5695, 5700, 5705, 5710, 5715, 5720, 5725, 5730, 5735, 5740}
    var bandlist [][]int    
    phydict := make(map[int]interface{})
    
    bandlist = nil
    bandlist = append(bandlist, freqlist_2a)
    valdict0 := make(map[string]interface{})
    valdict0["modes"] = modelist
    valdict0["bands"] = bandlist
    phydict[0] = valdict0

    bandlist = nil
    bandlist = append(bandlist, freqlist_2b)
    valdict1 := make(map[string]interface{})
    valdict1["modes"] = modelist
    valdict1["bands"] = bandlist
    phydict[1] = valdict1
    
    bandlist = nil
    bandlist = append(bandlist, freqlist_2a)
    bandlist = append(bandlist, freqlist_5)
    valdict2 := make(map[string]interface{})
    valdict2["modes"] = modelist
    valdict2["bands"] = bandlist
    phydict[2] = valdict2
    
    return phydict
}
