## Requirements
- [Instal terraform](https://www.terraform.io/downloads)


## Export environment vars
Extra logs
```
export TF_LOG=INFO
```
## Create and export DO PAT
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
