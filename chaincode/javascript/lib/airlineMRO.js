/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class airlineMRO extends Contract {
    // Adding entires for verifying chaincode works
    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        const test = [
            {
                test: "check",
                status: "commencing countdown",
                error: "none"
            },
            {
                test: "all systems go",
                status: "engine ignition",
                error: "nominal"
            }
        ];

        for (let i = 0; i < test.length; i++) {
            test[i].docType = "user";
            // await ctx.stub.putState('USER' + i, Buffer.from(JSON.stringify(test[i])));
            await ctx.stub.putState(
                (i + 1).toString(),
                Buffer.from(JSON.stringify(test[i]))
            );
            console.info("Added <--> ", test[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    // //  Fetches individual's data for KYC information
    // async getData(ctx, userId) {
    //     const userAsBytes = await ctx.stub.getState(userId);    //  get the user from the chaincode state
    //     if (!userAsBytes || userAsBytes.length === 0) {
    //         throw new Error(`UserID: ${userId} does not exist.`);
    //     }
    //     console.log(userAsBytes.toString());
    //     return userAsBytes.toString();
    // }
    //
    // //  store user data like firstName, lastName, DOB, income, passport
    // async inputData(ctx, userId, userDetails) {
    //     console.log('============= START : Save User Data =========');
    //
    //     const user = {
    //         docType: 'user',
    //         userDetails,
    //     };
    //
    //     await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user))); //  store the user details into the blockchain
    //     console.log('======== END : User Data Stored ===========');
    // }

    async getCompanies(ctx) {
        const compositeIterator = await ctx.stub.getStateByPartialCompositeKey(
            "administrator",
            []
        );
        return this.compositeKeyLoop(ctx, compositeIterator, 0);
    }

    async getMaintainers(ctx, company) {
        const compositeIterator = await ctx.stub.getStateByPartialCompositeKey(
            "maintainer",
            [company.toString()]
        );
        return this.compositeKeyLoop(ctx, compositeIterator, 1);
    }

    async compositeKeyLoop(ctx, compositeIterator, attributeIndex) {
        let list = []; //  To store list of company Ids if userId is passed as input in function and to store list of userIds if compnayId is passed as input in function
        while (true) {
            const responseRange = await compositeIterator.next();

            //  Validation if list of userIds or companyIds is empty
            if (
                !responseRange ||
                !responseRange.value ||
                !responseRange.value.key
            ) {
                console.log("end of data");
                return list;
            }

            console.log(
                `Response value: ${responseRange.value.key.toString("utf8")}`
            );
            let userType;
            let attributes;
            //  Split the composite key to get the companyIds and userIds
            ({ userType, attributes } = await ctx.stub.splitCompositeKey(
                responseRange.value.key
            ));
            list.push(attributes[attributeIndex]); //  Adding the list of userIds if filtered on the basis of companyIds or vice versa.
        }
    }

    //  users approves companies to access their information
    async registerUser(ctx, user) {
        console.log(
            "======== START : Approve company for user data access =========="
        );
        user = JSON.parse(user);
        // console.log(user, user.type, user.company, user.username);
        const compositeKey = await ctx.stub.createCompositeKey(
            user.type.toString(),
            [user.company.toString(), user.username.toString()]
        ); //  create company~user relation unique key

        // Validations for composite keys created
        if (!compositeKey) {
            throw new Error("compositeKey is null");
        }

        user.aircraft = []; //initialize aircraft array for user

        //check if admin for company already exists or if user already exists
        let output = null;
        if (user.type.toString() == "maintainer") {
          const compositeIterator = await ctx.stub.getStateByPartialCompositeKey(
              "maintainer",
              [user.company.toString()]
          );
          output = this.compositeKeyLoop(ctx, compositeIterator, 1);
        } else {
          output = await ctx.stub.getState(compositeKey)
        }
        if (output != null) {
          console.log(output);
          throw new Error("user exists");
        }

        await ctx.stub.putState(
            compositeKey,
            Buffer.from(JSON.stringify(user))
        ); //  Store composite key relation for user
        console.log(
            "======== END : Relation of approved companies for users stored ========="
        );
    }

    //check if passwords match
    async checkUser(ctx, user) {
        user = JSON.parse(user);
        // console.log(user, user.type, user.company, user.username);
        const compositeKey = await ctx.stub.createCompositeKey(
            user.type.toString(),
            [user.company.toString(), user.username.toString()]
        );
        let userData = await ctx.stub.getState(compositeKey); //  get the user from the chaincode state
        // console.log(JSON.parse(userData.toString()));
        userData = JSON.parse(userData.toString());
        return user.password == userData.password;
    }
}

module.exports = airlineMRO;
