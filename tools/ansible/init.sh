#!/bin/bash

# Prerequisites
# Have installed azure cli on your machine
# Have been logged in to your account. Run `az login`

# Usage example
# ./create-vm.sh
# ./create-vm.sh ua-loadtest
# ./create-vm.sh uasword

# Variables
INPUT=$1
PROJECT="${INPUT:-uashield}"
USER="azureuser"
IMAGE="UbuntuLTS"

echo "Initializing new $PROJECT instances"
if [ ! -f "locations.txt" ];
then
  bash ./get-locations.sh
fi

LOCATIONS=$(<locations.txt)
AVAILABLE_LOCATIONS=$(echo $LOCATIONS)
COUNT_LOCATION=$($AVAILABLE_LOCATIONS | wc -l)
echo "$COUNT_LOCATION available locations are loaded."

for NEXT_LOCATION in $AVAILABLE_LOCATIONS
do
  GROUP_NAME=$PROJECT-$NEXT_LOCATION-group
  GROUP_EXIST=$(az group list --query "[?name=='$GROUP_NAME']")

  if [ "${#GROUP_EXIST}" == 2 ];
  then
    echo "Creating resource group... $GROUP_NAME"
    az group create --name $GROUP_NAME  --location $NEXT_LOCATION
  else
    echo "Resource group already exist. $GROUP_NAME"
  fi

  for i in {1..4}
  do
    NAME=$PROJECT-$NEXT_LOCATION-unit-$i
    echo "Creating vm... $NAME"
    az vm create --admin-user $USER --location $NEXT_LOCATION --name $NAME --resource-group $GROUP_NAME --image $IMAGE --generate-ssh-keys --public-ip-sku Standard
  done
done

echo 'Updating hosts'
bash ./update-hosts.sh
