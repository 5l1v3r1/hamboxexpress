#!/bin/sh

IFACEPATH=${1}
IFACE=${2}
IPADDR=${3}
NETMASK=${4}
TYPE=${5}

OUTFILE=${IFACEPATH}/interface.${IFACE};

if [ "${TYPE}" = "static" ]; then
echo "auto ${IFACE}
iface ${IFACE} inet static
address ${IPADDR}
netmask ${NETMASK}" > ${OUTFILE};
else
echo "auto ${IFACE}
iface ${IFACE} inet static" > ${OUTFILE};
fi

echo ${OUTFILE} updated
