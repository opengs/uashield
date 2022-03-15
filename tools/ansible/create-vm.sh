#!/bin/bash
# Usage example
# ./create-vm.sh eastus2

# When you get started you need to create Resource Group for VMs
# az group create --name 'STOPWAR' --location 'uaenorth'

# Get location list grouped by RegionName
# az account list-locations --query "[?not_null(metadata.latitude)] .{RegionName:name}" --output json

# Variables
INPUT=$1
LOCATION="${INPUT:-norwayeast}"
RESOURCE_GROUP='STOPWAR'
USER='azureuser'
IMAGE='UbuntuLTS'

for i in {1..4}
do
  NAME=uashield-$LOCATION-unit-$i
  echo "$NAME : Initializing vm..."
  az vm create --admin-user $USER --location $LOCATION --name $NAME --resource-group $RESOURCE_GROUP --image $IMAGE --generate-ssh-keys
done

bash ./update-hosts.sh
