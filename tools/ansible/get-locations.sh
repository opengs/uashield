#!/bin/bash

LOCATIONS=$(az provider list --query "[?namespace=='Microsoft.Resources'].[resourceTypes[?resourceType=='resourceGroups'].locations[]][][]" -otable | sed 's/ //g' | sed 1,2d)
SIZE=Standard_DS1_v2

echo "Creating locations.txt"
true > locations.txt

echo "Getting available locations with $SIZE..."

for LOCATION in $LOCATIONS
do
  OUTPUT=$(az vm list-skus --location $LOCATION --zone --size $SIZE)

  if [ ${#OUTPUT} == 2 ];
  then
    echo skipping: $LOCATION
  else
    echo added: $LOCATION
    echo $LOCATION >> locations.txt
  fi
done
