[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=4e29ef6429c9&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

[Get $100 to try DigitalOcean, link for sing in above](https://try.digitalocean.com/freetrialoffer/)


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