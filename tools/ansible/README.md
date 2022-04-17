# uashield-ansible
Uashield Ansible playbook installing and running uashield in a docker-compose

## Як розгорнути на Azure / How to set up on Azure
https://docs.google.com/document/d/11dV32WBAhKqH3fIYTczG0pTlX_3EdLkXoLAqY5z4UDo/edit?usp=sharing

Note: If you using Azure then use `azureuser` default user name instead of `root` in commands below.

## EN
### 1. Install Ansible on your machine
#### Mac OS
    brew install ansible
#### Linux
    apt install ansible

### 2. Fill `hosts` file with servers address
Each address must be at the new line, as in example

### 3. Use `*.pem` key for SSH connection (useful on Azure/AWS)
Hosts must be following format:
```
[servers]
0.0.0.0 ansible_ssh_private_key_file=/path/to/your-key.pem
0.0.0.1 ansible_ssh_private_key_file=/path/to/your-key-2.pem
```

Update permissions for keys:
```
chmod 400 /path/to/keys/*.pem
```

Make sure keys are loaded into `ssh-agent`
```
ssh-agent bash -c "ssh-add /path/to/keys/*.pem"
```

### 4. Copy your public SSH key to the hosts
Optional step, you can skip it if you're using passwords or `*.pem` keys for ssh

    ssh-copy-id -i ~/.ssh/id_rsa.pub user@host

### 5. Check servers availability for Ansible
Optional step, can be skipped

    ansible all -m ping -u root -i hosts

### 6. Run playbook and enter servers passwords when it asks

    ansible-playbook -u root deploy.yaml -i hosts

### 7. Get stats of successful requests

    ansible-playbook -u root stats.yaml -i hosts

### 8. Update to the latest version and restart containers

    ansible-playbook -u root update.yaml -i hosts

## UA
### 1. Інсталюйте ansible на свою машину
#### Mac OS
    brew install ansible
#### Linux
    apt install ansible

### 2. Заповніть файл `hosts` адресами своїх серверів
Кожна адреса має бути на наступному рядку, як приклад у файлі

### 3. Використання `*.pem` ключа для SSH з'єднання (корисно для Azure/AWS користувачів)
Використовуйте наступний формат хостов:
```
[servers]
0.0.0.0 ansible_ssh_private_key_file=/path/to/your-key.pem
0.0.0.1 ansible_ssh_private_key_file=/path/to/your-key-2.pem
```

Оновить дозвіл файлов ключей:
```
chmod 400 /path/to/keys/*.pem
```

Переконайтесь що ключи додані у `ssh-agent`
```
ssh-agent bash -c "ssh-add /path/to/keys/*.pem"
```

### 4. Скопіюйте відкритий SSH ключ на сервери
Опціонально, ви можете пропустити цей крок, якщо використовуєете паролі або `*.pem` ключ для SSH

    ssh-copy-id -i ~/.ssh/id_rsa.pub user@host

### 5. Перевірте, чи всі ваші сервери зі списку `hosts` доступні
Опціонально, ви можете пропустити цей крок

    ansible all -m ping -u root -i hosts

### 6. Запустіть плейбук та введіть паролі, коли він запитає

    ansible-playbook -u root deploy.yaml -i hosts

### 7. Перевірка статистики успішних запитів

    ansible-playbook -u root stats.yaml -i hosts

### 8. Оновити до останньої версії та перезавантажити

    ansible-playbook -u root update.yaml -i hosts
