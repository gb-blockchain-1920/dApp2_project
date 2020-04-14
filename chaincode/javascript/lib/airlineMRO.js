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
        console.log("======== START : Get Companies ==========");

        const compositeIterator = await ctx.stub.getStateByPartialCompositeKey(
            "administrator",
            []
        );
        return this.compositeKeyLoop(ctx, compositeIterator, 0);
    }

    async getMaintainers(ctx, company) {
        console.log("======== START : Get Maintainers ==========");

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
        console.log("======== START : Register User ==========");
        user = JSON.parse(user);
        console.log(user, user.type, user.company, user.username);
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
        let output;
        if (user.type.toString() == "administrator") {
            const compositeIterator = await ctx.stub.getStateByPartialCompositeKey(
                "administrator",
                [user.company.toString()]
            );
            output = await this.compositeKeyLoop(ctx, compositeIterator, 1);
        } else {
            output = await ctx.stub.getState(compositeKey);
            output = output.toString();
        }
        if (output.length != 0) {
            console.log(output);
            throw new Error("user exists");
        }
        console.log(compositeKey);
        await ctx.stub.putState(
            compositeKey,
            Buffer.from(JSON.stringify(user))
        ); //  Store composite key relation for user
    }

    //check if passwords match
    async checkUser(ctx, user) {
        console.log("======== START : Check User ==========");

        user = JSON.parse(user);
        console.log(user, user.type, user.company, user.username);
        const compositeKey = await ctx.stub.createCompositeKey(
            user.type.toString(),
            [user.company.toString(), user.username.toString()]
        );
        let userData = await ctx.stub.getState(compositeKey); //  get the user from the chaincode state
        console.log(JSON.parse(userData.toString()));
        userData = JSON.parse(userData.toString());
        return userData;
    }

    //register a new aircraft in the blockchain
    async registerAircraft(ctx, aircraft, tailNumber, company, image) {
        console.log("======== START : Register Aircraft ==========");

        const aircraftObj = {
            description: { aircraft, tailNumber, image },
            maintenanceSchedule: [
                {
                    type: "A",
                    lastCompletedDate: null,
                    lastCompletedHours: 0,
                    maxHours: 600
                },
                {
                    type: "B",
                    lastCompletedDate: null,
                    lastCompletedHours: 0,
                    maxHours: 2500
                },
                {
                    type: "C",
                    lastCompletedDate: null,
                    lastCompletedHours: 0,
                    maxHours: 8000
                },
                {
                    type: "D",
                    lastCompletedDate: null,
                    lastCompletedHours: 0,
                    maxHours: 25000
                }
            ],
            partsList: [],
            flightHours: 0,
            owner: [{ company, purchaseDate: new Date(), soldDate: null }],
            maintainers: [],
            maintenanceReports: []
        };
        //create new aircraft object
        await ctx.stub.putState(
            tailNumber,
            Buffer.from(JSON.stringify(aircraftObj))
        );

        //assign aircraft to company admin
        const compositeIterator = await ctx.stub.getStateByPartialCompositeKey(
            "administrator",
            [company]
        );
        const username = await this.compositeKeyLoop(ctx, compositeIterator, 1);
        const compositeKey = await ctx.stub.createCompositeKey(
            "administrator",
            [company.toString(), username[0].toString()]
        );
        let userData = await ctx.stub.getState(compositeKey);
        userData = JSON.parse(userData.toString());
        userData.aircraft.push(tailNumber);
        // console.log(userData);
        await ctx.stub.putState(
            compositeKey,
            Buffer.from(JSON.stringify(userData))
        );
    }

    //get aircraft information
    async getAircraft(ctx, tailNumber) {
        console.log("======== START : Get Aircraft ==========");

        const data = await ctx.stub.getState(tailNumber);
        return JSON.parse(data.toString());
    }

    //assign a maintainer to an aircraft
    async assignAircraft(ctx, username, tailNumber, company) {
        console.log("======== START : Assign Aircraft ==========");

        //add maintainer to aircraft
        const aircraftData = await this.getAircraft(ctx, tailNumber);
        aircraftData.maintainers.push(username.toString());
        await ctx.stub.putState(
            tailNumber,
            Buffer.from(JSON.stringify(aircraftData))
        );

        //add aircraft to maintainer profile
        const compositeKey = await ctx.stub.createCompositeKey("maintainer", [
            company.toString(),
            username.toString()
        ]);
        let user = await ctx.stub.getState(compositeKey);
        user = JSON.parse(user.toString());
        user.aircraft.push(tailNumber.toString());
        await ctx.stub.putState(
            compositeKey,
            Buffer.from(JSON.stringify(user))
        );
    }

    //register a new part in blockchain
    async newPart(ctx, part) {
        console.log("======== START : New Part ==========");

        console.log(part);
        part = JSON.parse(part);
        part.totalHours = 0; //make sure new part hours are set to zero
        part.history = [];

        //validate that maximumHours exits and is correct
        if (!part.maximumHours || part.totalHours > part.maximumHours) {
            throw new Error("incorrect max hours parameter");
        }

        //verify that no part exists at that ID
        let check = await ctx.stub.getState(part.description.id);
        check = check.toString();
        if (check.length != 0) {
            throw new Error("part already exists");
        }

        //save part to chain
        await ctx.stub.putState(
            part.description.id,
            Buffer.from(JSON.stringify(part))
        );
    }

    //get part information
    async getPart(ctx, partID) {
        console.log("======== START : Get Part ==========");

        const data = await ctx.stub.getState(partID);
        return JSON.parse(data.toString());
    }

    //update the flight hours for an aircraft and the associated parts
    async updateFlightHours(ctx, tailNumber, hours) {
        console.log("======== START : Update Flight Hours ==========");

        //update aircraft hours
        const aircraft = await this.getAircraft(ctx, tailNumber);
        if (!Number(hours)) {
            //validate hours
            throw new Error("invalid hours");
        }
        aircraft.flightHours += Number(hours);
        await ctx.stub.putState(
            tailNumber,
            Buffer.from(JSON.stringify(aircraft))
        );

        //update part hours
        for (let ii = 0; ii < aircraft.partsList.length; ii++) {
            const part = await this.getPart(
                ctx,
                aircraft.partsList[ii].toString()
            );
            part.totalHours += Number(hours);
            part.history[part.history.length - 1].hours += Number(hours);
            await ctx.stub.putState(
                aircraft.partsList[ii].toString(),
                Buffer.from(JSON.stringify(part))
            );
        }
    }

    async performMaintenance(ctx, tailNumber, type, notes, replacedParts) {
        console.log("======== START : Performance Maintenance ==========");

        //get aircraft and update maintenanceReports
        const aircraft = await this.getAircraft(ctx, tailNumber);
        aircraft.maintenanceReports.push({
            date: new Date(),
            type,
            notes,
            partsReplaced: JSON.stringify(replacedParts)
        });

        //update maintenanceSchedule if necessary
        aircraft.maintenanceSchedule.forEach((obj, index) => {
            //only save to the correct maintenance type
            if (obj.type.toString() == type.toString()) {
                aircraft.maintenanceSchedule[
                    index
                ].lastCompletedDate = new Date();
                aircraft.maintenanceSchedule[index].lastCompletedHours =
                    aircraft.flightHours;
            }
        });

        //save aircraft object
        await ctx.stub.putState(
            tailNumber.toString(),
            Buffer.from(JSON.stringify(aircraft))
        );
    }

    async replaceParts(ctx, tailNumber, replacedParts) {
        console.log("======== START : Replace Parts ==========");

        replacedParts = JSON.parse(replacedParts);
        const aircraft = await this.getAircraft(ctx, tailNumber);

        //update part information
        console.log(
            Object.keys(replacedParts),
            Object.keys(replacedParts).length
        );
        for (let ii = 0; ii < Object.keys(replacedParts).length; ii++) {
            const newPartID = Object.values(replacedParts)[ii];
            const oldPartID = Object.keys(replacedParts)[ii]; //key should be "newPart"+random string if a new part is added to aircraft

            //check if valid part
            const newPart = await this.getPart(ctx, newPartID);
            console.log(newPart);
            const historyObj = {
                tailNumber,
                hours: 0,
                onDate: new Date(),
                offDate: null
            };
            //check that it's a valid part to use if not a new part
            if (newPart.history.length > 0) {
                const check =
                    newPart.history[newPart.history.length - 1].offDate;
                if (check == null) {
                    throw new Error("invalid part");
                }
            }

            //save new part information
            newPart.history.push(historyObj);
            await ctx.stub.putState(
                newPartID.toString(),
                Buffer.from(JSON.stringify(newPart))
            );

            //update old part (skip if not replacing a part on aircraft)
            if (!oldPartID.includes("newPart")) {
                const oldPart = await this.getPart(ctx, oldPartID);
                oldPart.history[
                    oldPart.history.length - 1
                ].offDate = new Date();
                await ctx.stub.putState(
                    oldPartID.toString(),
                    Buffer.from(JSON.stringify(oldPart))
                );
            }

            //update aircraft information
            const index = aircraft.partsList.indexOf(oldPartID); //get index of old part
            if (index != -1) {
                aircraft.partsList[index] = newPartID;
            } else {
                //push to list if old part is not found
                aircraft.partsList.push(newPartID);
            }
        }

        //push aircraft data
        await ctx.stub.putState(
            tailNumber.toString(),
            Buffer.from(JSON.stringify(aircraft))
        );
    }

    async sellAircraft(ctx, tailNumber, company) {
        console.log("======== START : Sell Aircraft ==========");

        const aircraft = await this.getAircraft(ctx, tailNumber);
        //get current company + add new company
        const oldCompany = aircraft.owner[aircraft.owner.length - 1].company;
        // console.log(oldCompany);
        aircraft.owner[aircraft.owner.length - 1].soldDate = new Date();
        aircraft.owner.push({
            company,
            purchaseDate: new Date(),
            soldDate: null
        });
        // console.log(aircraft);

        //add admin to list of maintainers (so they also have the aircraft removed)
        const compositeIteratorOld = await ctx.stub.getStateByPartialCompositeKey(
            "administrator",
            [oldCompany]
        );
        const usernameOld = await this.compositeKeyLoop(
            ctx,
            compositeIteratorOld,
            1
        );
        aircraft.maintainers.push(usernameOld);

        //remove maintainer access
        for (let ii = 0; ii < aircraft.maintainers.length; ii++) {
            const username = aircraft.maintainers[ii];
            const userType = //set usertype to maintainer except for last one (pushed admin earlier)
                aircraft.maintainers.length - 1 == ii
                    ? "administrator"
                    : "maintainer";
            const compositeKey = await ctx.stub.createCompositeKey(
                userType,
                [oldCompany.toString(), username.toString()]
            );
            let userData = await ctx.stub.getState(compositeKey);
            userData = JSON.parse(userData.toString());
            userData.aircraft = userData.aircraft.filter(
                num => num != tailNumber
            );
            await ctx.stub.putState(
                compositeKey,
                Buffer.from(JSON.stringify(userData))
            );
        }
        //remove maintainer array for aircraft
        aircraft.maintainers = [];
        console.log(aircraft);
        await ctx.stub.putState(
            tailNumber,
            Buffer.from(JSON.stringify(aircraft))
        );

        //add aircraft to new company admin
        const compositeIterator = await ctx.stub.getStateByPartialCompositeKey(
            "administrator",
            [company]
        );
        const usernameNew = await this.compositeKeyLoop(
            ctx,
            compositeIterator,
            1
        );
        const compositeKey = await ctx.stub.createCompositeKey(
            "administrator",
            [company.toString(), usernameNew[0].toString()]
        );
        let admin = await ctx.stub.getState(compositeKey);
        admin = JSON.parse(admin.toString());
        admin.aircraft.push(tailNumber);
        console.log(admin);
        await ctx.stub.putState(
            compositeKey,
            Buffer.from(JSON.stringify(admin))
        );
    }
}

module.exports = airlineMRO;
