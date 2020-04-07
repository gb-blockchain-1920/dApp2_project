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
cp -R ./dApp2_project/chaincode/. ./fabric-samples/chaincode/eKYC
cd ./fabric-samples/chaincode
mv ./eKYC/start_ekyc.sh ../fabcar
```
If necessary change the permissions on the `start_ekyc.sh` script and run
```
cd ../fabcar
chmod 777 start_ekyc.sh
./start_ekyc.sh
```
Get the API code from the repository
```
cd
git clone https://github.com/aalu1418/dApp1_project
```
Copy the `connection-org1.json` from the `fabric-samples/first-network` folder to the `api\config` folder
```
cd ~/dApp1_project/api
mkdir config
cp ~/fabric-samples/first-network/connection-org1.json ~/dApp1_project/api/config/connection-org1.json
```
Install packages, enroll admin and user, and start server.
```
npm install
node enrollAdmin.js
node registerUser.js
npm start
```
This will start the express server at `http://localhost:3000`. If you are in GCP, it will start the server at `http://<your GCP external IP>:3000`. Please note that you have to enable the firewall rules to allow port 3000 to be exposed in your GCP Compute Engine.

Then from your local machine, deploy the code in the `frontend` folder using `npm start`.
