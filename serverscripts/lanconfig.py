#!/usr/bin/env python

import sys, os, stat, traceback
from optparse import OptionParser
import re
import json

# ======================================================================
class Error(Exception):
    """Base class for exceptions in this module."""
    pass

# ======================================================================
class InputError(Error):
    """Exception raised for errors in the input.

    Attributes:
        msg  -- explanation of the error
    """

    def __init__(self, msg):
        self.msg = msg
        
#===================================================================================================
def getInputOptions():
    
    parser = OptionParser(usage=
    """usage: %%prog options
    """)
    parser.add_option("-i", "--interfaces", dest="ifaces", help="interface device names comma separated e.g. wlan0,wlan1", metavar="IFACE", type="string")
    parser.add_option("-w", "--wireless", dest="wireless", help="switch to wireless interfaces", metavar="WIRELESS", action="store_true", default=False)
    
    (options, args) = parser.parse_args()

    if options.ifaces is not None:
        options.ifaces = options.ifaces.split(',')
           
    return options

#===================================================================================================
def get_wlan_ifaces():
    iw_out = os.popen("iw dev")
    
    phy_re = re.compile(r"phy#(\d+)")
    iface_re = re.compile(r"\s+Interface (\S+)")
    
    phy_m = None
    iface_m = None
    
    ifaces = []

    for iw_line_raw in iw_out:
        iw_line = iw_line_raw.strip('\r\n')
        if phy_m is None:
            phy_m = phy_re.match(iw_line)
        elif iface_m is None:
            iface_m = iface_re.match(iw_line)        
        if (iface_m):
            ifaces.append(iface_m.group(1))
            phy_m = None
            iface_m = None
            
    return ifaces

#===================================================================================================
def get_eth_ifaces():
    ip_out = os.popen("ip link list")

    hdr_re = re.compile(r"\d+: (\S+):.*state \S+ .*")
    link_re = re.compile(r".*link/(\S+) \S+ brd.*")
    
    hdr_m = None
    link_m = None
    
    ifaces = []
    
    for ip_line_raw in ip_out:
        ip_line = ip_line_raw.strip('\r\n')
        if hdr_m is None:
            hdr_m = hdr_re.match(ip_line)
        elif link_m is None:
            link_m = link_re.match(ip_line)
        if hdr_m and not link_m:
            iface = hdr_m.group(1)
        if link_m:
            if link_m.group(1) == "ether":
                ifaces.append(iface)
            hdr_m = None    
            link_m = None
    
    return ifaces
    
#===================================================================================================
def get_lan_ifaces():
    eth_ifaces = get_eth_ifaces()
    wlan_ifaces = get_wlan_ifaces()
    
    ifaces = []
    
    for eth_iface in eth_ifaces:   
        if eth_iface not in wlan_ifaces:
            ifaces.append(eth_iface)
    
    return ifaces
        
#===================================================================================================
def get_wireless_info(iface):
    if_out = os.popen("cat /etc/network/interface.%s" % iface)

    #auto wlan0
    #iface wlan0 inet manual
    #up /sbin/iw dev wlan0 set type ibss
    #up /sbin/ip link set wlan0 up
    #up /sbin/iw dev wlan0 ibss join BroadbandHamnet-v2 2392 5MHZ fixed-freq 82:CC:16:64:64:41
    #post-up /sbin/ip addr add 10.0.0.1/24 dev wlan0
    #post-up /sbin/iw dev wlan0 set txpower fixed 300
    #pre-down /sbin/iw dev wlan0 ibss leave

    inet_re = re.compile(r"iface %s inet (\S+)" % iface)
    type_re = re.compile(r"up /sbin/iw dev %s set type (\S+)" % iface)
    ibss_re = re.compile(r"up /sbin/iw dev %s ibss join (\S+) (\d+) (\d+)MHZ fixed-freq (\S+)" % iface) 
    addr_re = re.compile(r"post-up /sbin/ip addr add (\S+)/(\d+) dev %s" % iface)
    pwr_re  = re.compile(r"post-up /sbin/iw dev %s set txpower fixed (\d+)" % iface)
    
    inet_m = None
    type_m = None
    ibss_m = None
    addr_m = None
    pwr_m = None
    
    ifacedict = {}
    ifacedict["iface"] = iface
    
    for if_line_raw in if_out:
        if_line = if_line_raw.strip('\r\n')
        if inet_m is None:
            inet_m = inet_re.match(if_line)
        elif type_m is None:
            type_m = type_re.match(if_line)
        elif ibss_m is None:
            ibss_m = ibss_re.match(if_line)
        elif addr_m is None:
            addr_m = addr_re.match(if_line)
        elif pwr_m is None:
            pwr_m = pwr_re.match(if_line)
            
    if (inet_m):
        ifacedict["inet"] = inet_m.group(1)
    if (type_m):
        ifacedict["type"] = type_m.group(1)
    if (ibss_m):
        ifacedict["essid"] = ibss_m.group(1)
        ifacedict["freq"] = int(ibss_m.group(2))
        ifacedict["bw"] = int(ibss_m.group(3))
        ifacedict["bssid"] = ibss_m.group(4)
    if (addr_m):
        ifacedict["ipaddr"] = addr_m.group(1)
        ifacedict["ipmask"] = int(addr_m.group(2))
    if (pwr_m):
        ifacedict["mbm"] = int(pwr_m.group(1))
        
    return ifacedict
    
#===================================================================================================
def get_wired_info(iface):
    if_out = os.popen("cat /etc/network/interface.%s" % iface)
    
    #iface eth0 inet static
    #address 192.168.0.51
    #netmask 255.255.255.0

    inet_re = re.compile(r"iface %s inet (\S+)" % iface)
    addr_re = re.compile(r"address (\S+)")
    mask_re = re.compile(r"netmask (\S+)")

    inet_m = None
    addr_m = None
    mask_m = None
    
    addr = ""
    mask = ""
    mode = ""

    ifacedict = {}
    ifacedict["iface"] = iface
    
    for if_line_raw in if_out:
        if_line = if_line_raw.strip('\r\n')
        if inet_m is None:
            inet_m = inet_re.match(if_line)
        elif addr_m is None:
            addr_m = addr_re.match(if_line)            
        elif mask_m is None:
            mask_m = mask_re.match(if_line)
    if inet_m:
        mode = inet_m.group(1)
    if (mode == "static"):
        if addr_m is not None:
            addr = addr_m.group(1)
        if mask_m is not None:
            mask = mask_m.group(1)
            
    ifacedict["mode"] = mode
    ifacedict["addr"] = addr
    ifacedict["mask"] = mask
    
    return ifacedict
                            
#===================================================================================================
def get_wireless_configs(options, ifacelist):
    if options.ifaces is None:
        options.ifaces = get_wlan_ifaces()

    for iface in options.ifaces:
        ifacedict = get_wireless_info(iface)
        if len(ifacedict) > 1:
            ifacelist.append(ifacedict)
            
#===================================================================================================
def get_wired_configs(options, ifacelist):
    if options.ifaces is None:
        options.ifaces = get_lan_ifaces()   
        
    for iface in options.ifaces:
        ifacedict = get_wired_info(iface)
        if len(ifacedict) > 1:
            ifacelist.append(ifacedict)
            
#===================================================================================================
def main():
    try:
        options = getInputOptions()
        ifacelist = []
        
        if options.wireless:
            get_wireless_configs(options, ifacelist)
        else:
            get_wired_configs(options, ifacelist)

        print json.dumps(ifacelist)        
            
    except KeyboardInterrupt:
        pass


#===================================================================================================
if __name__ == "__main__":
    main()
