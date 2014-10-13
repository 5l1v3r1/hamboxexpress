package simu

import "fmt"
import "encoding/json"
import "math/rand"
import "time"

//==================================================================================================
func GetStationsDump(iface string) {
    outdict := make(map[string]interface{})
    var stalist [9]interface{}
    
    r := rand.New(rand.NewSource(time.Now().UnixNano()))
    
    stalist[0] = 6144;
    stalist[1] = 0;
    stalist[2] = 0;
    stalist[3] = -42 + r.Intn(5);
    stalist[4] = -40 + r.Intn(2);
    stalist[5] = 0.3;
    stalist[6] = 6.0;
    stalist[7] = "";
    stalist[8] = "STALE";
    
    outdict["be:ef:de:ad:00:01"] = stalist;
    
    stalist[3] = -70 + r.Intn(5);
    stalist[4] = -68 + r.Intn(2);
    stalist[5] = 0.3;
    stalist[6] = 6.0;
    stalist[7] = "10.0.0.5";

    outdict["be:ef:de:ad:00:02"] = stalist;

    outdict_json, err := json.Marshal(outdict)
    
    if (err != nil) {
        println(err.Error())
    }
    
    fmt.Println(string(outdict_json))        
}

