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

    //  users approves companies to access their information
    async registerUser(ctx, user) {
        console.log(
            "======== START : Approve company for user data access =========="
        );
        user = JSON.parse(user);
        //  `relations` created for 2-way access like if company id is given then list of users will be fetched  and vice versa too.
        const relations = "user"; //  relation type to be stored on blockchain (company~user or user~company)
        console.log(user, user.type, user.company, user.username);
        const compositeKey = await ctx.stub.createCompositeKey(relations, [
            user.type.toString(),
            user.company.toString(),
            user.username.toString()
        ]); //  create company~user relation unique key

        // Validations for composite keys created
        if (!compositeKey) {
            throw new Error("compositeKey is null");
        }

        user.aircraft = []; //initialize aircraft array for user

        await ctx.stub.putState(
            compositeKey,
            Buffer.from(JSON.stringify(user))
        ); //  Store composite key relation for user
        console.log(
            "======== END : Relation of approved companies for users stored ========="
        );
    }
}

module.exports = airlineMRO;
