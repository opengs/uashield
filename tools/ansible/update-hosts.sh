#!/bin/bash

PUBLIC_IP_ADDRESSES="$(az vm list-ip-addresses --query '[*].virtualMachine.network.publicIpAddresses[0].ipAddress' | sed '1d;$d' | cut -d'"' -f2)"
TOTAL=0
for IP in $PUBLIC_IP_ADDRESSES
do
  EXIST="$(cat hosts | awk '{print $1}' | grep $IP)"
  if [ "$EXIST" == "$IP" ]
  then
    echo "skipping: [$IP]"
  else
    echo $IP >> hosts
    echo "changed: [$IP]"
  fi
  TOTAL=$(expr $TOTAL + 1)
done
echo "Total: ${TOTAL} hosts"
