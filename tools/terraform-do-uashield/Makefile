.PHONY: tf-deploy
tf-deploy: tf-init tf-apply

.PHONY: tf-init
tf-init:
	docker-compose -f docker-compose.yml run terraform init

.PHONY: tf-fmt
tf-fmt:
	docker-compose -f docker-compose.yml run terraform fmt

.PHONY: tf-validate
tf-validate:
	docker-compose -f docker-compose.yml run terraform validate

.PHONY: tf-plan
tf-plan:
	docker-compose -f docker-compose.yml run terraform plan

.PHONY: tf-apply
tf-apply:
	docker-compose -f docker-compose.yml run terraform apply -auto-approve -auto-approv

.PHONY: tf-destroy
tf-destroy:
	docker-compose -f docker-compose.yml run terraform destroy -auto-approve -auto-approv
