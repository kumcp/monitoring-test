#/bin/bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


nvm install 22

node -v # should print `v22.11.0`

npm -v # should print `10.9.0`

git clone https://github.com/kumcp/monitoring-test.git

cd monitoring-test/

npm install

sudo apt install nginx -y

ln -s ./system-config/nginxs