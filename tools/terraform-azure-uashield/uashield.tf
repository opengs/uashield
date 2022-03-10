locals {
  ssh_username = "adminuser"
}

resource "azurerm_resource_group" "main" {
  name     = "${var.prefix}-resources"
  location = var.location
}
resource "azurerm_virtual_network" "main" {
  name                = "${var.prefix}-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "internal" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_public_ip" "main" {
  name                = "${var.prefix}-public-ip"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  # fields may not be fully populated for Dynamic Public IP's.
  allocation_method = "Static"

  tags = {
    environment = "Production"
  }
}
output "vm_public_ip" {
  value     = azurerm_public_ip.main.ip_address
  sensitive = true
}

resource "azurerm_network_interface" "internal" {
  name                = "${var.prefix}-nic"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.main.id
  }
}
resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}
output "tls_private_key" {
  value     = tls_private_key.ssh_key.private_key_pem
  sensitive = true
}

resource "azurerm_linux_virtual_machine" "uashield" {
  count                           = var.instance_number
  name                            = "uashield-${count.index}"
  location                        = azurerm_resource_group.main.location
  resource_group_name             = azurerm_resource_group.main.name
  network_interface_ids           = [element(azurerm_network_interface.internal.*.id, count.index)]
  size                            = var.instance_size
  priority                        = "Spot"
  eviction_policy                 = "Deallocate"
  disable_password_authentication = true
  admin_username                  = local.ssh_username


  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  admin_ssh_key {
    username   = local.ssh_username
    public_key = trimspace(chomp(tls_private_key.ssh_key.public_key_openssh))
  }

  provisioner "file" {
    source      = "scripts/uashield.sh"
    destination = "/home/adminuser/uashield.sh"

    connection {
      host        = azurerm_public_ip.main.ip_address
      user        = local.ssh_username
      type        = "ssh"
      private_key = tls_private_key.ssh_key.private_key_pem
      timeout     = "1m"
    }
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /home/adminuser/uashield.sh",
      "sudo /home/adminuser/uashield.sh",
    ]

    connection {
      host        = azurerm_public_ip.main.ip_address
      user        = local.ssh_username
      type        = "ssh"
      private_key = tls_private_key.ssh_key.private_key_pem
      timeout     = "1m"
    }
  }

  tags = {
    environment = "staging"
  }
}

