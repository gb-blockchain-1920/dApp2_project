### Installation + Deployment Instructions
Starting in the home directory (`~/`), install Prerequisites (for Ubuntu):
```
curl -O https://hyperledger.github.io/composer/v0.19/prereqs-ubuntu.sh
chmod u+x prereqs-ubuntu.sh
./prereqs-ubuntu.sh
```

Install Hyperledger Fabric (v1.4)
```
curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.4 1.4.4 0.4.18
```

Test the network
```
cd ~/fabric-samples/fabcar
./startFabric.sh javascript
docker ps
```
There should be various docker containers indicating a successful startup of the fabric system.

Install the the chaincode in the correct directory and move the start script to the fabcar folder
```
cd
git clone https://github.com/aalu1418/dApp2_project
cp -R ./dApp2_project/chaincode/. ./fabric-samples/chaincode/airlineMRO
cd ./fabric-samples/chaincode
mv ./airlineMRO/start_airlineMRO.sh ../fabcar
```
If necessary change the permissions on the `start_airlineMRO.sh` script and run
```
cd ../fabcar
chmod 777 start_airlineMRO.sh
./start_airlineMRO.sh
```

#### API Setup
Copy the `connection-org1.json` from the `fabric-samples/first-network` folder to the `api\config` folder
```
cd ~/dApp2_project/api
mkdir config
cp ~/fabric-samples/first-network/connection-org1.json ~/dApp2_project/api/config/connection-org1.json
```
Install packages, enroll admin and user, and start server.
```
yarn
node enrollAdmin.js
node registerUser.js
yarn start
```
This will start the express server at `http://localhost:3000`. If you are in GCP, it will start the server at `http://<your GCP external IP>:3000`. Please note that you have to enable the firewall rules to allow port 3000 to be exposed in your GCP Compute Engine.
