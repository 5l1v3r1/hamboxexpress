package execcmd

import (
    "strings"
    "regexp"
)


//==================================================================================================
func IwPhyAllDetails() map[int]interface{} {
    
    
    
    ok, outstr := ExecWithArgs("iw", []string{"phy"})
    
    if !ok {
        return make(map[int]interface{});
    }

    phy_re := regexp.MustCompile("Wiphy phy(\\d+)")
    modestart_re := regexp.MustCompile("\\s+Supported interface modes:")
    mode_re := regexp.MustCompile("\\* (\\S+)")
    bandstart_re := regexp.MustCompile("\\s+Band (\\d+):")
    freq_re := regexp.MustCompile("\\* (\\d+) MHz \\[(\\S+)\\] \\((\\S+) dBm\\)")
    
    var phy_m []string = nil
    var modestart_m []string = nil
    var mode_m []string = nil
    var bandstart_m []string = nil
    var freq_m []string = nil
    
    var aint int
    var phynum int
    var first bool = true
    var firstband bool
    var modes bool = false
    var freqs bool = false
    var modelist []string
    var freqlist []int
    var bandlist [][]int
    
    phydict := make(map[int]interface{})
    
    for _, line := range strings.Split(outstr, "\n"){
        
        phy_m = phy_re.FindStringSubmatch(line)
        modestart_m = modestart_re.FindStringSubmatch(line)
        bandstart_m = bandstart_re.FindStringSubmatch(line)
        freq_m = freq_re.FindStringSubmatch(line)
        
        if (phy_m != nil) {
            if !first {
                valdict := make(map[string]interface{})
                valdict["modes"] = modelist
                bandlist = append(bandlist, freqlist)
                valdict["bands"] = bandlist
                phydict[phynum] = valdict;
                modelist = nil
                freqlist = nil
                freqs = false
            }
            StrToInt(phy_m[1], &phynum)
            first = false
            firstband = true
            continue
        }
        
        if modestart_m != nil {
            modes = true;
            continue
        }
        
        if (modes) {
            mode_m = mode_re.FindStringSubmatch(line)
            if mode_m != nil {
                modelist = append(modelist, mode_m[1])
                continue
            }
        }
        
        if bandstart_m != nil {
            if (!firstband) {
                bandlist = append(bandlist, freqlist)
            }
            modes = false
            freqs = true
            firstband = false
            continue
        }
 
        if (freqs) { 
            freq_m = freq_re.FindStringSubmatch(line)
 
            if freq_m != nil {
                StrToInt(freq_m[1], &aint)
                freqlist = append(freqlist, aint)
                continue
            }
        }
    }

    valdict := make(map[string]interface{})
    valdict["modes"] = modelist
    bandlist = append(bandlist, freqlist)
    valdict["bands"] = bandlist
    phydict[phynum] = valdict;

    return phydict
}
