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
This script will create resource group per region and create 4 vm instances. Optional. You can change prefix name of VMs `./init.sh test`

    ./init.sh

### Run script to update `hosts`
This script will add Public IP of created VMs to `hosts` file.

    ./update-hosts.sh

### Run ansible-playbook to deploy to all instances
Choose your fighter.

To deploy `uashield` project:

    ansible-playbook -u azureuser deploy.yaml -i hosts

To deploy `uasword` project:

    ansible-playbook -u azureuser uasword-deploy.yaml -i hosts

To deploy `ua-loadtest` project:

    ansible-playbook -u azureuser ua-loadtest-deploy.yaml -i hosts

### Run ansible-playbook to update all instances to the latest version

To update `uashield` project:

    ansible-playbook -u azureuser update.yaml -i hosts

To update `uasword` project:

    ansible-playbook -u azureuser uasword-update.yaml -i hosts

To update `ua-loadtest` project:

    ansible-playbook -u azureuser ua-loadtest-update.yaml -i hosts
