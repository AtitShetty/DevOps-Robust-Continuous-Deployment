# devops-milestone3

## Requirements

Two private keys are required

a) jenkins_host.pem (for jenkins host if host is not local machine)

b) deployment_env.pem (for remote host like aws)

## Info

a) site.yml will setup jenkins server and add iTrust jobs

b) deploy_iTrust.yml is the ansible script that will be called from iTrust jenkins job via pre-push hook. This will set up remote host to run iTrust application.

c) deploy_checkboxio.yml is the ansible script that will be called from checkboxio jenkins job via pre-push hook. This will set up remote host to run checkboxio application.

d) staging.yml is the inventory file.

e) site.yml will setup jenkins and jenkins job iTrust and checkbox.io

f) any variables for a host or group should be set inside folder host_vars, and the name of file will be hostname.yml (e.g. jenkins.yml)

e) keep all the roles inside roles folder

f) no need to put become inside roles

## Note

a) Try to follow the structure, it will be easy to maintain.



