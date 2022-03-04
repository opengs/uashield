#!/bin/bash

PUBLIC_IP_ADDRESSES="$(az vm list-ip-addresses --query '[*].virtualMachine.network.publicIpAddresses[0].ipAddress' | sed '1d;$d' | cut -d'"' -f2)"
for IP in $PUBLIC_IP_ADDRESSES
do
  EXIST="$(cat hosts | awk '{print $1}' | grep $IP)"
  if [ "$EXIST" == "$IP" ]
  then
    echo "[Skipping] $IP already exist"
  else
    echo $IP >> hosts
    echo "[Changed] $IP is added to hosts"
  fi
done
