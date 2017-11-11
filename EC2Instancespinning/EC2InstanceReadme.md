1. install python-dev build-essential
2. install boto
3. touch ~./boto
4. Contents of boto file:

[Credentials]
aws_access_key_id = check from aws instance prop
aws_secret_access_key = check from aws instance prop

5. in root folder mkdir -p roles/provision-ec2/tasks
cd roles/provision-ec2/tasks
vi main.yml

6. content of main.yml
-- check file in this folder

7. go back to root
cd ec2_vars

8. vi ec2_vars/webservers.yml
-- content - check file in this folder

9.in root folder
vi provision-ec2.yml

-- content - check file in this folder

10. run playbook
ansible-playbook -vv -i localhost, -e "type=webservers" provision-ec2.yml
