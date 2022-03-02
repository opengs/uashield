# uashield-ansible
Uashiled Ansible playbook for installing and running disbalancer as a service


### 1. Install Ansible on your machine
#### Mac OS
    brew install ansible
#### Linux
    apt install ansible

### 3. Fill hosts file with servers address

### 3. Copy your public SSH key to the hosts
Optional step, you can skip it if you're using passwords for ssh

    ssh-copy-id -i ~/.ssh/id_rsa.pub user@host

### 4. Check servers availability for Ansible
Optional step, can be skipped

    ansible all -m ping -u root

### 5. Run playbook and enter servers passwords when it asks

    ansible-playbook -u root deploy.yaml -i hosts

