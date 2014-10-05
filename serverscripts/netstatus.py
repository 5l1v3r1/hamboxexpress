#!/usr/bin/env python

import sys, os, stat, traceback
import re
import json

#===================================================================================================
def get_info():
    ip_out = os.popen("ip addr show")
    
    hdr_re = re.compile(r"(\d+): (\S+):.*state (\S+).*")
    link_re = re.compile(r".*link/(\S*) (\S*) brd.*")
    link_none_re = re.compile(r".*link/none.*")
    inet_re = re.compile(r".*inet (\S+)/(\d+) .*")
    
    hdr_m = None
    link_m = None
    link_none_m = None
    inet_m = None
    
    ipdict = {}
    iwdict = {}
    
    for ip_line_raw in ip_out:
        ip_line = ip_line_raw.strip('\r\n')
        if hdr_m is None:
            hdr_m = hdr_re.match(ip_line)
        elif link_m is None and link_none_m is None:
            link_m = link_re.match(ip_line)
            link_none_m = link_none_re.match(ip_line)
        elif inet_m is None:
            inet_m = inet_re.match(ip_line)
        if (hdr_m):
            seqnum = int(hdr_m.group(1))
            iface = hdr_m.group(2)
            state = hdr_m.group(3)
            ipdict[iface] = [state]
        if (link_m):
            ipdict[iface].append(link_m.group(1))
            ipdict[iface].append(link_m.group(2))
        if (link_none_m):
            ipdict[iface].append("none")
            ipdict[iface].append("")
        if (inet_m):
            ipdict[iface].append(inet_m.group(1))
            ipdict[iface].append(int(inet_m.group(2)))
            hdr_m = None
            link_m = None
            link_none_m = None
            inet_m = None
    
    iw_out = os.popen("iw dev")
    
    phy_re = re.compile(r"phy#(\d+)")
    iface_re = re.compile(r"\s+Interface (\S+)")
    mac_re = re.compile(r"\s+addr (\S+)")
    type_re = re.compile(r"\s+type (\S+)")
    chan_re = re.compile("\s+channel (\S+) (\S+).+width: (\d+) MHz.*")

    phy_m = None
    iface_m = None
    mac_m = None
    type_m = None
    chan_m = None

    for iw_line_raw in iw_out:
        iw_line = iw_line_raw.strip('\r\n')
        if phy_m is None:
            phy_m = phy_re.match(iw_line)
        elif iface_m is None:
            iface_m = iface_re.match(iw_line)
        elif mac_m is None:
            mac_m = mac_re.match(iw_line)
        elif type_m is None:
            type_m = type_re.match(iw_line)
        elif chan_m is None:
            chan_m = chan_re.match(iw_line)
        if (phy_m):
            phynum = int(phy_m.group(1))
        if (iface_m):
            iface = iface_m.group(1)
            iwdict[iface] = [phynum]
        if (mac_m):
            iwdict[iface].append(mac_m.group(1))
        if (type_m):
            iwdict[iface].append(type_m.group(1))
        if (chan_m):
            iwdict[iface].append(int(chan_m.group(1)))
            iwdict[iface].append(int(chan_m.group(2)[1:]))
            iwdict[iface].append(int(chan_m.group(3)))
            
    return ipdict, iwdict
    
#===================================================================================================
def main():
    try:
        ipdict, iwdict = get_info()
        
        netdict = {}
        netdict["ip"] = ipdict
        netdict["iw"] = iwdict
        
        print json.dumps(netdict)
            
    except KeyboardInterrupt:
        pass


#===================================================================================================
if __name__ == "__main__":
    main()
