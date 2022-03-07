[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=4e29ef6429c9&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

[Get $100 to try DigitalOcean, link for sing in above](https://try.digitalocean.com/freetrialoffer/)


## Requirements
- [Instal terraform](https://www.terraform.io/downloads)
- [Add SSH key](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/to-account/) to DO with name `ssh`

## Export environment vars
```
# Create and export DO PAT
# https://docs.digitalocean.com/reference/api/create-personal-access-token/
export DO_PAT="<your_pat>"

# Provide and export ssh key
export SSH_KEY_PATH="$HOME/.ssh/id_ed25519"

# Logs level
export TF_LOG="DEINFOBUG"
```

## Option 1: docker-compose
### Deploy the uashields infrastructure to DO
```
make tf-deploy
```
### Destroy the uashields infrastructure
```
make tf-destroy
```
>NOTE: Make do not work for Windows user, please use command below:
```
# To deploy
> docker-compose -f docker-compose.yml run terraform init
> docker-compose -f docker-compose.yml run terraform apply

# To destroy
> docker-compose -f docker-compose.yml run terraform destroy
```
## Option 2: terraform
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
