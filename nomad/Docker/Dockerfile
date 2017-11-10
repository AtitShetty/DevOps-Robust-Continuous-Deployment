FROM    ubuntu:16.04

# Add repo for mongodb
RUN		apt-get update -y && apt-get install -y apt-transport-https
RUN		apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN		echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
RUN 	apt-get update
# Install MONGO DB
RUN     apt-get install -y mongodb

COPY files/mongodb.service /etc/systemd/system/
RUN		service mongodb restart

# RUN 	systemctl enable mongodb.service
# EXPOSE 3002
# EXPOSE 27017

RUN		echo 'MONGO_PORT="3002"' >> /etc/environment
RUN		echo 'MONGO_IP="127.0.0.1"' >> /etc/environment
RUN		echo 'MONGO_USER="admin"' >> /etc/environment
RUN		echo 'MONGO_PASSWORD="admin"' >> /etc/environment
RUN		echo 'MAIL_USER=""' >> /etc/environment
RUN		echo 'MAIL_PASSWORD=""' >> /etc/environment
RUN		echo 'MAIL_SMTP="mock"' >> /etc/environment
RUN		. /etc/environment

# Install nginx
RUN 	apt-get update -y && apt-get install -y nginx build-essential git
COPY	files/nginx.conf /etc/nginx/
COPY	files/default /etc/nginx/sites-available/

# Install Node.js and npm
RUN     apt-get update -y
RUN     apt-get install -y nodejs
RUN     apt-get install -y nodejs-legacy
RUN     apt-get install -y npm

RUN		echo 'export PATH=$PATH:/usr/local/bin' >> $HOME/.bashrc

# Bundle app source
# COPY . /src
# Install app dependencies
# RUN cd /src; npm install

RUN 	git clone https://github.com/AtitShetty/checkbox.io.git /checkbox.io
RUN 	cd /checkbox.io/server-side/site; npm install; npm install -g forever

COPY files/runscript.sh runscript.sh
RUN chmod +x runscript.sh

EXPOSE  80
CMD ./runscript.sh