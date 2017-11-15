# [CSC 519 Devops](https://github.com/CSC-DevOps/Course/) [Milestone3](https://github.com/CSC-DevOps/Course/blob/master/Project/M3.md)

## Team Members
- Abhimanyu Jataria(ajatari)
- Ankur Garg(agarg12)
- Atit Shetty(akshetty)
- Debosmita Das(ddas5)

## Deployment:

This task required us to set up a Jenkins server that will deploy iTrust and checkbox.io to remote servers.

- The first requirement of deployment is to have remote servers. We have created an ansible role ``` provision_ec2 ``` that will create multiple instances of AWS EC2 instances and dynamically generate two inventory files ``` checkbox_inventory ``` and ``` iTrust_inventory ```. These files will be used by Jenkins jobs to trigger an ansible playbook for deployment to the EC2 instances. 

  Note: We keep a track of the created EC2 instances in a file located at ``` /etc/ec2info/ec2_ip_list ```. Using this file we determine     whether to generate new instances or not.

- The next step towards deployment is to setup a Jenkins server and create jobs that will manage deployment. Using the role ``` jenkins_setup ```, ``` itrust_jenkins_job_setup ``` and ``` checkboxio_jenkins_job_setup ```, we provision the Jenkins server to run jobs with the name ``` itrust-packaging-job ``` and ``` checkbox-packaging-job ```.

- Let us take for e.g. ``` itrust-packaging-job ```. This job will first take latest changes from the master branch of **iTrust** repository. It will then perform a maven package, that will essentially run all the tests and create a war package. It will also create a pre-push hook, which we will discuss in a while. 

- If the build is successful, Jenkins will trigger a push to  **production** branch of **iTrust**. This will trigger the pre-push hook that we created earlier. This hook will run an ansible playbook ``` deploy_iTrust.yml ``` using ``` iTrust_inventory ``` to trigger a deployment on the servers that are present in the inventory file.

  Note: The inventory file ``` iTrust_inventory ``` has one server as a dedicated mysql server that will be accessed remotely by other remote server running **iTrust** application. This will ensure data integrity.
  
- This approach ensures that only a running application is deployed in the production.

- Similarly, job ``` checkbox-packaging-job ``` will trigger a deployment, through pre-push hooks, to production using playbook ``` deploy_checkboxio.yml ``` and ``` checkbox_inventory ```.

- In this way deployment to remote EC2 instances is completed.

- All the above tasks are executed using playbook ``` site.yml ``` and inventory ``` staging.yml ``` on an Ansible host.

## Rolling Updates for iTrust:

- Rolling updates work in similar manner as deployment. They are also taken care by the jenkins job ``` itrust-packaging-job ```.

- The only difference with deployment is that, while deployment can occur in parallel across all the hosts, rolling updates are peformed are performed on one host at a time.

- We have achieved this by adding a ``` serial ``` parameter in the playbook ``` deploy_iTrust.yml ```. This will force the ansible playbook to be run in one host at a time, for all the hosts belonging to a certain group.

- As we have seen before, this playbook is triggered from pre-push hook when a push to production is triggered.

- In this way we have achieved rolling updates.

## Screencasts: 

- [Screencast for Deployment and Rolling Updates](https://youtu.be/nz1o3ZfMQMs)
- [Screencast for Checkbox.io Deployment + Redis Feature Flag + Canary Server](https://www.youtube.com/watch?v=NE_TqApmYmc)
- [Screencast for Nomad Cluster Setup](https://www.youtube.com/watch?v=IrVbKKOrhCs)

## Redis Implementation:

Feature Flag toggling has been implemented in this milestone through redis master-slave architecure topology. We have used 3 AWS EC2 instances designating 1 as the master and 2 as read-only slaves. The master-slave architecture has been configured in such a way that user can write data on Redis master only and Redis slaves will get the replica of the master data after authenticating themselves with master authentication password.

- We have used the application checkbox.io for demonstrating feature flag toggling through Redis.
- checkbox.io has been deployed on the Redis master.
- A route "/api/service/create" has been created in server.js of checkbox.io application.
- Once the flag is set on, the access to the /create route is enabled from both master and slave.
- When the flag is off, the /create route is non-accessible from either master or slave.

## Contributions
- Deployment and Rolling Updates - Atit Shetty
- Automatic AWS EC2 Instance Spinning - Abhimanyu Jataria
- Nomad Cluster Implemementation & canary Release - Ankur Garg
- Redis FeatureFlag Implementation - Debosmita Das
