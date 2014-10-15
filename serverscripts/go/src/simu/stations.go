package simu

import (
    "fmt"
    "encoding/json"
    "math/rand"
    "time"
    "os"
)

//==================================================================================================
func GetStationsDump(iface string) {
    outdict := make(map[string]interface{})
    var stalist [9]interface{}

    r := rand.New(rand.NewSource(time.Now().UnixNano()))

    if (iface == "wlan0") {
        stalist[0] = 6144;
        stalist[1] = 0;
        stalist[2] = 0;
        stalist[3] = -42 + r.Intn(5);
        stalist[4] = -40 + r.Intn(2);
        stalist[5] = 0.25;
        stalist[6] = 6.0;
        stalist[7] = "";
        stalist[8] = "STALE";

        outdict["be:ef:de:ad:00:01"] = stalist;

        stalist[1] = 300;
        stalist[2] = 100;
        stalist[3] = -70 + r.Intn(5);
        stalist[4] = -68 + r.Intn(2);
        stalist[5] = 0.25;
        stalist[6] = 6.0;
        stalist[7] = "10.0.0.5";

        outdict["be:ef:de:ad:00:02"] = stalist;
    } else if (iface == "wlan1") {
        stalist[0] = 6144;
        stalist[1] = 0;
        stalist[2] = 0;
        stalist[3] = -85 + r.Intn(5);
        stalist[4] = -83 + r.Intn(2);
        stalist[5] = 0.25;
        stalist[6] = 0.25;
        stalist[7] = "10.0.0.15";
        stalist[8] = "STALE";

        outdict["be:ef:de:ad:01:01"] = stalist;

        stalist[3] = -42 + r.Intn(5);
        stalist[4] = -40 + r.Intn(2);
        stalist[5] = 6.0;
        stalist[6] = 6.0;
        stalist[7] = "";

        outdict["be:ef:de:ad:01:02"] = stalist;

        stalist[3] = -70 + r.Intn(5);
        stalist[4] = -68 + r.Intn(2);
        stalist[5] = 0.25;
        stalist[6] = 6.0;
        stalist[7] = "10.0.0.12";

        outdict["be:ef:de:ad:01:03"] = stalist;
    }

    if len(outdict) > 0 {
        outdict_json, err := json.Marshal(outdict)

        if (err != nil) {
            println(err.Error())
        }

        fmt.Fprintln(os.Stdout, string(outdict_json))
    }
}

