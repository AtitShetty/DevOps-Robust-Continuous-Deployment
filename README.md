# devops-milestone3

## Requirements

Two private keys are required

a) jenkins_host.pem (for jenkins host if host is not local machine)

b) deployment_env.pem (for remote host like aws)

## Info

a) site.yml will setup jenkins server and add iTrust jobs

b) deploy_iTrust.yml is the ansible script that will be called from iTrust jenkins job via pre-push hook. This will set up remote host to run iTrust application.

c) deploy_checkboxio.yml is the ansible script that will be called from checkboxio jenkins job via pre-push hook. This will set up remote host to run checkboxio application.

d) staging.yml is the inventory file


