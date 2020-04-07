/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class airlineMRO extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        // Adding users for Testing purpose
        const users = [
            {
                firstName: 'Alice',
                lastName: 'Mckay',
                DOB: 312921208077,
                income: 3000,
                passport: 987654,
            },
            {
                firstName: 'Bob',
                lastName: 'Kein',
                DOB: 312921201213,
                income: 2000,
                passport: 832654,
            },
        ];

        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'user';
            // await ctx.stub.putState('USER' + i, Buffer.from(JSON.stringify(users[i])));
            await ctx.stub.putState((i+1).toString(), Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    //  Fetches individual's data for KYC information
    async getData(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId);    //  get the user from the chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`UserID: ${userId} does not exist.`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    //  store user data like firstName, lastName, DOB, income, passport
    async inputData(ctx, userId, userDetails) {
        console.log('============= START : Save User Data =========');

        const user = {
            docType: 'user',
            userDetails,
        };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user))); //  store the user details into the blockchain
        console.log('======== END : User Data Stored ===========');
    }

    //  users approves companies to access their information
    async approveCompany(ctx, userId, companyId) {
        console.log('======== START : Approve company for user data access ==========');

        //  `relations` created for 2-way access like if company id is given then list of users will be fetched  and vice versa too.
        let relations = 'id1~id2';  //  relation type to be stored on blockchain (company~user or user~company)
        let companyUserIndexKey = await ctx.stub.createCompositeKey(relations, [companyId.toString(), userId.toString()]);  //  create company~user relation unique key
        let userCompanyIndexKey = await ctx.stub.createCompositeKey(relations, [userId.toString(), companyId.toString()]);  //  create user~company relation unique key

        // Validations for composite keys created
        if (!companyUserIndexKey) {
            throw new Error('Composite key: companyUserIndexKey is null');
        }

        if (!userCompanyIndexKey) {
            throw new Error('Composite key: userCompanyIndexKey is null');
        }

        console.log(companyUserIndexKey);

        //  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
        await ctx.stub.putState(companyUserIndexKey, Buffer.from('\u0000'));    //  Store company~user unique key relation
        await ctx.stub.putState(userCompanyIndexKey, Buffer.from('\u0000'));    //  Store user~company unique key relation
        console.log('======== END : Relation of approved companies for users stored =========');
    }

    //  Used to save companyId to list of company ids
    async saveCompany(ctx, companyID) {
        console.log('=========== START : Save Company Data ===========');

        const companies_list_id = 'companies_list_id';  //  Static id for accessing the list of companies

        const companiesAsBytes = await ctx.stub.getState(companies_list_id);    //  get the companies list from the blockchain
        if (!companiesAsBytes || companiesAsBytes.length === 0) {
            const companyObj = {list: [companyID]}; //  create the companyObj for storing the list of companies
            console.log(`CompanyObj: ${JSON.stringify(companyObj)}`);
            await ctx.stub.putState(companies_list_id, Buffer.from(JSON.stringify(companyObj)));    //  Store the newly created companies list into the blockchain
            return;
        }

        console.log(`Fetched CompanyObj from blockchain: ${companiesAsBytes.toString()}`);
        let companyObj = JSON.parse(companiesAsBytes);

        companyObj.list.push(companyID);    //  Adding the companyID into the existing list of the companies list
        console.log(`Updated companyObj: ${companyObj}`);

        await ctx.stub.putState(companies_list_id, Buffer.from(JSON.stringify(companyObj)));    //  Store the updated companies list into the blochchain
        console.log('======== END : Company Id Stored ==========');
    }

    //  Fetches a list of all approved and registered companies
    async getCompanies(ctx) {

        const companies_list_id = 'companies_list_id';  //  Static id for accessing the list of companies
        const companiesAsBytes = await ctx.stub.getState(companies_list_id);    //  get the companies list from the chaincode state
        if (!companiesAsBytes || companiesAsBytes.length === 0) {
            throw new Error('Companies list is empty.');
        }
        console.log(`Companies list: ${JSON.parse(companiesAsBytes)}`);
        return JSON.parse(companiesAsBytes);
    }

    //  for company - function to get approved userIds and for user - function to get approved companyIds
    async getRelations(ctx, id) {

        //  `relations` created for 2-way access like if company id is given then list of users will be fetched  and vice versa too.
        let relations = 'id1~id2';  //  relation type to be stored on blockchain (company~user or user~company)
        let relationResultsIterator = await ctx.stub.getStateByPartialCompositeKey(relations, [id.toString()]); //  Get company~user or user~company number of relations

        let relationsArray = [];    //  To store list of company Ids if userId is passed as input in function and to store list of userIds if compnayId is passed as input in function
        while (true) {

            let responseRange = await relationResultsIterator.next();

            //  Validation if list of userIds or companyIds is empty
            if (!responseRange || !responseRange.value || !responseRange.value.key) {
                console.log('end of data');
                console.log(`relationsArray: ${relationsArray}`);
                return JSON.stringify(relationsArray);
            }

            console.log(`Response value: ${responseRange.value.key.toString('utf8')}`);
            let objectType;
            let attributes;
            //  Split the composite key to get the companyIds and userIds
            ({
                objectType,
                attributes
            } = await ctx.stub.splitCompositeKey(responseRange.value.key));

            // let id1 = attributes[0];   //  ID1 param of the relation
            let id2 = attributes[1];         //  ID2 param of the relation (ID2 = userId if attributes[0] = companyId or ID2 = companyId if attributes[0] = userID)
            console.log(`Index Type: ${objectType}`);

            relationsArray.push(id2);   //  Adding the list of userIds if filtered on the basis of companyIds or vice versa.

        }
    }
}

module.exports = airlineMRO;
