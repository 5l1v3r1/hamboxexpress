#!/bin/sh

IFACEPATH=${1}
IFACE=${2}
ESSID=${3}
FREQ=${4}
BW=${5}
BSSID=${6}
IPADDR=${7}
IPMASK=${8}
TXPOWER=${9}

OUTFILE=${IFACEPATH}/interface.${IFACE};

echo "auto ${IFACE}
iface ${IFACE} inet manual
up /sbin/iw dev ${IFACE} set type ibss
up /sbin/ip link set ${IFACE} up
post-up /sbin/iw dev ${IFACE} ibss join ${ESSID} ${FREQ} ${BW}MHZ fixed-freq ${BSSID}
post-up /sbin/ip addr add ${IPADDR}/${IPMASK} dev ${IFACE}
post-up /sbin/iw dev ${IFACE} set txpower fixed ${TXPOWER}
pre-down /sbin/iw dev ${IFACE} ibss leave" > ${OUTFILE}
echo ${OUTFILE} updated
