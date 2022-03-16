# How to use on Azure

## Prerequisites
### On your host machine install
#### MacOS
    brew install ansible azure-cli
#### Linux
    apt install ansible azure-cli

### Authenticate to Azure account
    az login

### Run script to create VMs
This script will create resource group per region and create 4 vm instances. Optional. You can change prefix name of VMs `./create-vm.sh test`

    ./create-vm.sh

### Run script to update `hosts`
This script will add Public IP of created VMs to `hosts` file.

    ./update-hosts.sh

### Run ansible-playbook to deploy to all instances

If you want to deploy `uashield` project:

    ansible-playbook -u azureuser deploy.yaml -i hosts

If you want to deploy `uasword` project:

    ansible-playbook -u azureuser uasword-deploy.yaml -i hosts

If you want to deploy `ua-loadtest` project:

    ansible-playbook -u azureuser ua-loadtest-deploy.yaml -i hosts
