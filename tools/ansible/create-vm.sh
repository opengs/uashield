#!/bin/bash

# Prerequisites
# Have installed azure cli on your machine
# Have been logged in to your account. Run `az login`

# Usage example
# ./create-vm.sh
# ./create-vm.sh ua-loadtest
# ./create-vm.sh uasword

# Get location list grouped by RegionName
# az account list-locations --query "[?not_null(metadata.latitude)] .{RegionName:name}" --output json

# Variables
INPUT=$1
PROJECT="${INPUT:-uashield}"
AVAILABLE_LOCATIONS='southindia; eastasia; centralindia; koreacentral;'
LOCATIONS=$(echo $AVAILABLE_LOCATIONS | tr ";" "\n")
USER='azureuser'
IMAGE='UbuntuLTS'


for nextLocation in $LOCATIONS
do
  GROUP_NAME=$PROJECT-$nextLocation-group
  az group create --name $GROUP_NAME  --location $nextLocation

  for i in {1..4}
  do
    NAME=$PROJECT-$nextLocation-unit-$i
    echo "$NAME : Initializing vm..."
    az vm create --admin-user $USER --location $nextLocation --name $NAME --resource-group $GROUP_NAME --image $IMAGE --generate-ssh-keys --public-ip-sku Standard
  done
done

bash ./update-hosts.sh
