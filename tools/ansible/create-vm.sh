#!/bin/bash
# Usage example
# ./create-vm.sh eastus2

# Variables
INPUT=$1
LOCATION="${INPUT:-'norwayeast'}"
RESOURCE_GROUP='STOPWAR'
USER='azureuser'
IMAGE='UbuntuLTS'
for i in {1..4}
do
  NAME=uashield-$LOCATION-unit-$i
  echo "$NAME : Initializing vm..."
  az vm create --admin-user=$USER --location=$LOCATION --name $NAME --resource-group $RESOURCE_GROUP --image $IMAGE --generate-ssh-keys
done

bash ./update-hosts.sh
