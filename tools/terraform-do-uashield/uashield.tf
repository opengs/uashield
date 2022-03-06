resource "digitalocean_droplet" "uashield" {
  count      = var.droplet_instance_number
  image      = "ubuntu-20-04-x64"
  name       = "uashield-${count.index}"
  region     = "nyc3"
  size       = var.droplet_instance_size
  monitoring = true

  ssh_keys = [
    data.digitalocean_ssh_key.ssh.id
  ]

  connection {
    host        = self.ipv4_address
    user        = "root"
    type        = "ssh"
    private_key = file(var.pvt_key)
    timeout     = "2m"
  }

  provisioner "file" {
    source      = "scripts/uashield.sh"
    destination = "/opt/uashield.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /opt/uashield.sh",
      "/opt/uashield.sh",
    ]
  }
}

