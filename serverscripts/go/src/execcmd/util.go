package execcmd

import (
    "fmt"
    "os"
    "os/exec"
    "strconv"
)

//==================================================================================================
func StrToInt(argstr string, valint *int) {
    var err error
    *valint, err = strconv.Atoi(argstr)
    if err != nil {
        fmt.Println(err)
        os.Exit(2)
    }    
}


//==================================================================================================
func StrToFloat32(argstr string, valfloat32 *float32) bool {
    var err error
    var x float64
    
    x, err = strconv.ParseFloat(argstr, 32)
    *valfloat32 = float32(x)
    
    if err != nil {
        fmt.Println(err)
        return false
    }    
    
    return true
}

//==================================================================================================
func ExecWithArgs(cmd string, args []string) (bool, string) {
    
    var ok bool = true
    
    out, err := exec.Command(cmd, args...).CombinedOutput()
    
    if err != nil {
        fmt.Printf("%s", string(out))
        fmt.Printf("%s\n", err)
        ok = false
    }    
    
    return ok, string(out)
}
