package execcmd

import (
    "regexp"
    "strings"
)

//==================================================================================================
func GetTopoDotGraph() string {
    ok, outstr := ExecPipeWithArgs("echo", []string{"/all"}, "nc", []string{"localhost","2004"})
    
    if !ok {
        return "digraph topology{\"olsrd dot draw plugin not configured\"}"
    }
    
    return outstr
}
    
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
