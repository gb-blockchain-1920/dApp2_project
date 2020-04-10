### Commands used in docker for installing, instantiating and invoking the chaincode:

- Open Docker by running `docker exec -it cli bash` and then run the following commands step by step.

**1. Install (To install the chaincode)**

```
peer chaincode install -l node -n airlineMRO -v 1.2 -p /opt/gopath/src/github.com/chaincode/airlineMRO/javascript/
```

**2. a) Instantiate (To instantiate/deploy the chaincode)**

```
peer chaincode instantiate -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -v 1.2 -c '{"Args":["initLedger"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
```

**2. b) Upgrade (To upgrade/deploy again the chaincode)**

```
peer chaincode upgrade -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -v 1.2 -c '{"Args":["initLedger"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
```

`Note: -v in instantiate and upgrade means version of chaincode you want to deploy and it should be same as given in the install command`

**3. Invoke (To incoke the chaincode)**

registerUser
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["registerUser","{\"username\":\"hello\",\"password\":\"test\",\"type\":\"administrator\",\"company\":\"delta\"}"]}'
```
checkUser
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["checkUser","{\"username\":\"hello\",\"password\":\"test\",\"type\":\"administrator\",\"company\":\"delta\"}"]}'
```
registerAircraft
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["registerAircraft","Boeing 787-10", "BNGFD-4", "delta"]}'
```
assignAircraft
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["assignAircraft","bob", "BNGFD-4", "delta"]}'
```
getAircraft
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["getAircraft","BNGFD-4"]}'
```
newPart
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["newPart","{\"description\":{\"id\":\"test part\",\"description\":\"some important part\"},\"maximumHours\":100}"]}'
```
getPart
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["getPart","test part"]}'
```
replaceParts
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["replaceParts","BNGFD-4","{\"newPart001\":\"test part\"}"]}'
```
updateFlightHours
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["updateFlightHours","BNGFD-4", "5"]}'
```
performMaintenance
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["performMaintenance","BNGFD-4", "A", "nominal", "none"]}'
```
sellAircraft
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["sellAircraft","BNGFD-4", "united"]}'
```
