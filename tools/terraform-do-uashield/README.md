## Requirements
- [Instal terraform](https://www.terraform.io/downloads)
- [Add SSH key](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/to-account/) to DO with name `ssh`


## Export environment vars
Extra logs
```
export TF_LOG=INFO
```
## Create and export DO PAT
- [DO PAT](https://docs.digitalocean.com/reference/api/create-personal-access-token/)
```
export DO_PAT="<your_pat>"
```
## Init terraform
```
terraform init
```

```
terraform apply \
  -var "do_token=${DO_PAT}" \
  -var "pvt_key=$HOME/.ssh/id_ed25519"
```

```
terraform destroy \
  -var "do_token=${DO_PAT}" \
  -var "pvt_key=$HOME/.ssh/id_ed25519"
```
