package execcmd

import (
    "fmt"
    "os"
    "os/exec"
    "strconv"
    "bytes"
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
func ExecWithArgs(cmdname string, args []string) (bool, string) {
    
    var ok bool = true
    var out bytes.Buffer
    
    cmd := exec.Command(cmdname, args...)
    cmd.Stdout = &out
    err := cmd.Run()
    
    if err != nil {
        fmt.Fprintf(os.Stderr, "%s", out.String())
        fmt.Fprintf(os.Stderr, "%s\n", err)
        ok = false
    }    
    
    return ok, out.String()
}

//==================================================================================================
func ExecPipeWithArgs(cmd1name string, args1 []string, cmd2name string, args2 []string) (bool, string) {

    var ok bool = true
    var out bytes.Buffer

    cmd1 := exec.Command(cmd1name, args1...)
    cmd2 := exec.Command(cmd2name, args2...)
    cmd2.Stdin, _ = cmd1.StdoutPipe()
    cmd2.Stdout = &out
    
    err2  := cmd2.Start()
    err1  := cmd1.Run()
    err2w := cmd2.Wait()
    
    if err1 != nil {
        fmt.Fprintf(os.Stderr, "%s\n", err1)
        ok = false
    }    
    
    if err2 != nil {
        fmt.Fprintf(os.Stderr, "%s\n", err2)
        ok = false
    }    
    
    if err2w != nil {
        fmt.Fprintf(os.Stderr, "%s\n", err2w)
        ok = false
    }    
    
    return ok, out.String()
}

