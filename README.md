# CSC 519 Devops-milestone3

## Team Members
- Abhimanyu Jataria(ajatari)
- Ankur Garg(agarg12)
- Atit Shetty(akshetty)
- Debosmita Das(ddas5)

## Redis Implementation:

Feature Flag toggling has been implemented in this milestone through redis master-slave architecure topology. We have used 3 AWS EC2 instances designating 1 as the master and 2 as read-only slaves. The master-slave architecture has been configured in such a way that user can write data on Redis master only and Redis slaves will get the replica of the master data after authenticating themselves with master authentication password.

- We have used the application checkbox.io for demonstrating feature flag toggling through Redis.
- checkbox.io has been deployed on the Redis master.
- A route "/api/service/create" has been created in server.js of checkbox.io application.
- Once the flag is set on, the access to the /create route is enabled from both master and slave.
- When the flag is off, the /create route is non-accessible from either master or slave.

## Contributions
- Deployment of CheckBox.io and iTrust & Rolling Update - Atit Shetty
- Automatic AWS EC2 Instance Spinning - Abhimanyu Jataria
- Nomad Cluster Implemementation & canary Release - Ankur Garg
- Redis FeatureFlag Implementation - Debosmita Das
