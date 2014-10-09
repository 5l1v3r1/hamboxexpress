package execcmd

import (
    "fmt"
    "os"
    "strconv"
)

func StrToInt(argstr string, valint *int) {
    var err error
    *valint, err = strconv.Atoi(argstr)
    if err != nil {
        fmt.Println(err)
        os.Exit(2)
    }    
}
