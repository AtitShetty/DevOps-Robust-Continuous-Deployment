# [CSC 519 Devops](https://github.com/CSC-DevOps/Course/) [Milestone 3](https://github.com/CSC-DevOps/Course/blob/master/Project/M3.md)

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

## Checkbox.io Production/Canary Server
This task required us to deploy `checkbox.io` on two different servers. One with `production branch` and one with some changes (a `canary server`).<br />

We have created two different branches (`production` and `canary`)for this in the checkbox.io repository. The jenkins job for checkbox.io deploys these two versions on two different machines. <br />

In total we have created 3 AWS EC2 instances for this task. (This is done in a single run of ansible script which also generates instances for itrust deployement)<br />

The first server runs production branch code, the second server runs canary branch code. Each of them also run `redis-slaves` (explained below) <br />
The third server runs the following things:
- A `load balancer` (port 3000): which diverts some traffic to production and some to canary. It also keeps checking whether the canary server is up and running. If it detects that the canary server is down, all traffic is re-routed to production server.
- A `redis-master` node (port 6379): (explained below)
- A `nodejs server` (port 4000): The third server also runs a node-js server which connects to redis server to access the flags on redis server. This is used to switch the Feature Flag and Canary Flag on/off.

We also have a canary flag setup in redis which can also be used to enable/disable the traffic routing to canary server by load_balancer.
- There are two cases: 
	- First if the canary is down, then all traffic is re-routed to production server.
	- Second, if the canary flag itself is turned off, then also, load-balancer will route all traffic to production.

The files for load balancer are at [./roles/canary_load_balancer/files](./roles/canary_load_balancer/files) <br />

## Redis Setup + Feature Flags:

Feature Flag toggling has been implemented in this milestone through redis master-slave architecure topology. We have used 3 AWS EC2 instances designating 1 as the master and 2 as read-only slaves. The master-slave architecture has been configured in such a way that user can write data on Redis master only and Redis slaves will get the replica of the master data after authenticating themselves with master authentication password.

Redis master is run on one server and redis slaves are run on both production and canary nodes. 

- We have used the application checkbox.io for demonstrating feature flag toggling through Redis.
- checkbox.io has been deployed on the Redis slaves - production and canary servers.
- For demonstrating the feature flag, we have used the route `/api/service/create` in `server.js` of `checkbox.io` application.
	- This enables/disables the ability to create a new survey.
- Once the flag is set on, the access to the `/create` route is enabled from both production and canary servers.
- When the flag is off, the /create route is non-accessible from both production and canary servers.

Redis is also being used to enable/disable a CanaryServer Flag which starts/stops routing of traffic to canary by load balancer.

Redis master and redis salve roles are present in:
`./roles/redis-master` <br />
`./roles/redis-slave`

## Nomad Server Setup:
We have setup up a 3 node nomad cluster (1 master and 2 client nodes)
The inventory file for this is also generated automatically using ansible when the ec2 instacnces are provisioned. <br />

We have used an ansible-galaxy role for setting up nomad: `brianshumate.nomad` <br />
To run the checkbox.io server.js script as a nomad, we have used `raw_exec` driver of nomad. We have created a bash script `run_job.sh` which runs `node server.js` for `checkbox.io`. <br />

We have created a common mongodb server for checkbox.io in the nomad master. Both client nodes connect to this server for database access.<br />
This is done to ensure that when a client node dies and nomad restarts the job on another node, the database is still the same and no data is lost. <br />

The mongo db setup role is at [./roles/mongo-setup/files](./roles/mongo-setup/files) <br />
The files service.nomad, run_job.sh are present in [./roles/nomad-cluster-setup/files](./roles/nomad-cluster-setup/files) <br />

## Screencasts: 

- [Screencast for Deployment and Rolling Updates](https://youtu.be/nz1o3ZfMQMs)
- [Screencast for Checkbox.io Deployment + Redis Feature Flag + Canary Server](https://www.youtube.com/watch?v=NE_TqApmYmc)
- [Screencast for Nomad Cluster Setup](https://www.youtube.com/watch?v=IrVbKKOrhCs)

## Contributions
- Deployment and Rolling Updates - Atit Shetty
- Automatic AWS EC2 Instance Spinning - Abhimanyu Jataria
- Checkbox.io Canary Server Setup + Nomad Cluster Setup + NodeJs Redis Client for setting Redis flags  - Ankur Garg
- Redis Setup + FeatureFlag Implementation - Debosmita Das

