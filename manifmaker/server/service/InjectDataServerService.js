import {ServerService} from "./ServerService";

/** @class InjectDataServerService */
export class InjectDataServerService {

    /**
     * @summary perform deleteAll, initAccessRightData and populateData
     */
    static injectAllData() {
        console.info("inject data starts");
        this.deleteAll();
        console.info("deleteAll done");
        this.initAccessRightData();
        var groupRoles =  this.injectGroupRoles()
        console.info("initAccessRightData done");
        this.injectUsers(groupRoles);
        console.info("injectUsers done");
        this.populateData();

        console.info("**** Data init success ****");
        console.info("Here are some infos what have been added");
        console.info("Accounts Users collection size is " + Meteor.users.find().fetch().length);
        console.info("Customs Users collection size is " + Users.find().fetch().length);
        console.info("Tasks collection size is " + Tasks.find().fetch().length);
        console.info("Assignments collection size is " + Assignments.find().fetch().length);
        console.info("Groups collection size is " + Groups.find().fetch().length);
        console.info("Skills collection size is " + Skills.find().fetch().length);
        console.info("Teams collection size is " + Teams.find().fetch().length);
        console.info("Places collection size is " + Places.find().fetch().length);
        console.info("AssignmentTerms collection size is " + AssignmentTerms.find().fetch().length);
        console.info("GroupRoles collection size is " + GroupRoles.find().fetch().length);
    }

    /**
     * @summmary delete all data
     */
    static deleteAll() {
        Meteor.roles.remove({});
        GroupRoles.direct.remove({});
        Meteor.users.remove({});

        Users.direct.remove({});

        Assignments.direct.remove({});
        Tasks.remove({});
        Places.remove({});
        Teams.remove({});
        Groups.remove({});
        Skills.remove({});
        Teams.remove({});
        EquipmentCategories.remove({});
        Equipments.remove({});
        WaterSupplies.remove({});
        WaterDisposals.remove({});
        PowerSupplies.remove({});
        EquipmentStorages.remove({});

        AssignmentTerms.remove({});

    }

    static _injectRoles() {
        var superadminRoles = [];
        _.each(RolesEnum, function (role) {
            Roles.createRole(role);
            superadminRoles.push(role);
        });
        return superadminRoles;
    }

    static _injectGroupRoles() {
        var bureau = GroupRoles.insert({
            name: "bureau",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.USERREAD, RolesEnum.USERWRITE, RolesEnum.USERDELETE, RolesEnum.TASKREAD, RolesEnum.TASKWRITE, RolesEnum.TASKDELETE, RolesEnum.ROLE]
        });
        var hard = GroupRoles.insert({
            name: "hard",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.USERREAD, RolesEnum.TASKREAD, RolesEnum.TASKWRITE]
        });
        var soft = GroupRoles.insert({
            name: "soft",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.TASKREAD]
        });
        var respLog = GroupRoles.insert({
            name: "respLog",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.CONFMAKER]
        });
        var respSecu = GroupRoles.insert({
            name: "respSecu",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.ACCESSPASSVALIDATION, RolesEnum.CONFMAKER]
        });
        var humain = GroupRoles.insert({
            name: "humain",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.ACCESSPASSVALIDATION, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.ASSIGNMENTVALIDATION, RolesEnum.CONFMAKER, RolesEnum.ASSIGNMENTTASKUSER]
        });
        var allUser = GroupRoles.insert({
            name: "allUser",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.USERREAD, RolesEnum.USERWRITE, RolesEnum.USERDELETE, RolesEnum.ROLE]
        });
        var allTask = GroupRoles.insert({
            name: "allTask",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.TASKREAD, RolesEnum.TASKWRITE, RolesEnum.TASKDELETE, RolesEnum.ACCESSPASSVALIDATION, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.ASSIGNMENTVALIDATION]
        });
        var allConf = GroupRoles.insert({
            name: "allConf",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.CONFMAKER]
        });
        var minimal = GroupRoles.insert({
            name: "minimal",
            roles: [RolesEnum.MANIFMAKER]
        });
        return {
            bureau: bureau,
            hard: hard,
            soft: soft,
            respLog: respLog,
            respSecu: respSecu,
            humain: humain
        };
    }

    /**
     * @summary Initialize Roles and superadmin profil
     */
    static initAccessRightData() {
        if(Users.findOne({name:SUPERADMIN})){
            return;
        }
        console.info(SUPERADMIN+" user not found, now injecting roles and superadmin user");

        //create roles
        console.info("inject Roles");
        var superadminRoles = this._injectRoles();

        var superAdmin = GroupRoles.insert({
            name: "superadmin",
            roles: superadminRoles
        });

        this.createAccountAndUser(SUPERADMIN, "superadmin@yopmail.com", "superadmin", superAdmin);
    }

    static injectGroupRoles(){
        //create groups and add roles to groups
        console.info("inject GroupRoles");
        var groupRoles = this._injectGroupRoles();
        return groupRoles;
    }

    static injectUsers(groupRoles){
        console.info("inject log in account");
        this.createAccountAndUser("hard", "hard@yopmail.com", "hard", groupRoles.hard);
        this.createAccountAndUser("bureau", "bureau@yopmail.com", "bureau", groupRoles.bureau);
        this.createAccountAndUser("resplog", "resplog@yopmail.com", "resplog", groupRoles.respLog);
        this.createAccountAndUser("respsecu", "respsecu@yopmail.com", "respsecu", groupRoles.respSecu);
        this.createAccountAndUser("humain", "humain@yopmail.com", "humain", groupRoles.humain);
        this.createAccountAndUser("soft", "soft@yopmail.com", "soft", groupRoles.soft);
    }



    /**
     * @summary inject test data
     * @description
     *
     *   -  conf
     *   - 3 tasks
     *   - 3 users with some availabilities
     */
    static populateData() {

        //teams
        console.info("inject Teams");
        var team1Id = Teams.insert({name: "team1"});
        var team2Id = Teams.insert({name: "team2"});
        var team3Id = Teams.insert({name: "team3"});


        //places
        console.info("inject Places");
        var place1Id = Places.insert({name: "place1"});
        var place2Id = Places.insert({name: "place2"});
        var place3Id = Places.insert({name: "place3"});


        //equipment categories
        console.info("inject EquipmentCategories");
        var equipmentCategory1 = EquipmentCategories.insert({name: "category1"});
        var equipmentCategory2 = EquipmentCategories.insert({name: "category2"});
        var equipmentCategory3 = EquipmentCategories.insert({name: "category3"});

        //equipment
        console.info("inject Equipments");
        var equipment11 = Equipments.insert({
            name: "equipment11",
            quantity: 10,
            targetUsage: EquipementTargetUsage.ACTIVITY,
            EquipmentCategories_Id: equipmentCategory1
        });
        var equipment12 = Equipments.insert({
            name: "equipment12",
            quantity: 10,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: equipmentCategory1
        });
        var equipment13 = Equipments.insert({
            name: "equipment13",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory1
        });
        var equipment21 = Equipments.insert({
            name: "equipment21",
            quantity: 10,
            targetUsage: EquipementTargetUsage.ACTIVITY,
            EquipmentCategories_Id: equipmentCategory2
        });
        var equipment22 = Equipments.insert({
            name: "equipment22",
            quantity: 10,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: equipmentCategory2
        });
        var equipment23 = Equipments.insert({
            name: "equipment23",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory2
        });
        var equipment24 = Equipments.insert({
            name: "equipment24",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory2
        });
        var equipment25 = Equipments.insert({
            name: "equipment25",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory2
        });
        var equipment26 = Equipments.insert({
            name: "equipment26",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory2
        });

        var equipment31 = Equipments.insert({
            name: "equipment31",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory3
        });
        var equipment32 = Equipments.insert({
            name: "equipment32",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory3
        });
        var equipment33 = Equipments.insert({
            name: "equipment33",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory3
        });
        var equipment34 = Equipments.insert({
            name: "equipment34",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory3
        });
        var equipment35 = Equipments.insert({
            name: "equipment35",
            quantity: 10,
            targetUsage: EquipementTargetUsage.BOTH,
            EquipmentCategories_Id: equipmentCategory3
        });

        //storage
        console.info("inject EquipmentStorages");
        var equipmentStorage1 = EquipmentStorages.insert({name: "equipmentStorage1"});
        var equipmentStorage2 = EquipmentStorages.insert({name: "equipmentStorage2"});

        //power supply
        console.info("inject PowerSupplies");
        var powerSupply1 = PowerSupplies.insert({name: "powerSupply1"});
        var powerSupply2 = PowerSupplies.insert({name: "powerSupply2"});

        //skills
        console.info("inject Skills");
        var skill1Id = Skills.insert({
            key: "RESP_TASK_1",
            label: "Responsable tache 1"
        });
        var skill2Id = Skills.insert({
            key: "RESP_TASK_2",
            label: "Responsable tache 2"
        });
        var skill3Id = Skills.insert({
            key: "RESP_TASK_3",
            label: "Responsable tache 3"
        });
        var skill4Id = Skills.insert({
            key: "RESP_TASK_4",
            label: "Responsable tache 4"
        });

        //users
        console.info("inject Users");
        var softGroupRoleId = GroupRoles.findOne({name: "soft"})._id;
        var user1Id = this.createAccountAndUser("user1", "user1@yopmail.com", "user1", softGroupRoleId);
        var user2Id = this.createAccountAndUser("user2", "user2@yopmail.com", "user2", softGroupRoleId);
        var user3Id = this.createAccountAndUser("user3", "user3@yopmail.com", "user3", softGroupRoleId);
        var user4Id = this.createAccountAndUser("user4", "user4@yopmail.com", "user4", softGroupRoleId);
        Users.update(user1Id, {
            $set: {
                teams: [team1Id],
                skills: [skill1Id],
                availabilities: [
                    {
                        start: this._getDateFromTime(2),
                        end: this._getDateFromTime(14)
                    }
                ]
            }
        });
        Users.update(user2Id, {
            $set: {
                teams: [team2Id, team3Id],
                skills: [skill2Id],
                availabilities: [
                    {
                        start: this._getDateFromTime(2),
                        end: this._getDateFromTime(16)
                    }
                ]
            }
        });
        Users.update(user3Id, {
            $set: {
                //teams: [team3Id],
                skills: [skill2Id, skill3Id],
                availabilities: [
                    {
                        start: this._getDateFromTime(10),
                        end: this._getDateFromTime(14)
                    },
                    {
                        start: this._getDateFromTime(14),
                        end: this._getDateFromTime(18)
                    }
                ]
            }
        });
        Users.update(user4Id, {
            $set: {
                //teams: [team3Id],
                skills: [skill2Id, skill3Id, skill1Id, skill4Id],
                availabilities: [
                    {
                        start: this._getDateFromTime(10),
                        end: this._getDateFromTime(14)
                    },
                    {
                        start: this._getDateFromTime(14),
                        end: this._getDateFromTime(18)
                    }
                ]
            }
        });

        //assignmentCalendarDay
        console.info("inject AssignmentTerms");
        AssignmentTerms.insert({
            name: "Terms 1",
            start: this._getDateFromDate(13, 5 - 1),
            end: this._getDateFromDate(15, 5 - 1)
        });
        AssignmentTerms.insert({
            name: "Terms 2",
            start: this._getDateFromDate(10, 5 - 1),
            end: this._getDateFromDate(11, 5 - 1)
        });
        AssignmentTerms.insert({
            name: "Terms 3",
            start: this._getDateFromDate(15, 5 - 1),
            end: this._getDateFromDate(27, 5 - 1)
        });

        console.info("inject Tasks");
        var now = new Date();
        var aDayAgo = new moment().add("days", -1).toDate();
        //tasks
        var task1d = Tasks.insert({
            name: "task 1",
            teamId: team1Id,
            placeId: place1Id,
            liveEventMasterId: user1Id,
            masterId: user1Id,
            timeSlots: [
                {
                    start: this._getDateFromTime(2),
                    end: this._getDateFromTime(4),
                    peopleNeeded: [
                        {
                            teamId: team1Id
                        }
                    ],
                },
                {
                    start: this._getDateFromTime(10),
                    end: this._getDateFromTime(14),
                    peopleNeeded: [
                        {
                            userId: user2Id
                        },
                        {
                            userId: user4Id
                        },
                        {
                            userId: user1Id
                        },
                        {
                            teamId: team1Id,
                            skills: [skill1Id]
                        },
                        {
                            teamId: team1Id,
                            skills: [skill1Id]
                        },
                        {
                            teamId: team1Id,
                            skills: [skill1Id]
                        },
                        {
                            skills: [skill1Id]
                        },
                        {
                            skills: [skill1Id, skill2Id]
                        },
                        {
                            skills: [skill1Id, skill2Id]
                        },
                        {
                            skills: [skill1Id, skill2Id]
                        }
                    ],
                }
            ],
            timeSlotValidation: {
                currentState: ValidationState.READY,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "good",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            },
            accessPassValidation: {
                currentState: ValidationState.READY,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "good",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            },
            equipmentValidation: {
                currentState: ValidationState.OPEN,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "good",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            },
        });
        this._updateTaskEquipmentQuantity(task1d, equipment11, 11);
        this._updateTaskEquipmentQuantity(task1d, equipment12, 12);
        this._updateTaskEquipmentQuantity(task1d, equipment21, 21);
        Tasks.update(task1d, {$set: {"equipmentValidation.currentState": ValidationState.READY}})

        var task2d = Tasks.insert({
            name: "task 2",
            teamId: team2Id,
            placeId: place2Id,
            liveEventMasterId: user2Id,
            masterId: user2Id,
            timeSlots: [
                {
                    start: this._getDateFromTime(10),
                    end: this._getDateFromTime(12),
                    peopleNeeded: [
                        {
                            teamId: team2Id,
                            skills: [skill2Id]
                        }
                    ]
                }
            ],
            timeSlotValidation: {
                currentState: ValidationState.REFUSED,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "Dumbass, do you're fucking grammar",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            },
            accessPassValidation: {
                currentState: ValidationState.REFUSED,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "Dumbass, do you're fucking grammar",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            },
            equipmentValidation: {
                currentState: ValidationState.REFUSED,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "Dumbass, do you're fucking grammar",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            }
        });
        var task3d = Tasks.insert({
            name: "task 3",
            teamId: team3Id,
            placeId: place2Id,
            liveEventMasterId: user2Id,
            masterId: user2Id,
            timeSlots: [
                {
                    start: this._getDateFromTime(10),
                    end: this._getDateFromTime(12),
                    peopleNeeded: [
                        {
                            teamId: team1Id,
                            skills: [skill1Id]
                        }
                    ]
                }
            ],
            timeSlotValidation: {
                currentState: ValidationState.TOBEVALIDATED,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "send in validation",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            },
            accessPassValidation: {
                currentState: ValidationState.TOBEVALIDATED,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "send in validation",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            },
            equipmentValidation: {
                currentState: ValidationState.TOBEVALIDATED,
                lastUpdateDate: now,
                comments: [
                    {
                        author: "Gerard",
                        content: "send in validation",
                        creationDate: now,
                        stateBefore: ValidationState.OPEN,
                        stateAfter: ValidationState.OPEN,
                    }
                ]
            }
        });
        var task3d = Tasks.insert({
            name: "autre tache",
            teamId: team3Id,
            placeId: place2Id,
            liveEventMasterId: user2Id,
            masterId: user2Id,
            timeSlots: [
                {
                    start: this._getDateFromTime(10),
                    end: this._getDateFromTime(12),
                    peopleNeeded: [
                        {
                            teamId: team1Id,
                            skills: [skill1Id]
                        }
                    ]
                }
            ],
            timeSlotValidation: {
                currentState: ValidationState.OPEN,
                lastUpdateDate: now,
                comments: []
            },
            accessPassValidation: {
                currentState: ValidationState.OPEN,
                lastUpdateDate: now,
                comments: []
            },
            equipmentValidation: {
                currentState: ValidationState.OPEN,
                lastUpdateDate: now,
                comments: []
            }

        });
    };

    /**
     * @summary insert a User and an Account
     * @param username {String} unique
     * @param email {emailformat} unique
     * @param password
     * @param groupRoleId {MongoId|Array<MongoId>} group role to add (at least one is needed)
     * @returns {*}
     */
    static createAccountAndUser(username, email, password, groupRoleId) {
        Accounts.createUser({
            username: username,
            email: email,
            password: password
        });
        var _id = Users.insert({
            name: username,
            loginUserId: Meteor.users.findOne({username: username})._id
        });

        this._setGroupRolesToUsers(_id, groupRoleId);

        return _id;
    }

    static _setGroupRolesToUsers(userId, groupId) {
        if(!groupId) return;
        var groupArray;
        if (Array.isArray(groupId))
            groupArray = groupId
        else
            groupArray = [groupId];

        Users.update(userId, {
            $set: {
                groupRoles: groupArray
            }
        });
    }

    static _insertAndFetch(Collection, data) {
        var _id = Collection.insert(data);
        return Collection.findOne({_id: _id});
    }

    static _getDateFromTime(hours, minutes = 0) {
        var now = new Date();
        return new Date(now.getYear(), 5 - 1 /*now.getMonth()*/, 13 /*now.getDate()*/, hours, minutes, 0);
    }

    static _getDateFromDate(day, month, year) {
        var now = new Date();
        year = year || now.getYear();
        month = month || now.getMonth();
        return new Date(year, month, day, 0, 0, 0);
    }

    static _updateTaskEquipmentQuantity(taskId, equipmentId, quantity) {
        Tasks.update({_id: taskId, "equipments.equipmentId": equipmentId}, {
            $set: {
                "equipments.$.quantity": quantity
            }
        });
    }
}