variable "droplet_instance_number" {
  type        = number
  description = "Digital Ocean droplet instace number"
  default     = 1
}

variable "droplet_instance_size" {
  type        = string
  description = "Digital Ocean droplet instace size"
  default     = "s-1vcpu-1gb"
}

variable "do_token" {}
variable "pvt_key" {}
