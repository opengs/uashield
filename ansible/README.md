# uashield-ansible
Uashiled Ansible playbook installing and running uashield in a docker-compose

## EN
### 1. Install Ansible on your machine
#### Mac OS
    brew install ansible
#### Linux
    apt install ansible

### 2. Fill `hosts` file with servers address
Each address must be at tne new line, as in example

### 3. Copy your public SSH key to the hosts
Optional step, you can skip it if you're using passwords for ssh

    ssh-copy-id -i ~/.ssh/id_rsa.pub user@host

### 4. Check servers availability for Ansible
Optional step, can be skipped

    ansible all -m ping -u root

### 5. Run playbook and enter servers passwords when it asks

    ansible-playbook -u root deploy.yaml -i hosts



## UA
### 1. Інсталюйте ansible на свою машину
#### Mac OS
    brew install ansible
#### Linux
    apt install ansible

### 2. Заповніть файл `hosts` адресами своїх серверів
Кожна адреса має бути на наступному рядку, як приклад у файлі

### 3. Скопіюйте відкритий SSH ключ на сервери
Опціонально, ви можете пропустити цей крок, якщо використовуєете паролі для SSH замість ключів

    ssh-copy-id -i ~/.ssh/id_rsa.pub user@host

### 4. Перевірте, чи всі ваші сервери зі списку `hosts` доступні
Опціонально, ви можете пропустити цей крок

    ansible all -m ping -u root

### 5. Запустіть плейбук та введіть паролі, коли він запитає

    ansible-playbook -u root deploy.yaml -i hosts