# devops-milestone3

## Requirements

Two private keys are required

a) jenkins_host.pem (for jenkins host if host is not local machine)

b) deployment_env.pem (for remote host like aws)

## Info

a) site.yml will setup jenkins server and add iTrust jobs

b) deploy_iTrust.yml is integrated with iTrust job post-build action. This will set up remote host to run iTrust application.



