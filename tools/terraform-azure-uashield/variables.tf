variable "location" {
  type        = string
  description = "Azure VM's location"
  default     = "Japan East"
}

variable "instance_number" {
  type        = number
  description = "Azure VM's instace number"
  default     = 1
}

variable "instance_size" {
  type        = string
  description = "Azure VM's size"
  default     = "Standard_D2s_v3"
}

variable "prefix" {
  type    = string
  default = "uashield"
}
