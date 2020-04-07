### Commands used in docker for installing, instantiating and invoking the chaincode:

* Open Docker by running `` docker exec -it cli bash `` and then run the following commands step by step.

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
`` Note: -v in instantiate and upgrade means version of chaincode you want to deploy and it should be same as given in the install command``

**3. Invoke (To incoke the chaincode)** (As an example: InputData Function)
##### a) Preferred way:
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["inputData","USERX1","{firstName:Deep,lastName:Gupta}"]}'
```
``Output (on CouchDB)``
```
{
  "_id": "USERX1",
  "_rev": "2-6078b3400a86cffef56696649ed71c09",
  "user": "{firstName:Deep,lastName:Gupta}",
  "~version": "\u0000CgMBBwA="
}
```
##### b) Alternate way:
```
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n airlineMRO -c '{"Args":["inputData","USER1","{firstName:\"Deep\",lastName:\"Gupta\"}"]}'
```
``Output (on CouchDB)``
```
{
  "_id": "USER1",
  "_rev": "1-4b6a7f7969fe4e71ed0d3ebbf4967afb",
  "user": "{firstName:\"Deep\",lastName:\"Gupta\"}",
  "~version": "\u0000CgMBCAA="
}
```