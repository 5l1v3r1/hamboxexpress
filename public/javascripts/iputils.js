var iputils = iputils || {};

//==================================================================================================
iputils.getNetmask = function(prefix) {
    var mask = 0xffffffff << (32 - prefix);
    var value = mask;
    return (value >> 24 & 0xff) + '.' + (value >> 16 & 0xff) + '.' + (value >> 8 & 0xff) + '.' + (value & 0xff);
};

//==================================================================================================
iputils.getPrefix = function(netmask) {
    var bytes = netmask.split(".");
    var pow2 = parseInt(bytes[0]);
    pow2 +=  parseInt(bytes[1])*(1<<8);
    pow2 +=  parseInt(bytes[2])*(1<<16);
    pow2 +=  parseInt(bytes[3])*(1<<24);
    pow2 += 1;
    
    var i = 0;
    
    for (i=0; i<32; i++)
    {
        if ((pow2 & 1) == 1) {
            break;
        }
        pow2 = pow2 >> 1;    
    }
    
    return i;
};
