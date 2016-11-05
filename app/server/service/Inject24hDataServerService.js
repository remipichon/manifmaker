import {ServerService} from "./ServerService";
import {SecurityServiceServer} from "./SecurityServiceServer";
import {ServerUserService} from "./ServerUserService";
import {InjectDataHelperServerService} from "./InjectDataHelperServerService";

/** @class InjectDataServerService */
export class Inject24hDataServerService {

    /**
     * @summary perform deleteAll, initAccessRightData and populateData
     */
    injectAllData() {
        SecurityServiceServer.isItProd("Inject24hDataServerService.injectAllData");

        Settings.insert({one: 1})
        console.info("inject data starts");
        this._injectGroupRoles();
        Settings.update(Settings.findOne()._id, {
            $set: {defaultGroupRoles: GroupRoles.findOne({name: "soft"})._id}
        });
        console.info("injectGroupRoles done");
        this._injectAuthenticationUsers();
        console.info("injectUsers done");
        this.populateData();
        this.addSettings();
        console.info("addSettings done");


        console.info("**** Data init success ****");
        console.info("Here are some infos what have been added");
        console.info("Accounts Meteor.users collection size is " + Meteor.users.find().fetch().length);
        console.info("Customs Meteor.users collection size is " + Meteor.users.find().fetch().length);
        console.info("Tasks collection size is " + Tasks.find().fetch().length);
        console.info("Assignments collection size is " + Assignments.find().fetch().length);
        console.info("Task Groups collection size is " + TaskGroups.find().fetch().length);
        console.info("Skills collection size is " + Skills.find().fetch().length);
        console.info("Teams collection size is " + Teams.find().fetch().length);
        console.info("Places collection size is " + Places.find().fetch().length);
        console.info("AssignmentTerms collection size is " + AssignmentTerms.find().fetch().length);
        console.info("GroupRoles collection size is " + GroupRoles.find().fetch().length);
    }

    addSettings() {
        Settings.update(Settings.findOne()._id, {
            $set: {createAccountDefaultTeam: Teams.findOne({name: "soft"})._id}
        })

    }

    _injectGroupRoles() {
        this.bureauGroupRole = GroupRoles.insert({
            name: "bureau",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.USERREAD, RolesEnum.USERWRITE, RolesEnum.USERDELETE, RolesEnum.TASKREAD, RolesEnum.TASKWRITE, RolesEnum.TASKDELETE, RolesEnum.ROLE]
        });
        this.hardGroupRole = GroupRoles.insert({
            name: "hard",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.USERREAD, RolesEnum.TASKREAD, RolesEnum.TASKWRITE]
        });
        this.softGroupRole = GroupRoles.insert({
            name: "soft",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.TASKREAD]
        });
        this.respLogGroupRole = GroupRoles.insert({
            name: "respLog",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.CONFMAKER]
        });
        this.respSecuGroupRole = GroupRoles.insert({
            name: "respSecu",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.ACCESSPASSVALIDATION, RolesEnum.CONFMAKER]
        });
        this.humainGroupRole = GroupRoles.insert({
            name: "humain",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.ACCESSPASSVALIDATION, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.ASSIGNMENTVALIDATION, RolesEnum.CONFMAKER, RolesEnum.ASSIGNMENTTASKUSER]
        });
        this.allUserGroupRole = GroupRoles.insert({
            name: "allUser",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.USERREAD, RolesEnum.USERWRITE, RolesEnum.USERDELETE, RolesEnum.ROLE]
        });
        this.allTaskGroupRole = GroupRoles.insert({
            name: "allTask",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.TASKREAD, RolesEnum.TASKWRITE, RolesEnum.TASKDELETE, RolesEnum.ACCESSPASSVALIDATION, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.ASSIGNMENTVALIDATION]
        });
        this.allConfGroupRole = GroupRoles.insert({
            name: "allConf",
            roles: [RolesEnum.MANIFMAKER, RolesEnum.CONFMAKER]
        });
        this.minimalGroupRole = GroupRoles.insert({
            name: "minimal",
            roles: [RolesEnum.MANIFMAKER]
        });
    }

    _injectAuthenticationUsers() {
        console.info("inject user");
        InjectDataHelperServerService.createAccountAndUser("hard", "hard@yopmail.com", "hard", this.hardGroupRole);
        InjectDataHelperServerService.createAccountAndUser("hard2", "hard2@yopmail.com", "hard2", this.hardGroupRole);
        InjectDataHelperServerService.createAccountAndUser("hard3", "hard3@yopmail.com", "hard3", this.hardGroupRole);
        InjectDataHelperServerService.createAccountAndUser("bureau", "bureau@yopmail.com", "bureau", this.bureauGroupRole);
        InjectDataHelperServerService.createAccountAndUser("resplog", "resplog@yopmail.com", "resplog", this.respLogGroupRole);
        InjectDataHelperServerService.createAccountAndUser("respsecu", "respsecu@yopmail.com", "respsecu", this.respSecuGroupRole);
        InjectDataHelperServerService.createAccountAndUser("humain", "humain@yopmail.com", "humain", this.humainGroupRole);
        InjectDataHelperServerService.createAccountAndUser("soft", "soft@yopmail.com", "soft", this.softGroupRole);
    }

    populateData() {
        this._populateTeams();
        this._populatePlaces();
        this._populateEquipmentCategories();
        this._populateEquipment();
        this._populateStorage();
        this._populatePowerSupply();
        this._populateSkill();
        this._populateTaskGroups();
        this._populateAssignmentTerms();
        this._populateUser();
        this._populateTasks();

    }

    _populateTeams() {
        //teams
        console.info("inject Teams");
        this.hardTeam = Teams.insert({name: "hard"});
        this.confianceTeam = Teams.insert({name: "confiance"});
        this.softTeam = Teams.insert({name: "soft"});

        this.pedaleTeam = Teams.insert({name: "pedale"});
        this.orgaBouffeTeam = Teams.insert({name: "orga bouffe"});
        this.communicationTeam = Teams.insert({name: "communication"});
        this.orgaBarTeam = Teams.insert({name: "orga bar"});
        this.orgaBariereTeam = Teams.insert({name: "orga bar"});
    }

    _populatePlaces() {

        //places
        console.info("inject Places");
        this.qgPlace = Places.insert({name: "QG Orga"});
        this.bocalPlace = Places.insert({name: "Bocal"});
        this.humaPlace = Places.insert({name: "Pelouse Humas"});
        this.petiteScenePlace = Places.insert({name: "Petite scene"});
        this.grandeScenePlace = Places.insert({name: "Grande scene"});
        this.footPlace = Places.insert({name: "Terrain de foot"});
    }

    _populateEquipmentCategories() {
        //equipment categories
        console.info("inject EquipmentCategories");
        this.barriereEquipmentCategory = EquipmentCategories.insert({name: "barrière"});
        this.attacheEquipmentCategory = EquipmentCategories.insert({name: "attache"});
        this.vehiculeEquipmentCategory = EquipmentCategories.insert({name: "véhicule"});
    }

    _populateEquipment() {
        //equipment
        console.info("inject Equipments");
        this.vauban = Equipments.insert({
            name: "vauban",
            quantity: 1000,
            targetUsage: EquipementTargetUsage.ACTIVITY,
            EquipmentCategories_Id: this.barriereEquipmentCategory
        });
        this.MI = Equipments.insert({
            name: "MI",
            quantity: 200,
            targetUsage: EquipementTargetUsage.ACTIVITY,
            EquipmentCategories_Id: this.barriereEquipmentCategory
        });
        this.herras = Equipments.insert({
            name: "herras",
            quantity: 400,
            targetUsage: EquipementTargetUsage.ACTIVITY,
            EquipmentCategories_Id: this.barriereEquipmentCategory
        });
        this.plotHerras = Equipments.insert({
            name: "plot herras",
            quantity: 10,
            targetUsage: EquipementTargetUsage.ACTIVITY,
            EquipmentCategories_Id: this.barriereEquipmentCategory
        });
        this.colson = Equipments.insert({
            name: "colson",
            quantity: 10000,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: this.attacheEquipmentCategory
        });
        this.scotch = Equipments.insert({
            name: "scotch",
            quantity: 20,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: this.attacheEquipmentCategory
        });
        var equipment24 = Equipments.insert({
            name: "20m3",
            quantity: 10,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: this.attacheEquipmentCategory
        });
        this.dixCube = Equipments.insert({
            name: "10m3",
            quantity: 1,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: this.vehiculeEquipmentCategory
        });
        this.sixCube = Equipments.insert({
            name: "6m3",
            quantity: 1,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: this.vehiculeEquipmentCategory
        });
        this.fenwirk = Equipments.insert({
            name: "fenwick",
            quantity: 2,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: this.vehiculeEquipmentCategory
        });
        this.voitureQuentin = Equipments.insert({
            name: "Voiture Quentin",
            quantity: 1,
            targetUsage: EquipementTargetUsage.TASK,
            EquipmentCategories_Id: this.vehiculeEquipmentCategory
        });
    }

    _populateStorage() {

        //storage
        console.info("inject EquipmentStorages");
        this.humasStorage = EquipmentStorages.insert({name: "Depot humas"});
        this.AIPStorage = EquipmentStorages.insert({name: "Depot AIP"});
        this.creuxStorage = EquipmentStorages.insert({name: "Creux GCU"});
    }

    _populatePowerSupply() {
        //power supply
        console.info("inject PowerSupplies");
        this.AIPPowerSupply = PowerSupplies.insert({name: "AIP"});
        var GCUPowerSupply = PowerSupplies.insert({name: "GCU"});

    }

    _populateSkill() {
        //skills
        console.info("inject Skills");
        this.respBarSkill = Skills.insert({
            key: "RESP_BAR",
            label: "Responsable Bar",
            teams: [this.hardTeam]
        });
        this.respAnimSkill = Skills.insert({
            key: "RESP_ANIM",
            label: "Responsable Anim",
            teams: [this.hardTeam]
        });
        this.respSportSkill = Skills.insert({
            key: "RESP_SPORT",
            label: "Responsable Sport",
            teams: [this.hardTeam]
        });
        this.respSecuSkill = Skills.insert({
            key: "RESP_SECU",
            label: "Responsable Secu",
            teams: [this.hardTeam]
        });
        this.conducteurSkill = Skills.insert({
            key: "CONDUCTEUR",
            label: "+2ans de permis et +21ans",
            teams: [this.softTeam, this.hardTeam]
        });
        this.conducteurFenSkill = Skills.insert({
            key: "CONDUCTEUR_FEN",
            label: "Permis cariste pour le fen",
            teams: [this.hardTeam]
        });
    }

    _populateTaskGroups() {
        //task groups
        this.collageTaskGroup = TaskGroups.insert({name: "Collage", teamId: this.communicationTeam});
        this.barBouffeTaskGroup = TaskGroups.insert({name: "Bar bouffe", teamId: this.orgaBouffeTeam});
    }

    _populateAssignmentTerms() {
        //assignmentCalendarDay
        console.info("inject AssignmentTerms");
        AssignmentTerms.insert({
            name: "Collage",
            start: InjectDataHelperServerService.getDateFromDateAndHourMinute(2016, 4, 17, 0, 0),
            end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 30, 0, 0),
            teams: [this.hardTeam],
            assignmentTermPeriods: [
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 17, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 17, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 18, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 18, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 19, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 19, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 20, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 20, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 21, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 21, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 22, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 22, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 23, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 23, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 24, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 24, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 25, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 25, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 26, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 26, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 27, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 27, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 28, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 28, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 29, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 29, 8, 0),
                },

            ],
            calendarAccuracy: 1
        });
        AssignmentTerms.insert({
            name: "Premanif",
            start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 13, 0, 0),
            end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 19, 18, 0),
            teams: [this.softTeam, this.confianceTeam, this.hardTeam],
            addAvailabilitiesDeadline: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 7, 0, 0),
            calendarAccuracy: 2,
        });
        AssignmentTerms.insert({
            name: "Manif",
            start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 19, 18, 0),
            end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 22, 0, 0),
            teams: [this.softTeam, this.confianceTeam, this.hardTeam],
            addAvailabilitiesDeadline: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 12, 0, 0),
            calendarAccuracy: 2

        });
        AssignmentTerms.insert({
            name: "Postmanif",
            start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 22, 0, 0),
            end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 26, 0, 0),
            teams: [this.softTeam, this.confianceTeam, this.hardTeam],
            calendarAccuracy: 2,
            addAvailabilitiesDeadline: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 19, 0, 0),
        });

    }

    _populateUser() {
        //users
        console.info("inject Meteor.users");
        var softGroupRoleId = GroupRoles.findOne({name: "soft"})._id;
        this.soft1 = InjectDataHelperServerService.createAccountAndUser("soft1", "soft1@yopmail.com", "soft1", softGroupRoleId);
        this.soft2 = InjectDataHelperServerService.createAccountAndUser("soft2", "soft2@yopmail.com", "soft2", softGroupRoleId);
        this.soft3 = InjectDataHelperServerService.createAccountAndUser("soft3", "soft3@yopmail.com", "soft3", softGroupRoleId);
        this.soft4 = InjectDataHelperServerService.createAccountAndUser("soft4", "soft4@yopmail.com", "soft4", softGroupRoleId);

        InjectDataHelperServerService.setTeamsAndSkills(this.soft1, [this.softTeam], null);
        Meteor.users.update(this.soft1, {
            $set: {
                availabilities: [
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 20, 2, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 20, 14, 0),
                    }
                ],
                isReadyForAssignment: true
            }
        });
        InjectDataHelperServerService.setTeamsAndSkills(this.soft2, [this.softTeam]);
        Meteor.users.update(this.soft2, {
            $set: {
                availabilities: [
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 21, 2, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 21, 16, 0)
                    }
                ]
            }
        });
        this.hardId = Meteor.users.findOne({username: "hard"})._id
        InjectDataHelperServerService.setTeamsAndSkills(this.hardId, [this.hardTeam], [this.conducteurSkill]);
        Meteor.users.update(this.hardId, {
            $set: {
                availabilities: [
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 19, 18, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 5, 21, 22, 0)
                    },
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 17, 6, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 17, 8, 0)
                    },
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 18, 6, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 18, 8, 0)
                    }
                ]
            }
        });

    }

    _populateTasks() {
        console.info("inject Tasks");
        var now = new Date();
        //tasks
        this.collageParcour1 = Tasks.insert({
            name: "Collage parcours 1",
            teamId: this.communicationTeam,
            liveEventMasterId: this.hardId,
            groupId: this.collageTaskGroup,
            placeId: this.bocalPlace,
            masterId: this.hardId,
            timeSlots: [
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 17, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 17, 8, 0),
                    peopleNeeded: [
                        {
                            teamId: this.hardTeam
                        },
                        {
                            skills: [this.conducteurSkill]
                        }
                    ],
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 18, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016, 4, 18, 8, 0),
                    peopleNeeded: [
                        {
                            teamId: this.hardTeam
                        },
                        {
                            teamId: this.hardTeam,
                            skills: [this.conducteurSkill]
                        }
                    ],
                },
            ]
        });
        InjectDataHelperServerService.updateTaskEquipmentQuantity(this.collageParcour1, this.voitureQuentin, 1);
        Tasks.update(this.collageParcour1, {$set: {"equipmentValidation.currentState": ValidationState.READY}})

        this.barrierage = Tasks.insert({
            name: "Barrerage",
            teamId: this.pedaleTeam,
            placeId: this.humaPlace,
            liveEventMasterId: this.hardId,
            masterId: this.hardId,
            timeSlots: [
                {
                    start: InjectDataHelperServerService.getDateFromDateAndHourMinute(2016,5,15, 9,0),
                    end: InjectDataHelperServerService.getDateFromDateAndHourMinute(2016,5,15, 12,0),
                    peopleNeeded: [
                        {
                            teamId: this.orgaBariereTeam
                        },
                        {
                            skills: [this.conducteurFenSkill]
                        },
                        {
                            teamId: this.softTeam
                        }
                        ,
                        {
                            teamId: this.softTeam
                        }
                        ,
                        {
                            teamId: this.softTeam
                        },
                        {
                            teamId: this.softTeam
                        }
                    ]
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016,5,15, 14,0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2016,5,15, 18,0),
                    peopleNeeded: [
                        {
                            teamId: this.orgaBariereTeam
                        },
                        {
                            skills: [this.conducteurFenSkill]
                        },
                        {
                            teamId: this.softTeam
                        }
                        ,
                        {
                            teamId: this.softTeam
                        }
                        ,
                        {
                            teamId: this.softTeam
                        },
                        {
                            teamId: this.softTeam
                        }
                    ]
                }
            ]
        });
        //var task3d = Tasks.insert({
        //    name: "task 3",
        //    teamId: team3Id,
        //    placeId: place2Id,
        //    liveEventMasterId: user2Id,
        //    masterId: user2Id,
        //    timeSlots: [
        //        {
        //            start: this. getDateFromDateAndHourMinute(2016,5,13, 10,0),
        //            end: this. getDateFromDateAndHourMinute(2016,5,13, 12,0),
        //            peopleNeeded: [
        //                {
        //                    teamId: team1Id,
        //                    skills: [skill1Id]
        //                }
        //            ]
        //        }
        //    ],
        //    timeSlotValidation: {
        //        currentState: ValidationState.TOBEVALIDATED,
        //        lastUpdateDate: now,
        //        comments: [
        //            {
        //                author: "Gerard",
        //                content: "send in validation",
        //                creationDate: now,
        //                stateBefore: ValidationState.OPEN,
        //                stateAfter: ValidationState.OPEN,
        //            }
        //        ]
        //    },
        //    accessPassValidation: {
        //        currentState: ValidationState.TOBEVALIDATED,
        //        lastUpdateDate: now,
        //        comments: [
        //            {
        //                author: "Gerard",
        //                content: "send in validation",
        //                creationDate: now,
        //                stateBefore: ValidationState.OPEN,
        //                stateAfter: ValidationState.OPEN,
        //            }
        //        ]
        //    },
        //    equipmentValidation: {
        //        currentState: ValidationState.TOBEVALIDATED,
        //        lastUpdateDate: now,
        //        comments: [
        //            {
        //                author: "Gerard",
        //                content: "send in validation",
        //                creationDate: now,
        //                stateBefore: ValidationState.OPEN,
        //                stateAfter: ValidationState.OPEN,
        //            }
        //        ]
        //    }
        //});
        //var task3d = Tasks.insert({
        //    name: "autre tache",
        //    teamId: team3Id,
        //    placeId: place2Id,
        //    liveEventMasterId: user2Id,
        //    masterId: user2Id,
        //    taskGroupId : taskGroup1,
        //    timeSlots: [
        //        {
        //            start: this. getDateFromDateAndHourMinute(2016,5,13, 8,0),
        //            end: this. getDateFromDateAndHourMinute(2016,5,13, 10,0),
        //            peopleNeeded: [
        //                {
        //                    teamId: team1Id,
        //                    skills: [skill1Id]
        //                }
        //            ]
        //        },
        //        {
        //            start: this. getDateFromDateAndHourMinute(2016,5,14, 6,0),
        //            end: this. getDateFromDateAndHourMinute(2016,5,14, 10,0),
        //            peopleNeeded: [
        //                {
        //                    skills: [skill1Id]
        //                }
        //            ]
        //        },
        //        {
        //            start: this. getDateFromDateAndHourMinute(2016,3,16, 22,0),
        //            end: this. getDateFromDateAndHourMinute(2016,3,19, 2,0),
        //            peopleNeeded: [
        //                {
        //                    skills: [skill1Id]
        //                }
        //            ]
        //        }
        //    ],
        //    timeSlotValidation: {
        //        currentState: ValidationState.READY,
        //        lastUpdateDate: now,
        //        comments: []
        //    },
        //    accessPassValidation: {
        //        currentState: ValidationState.OPEN,
        //        lastUpdateDate: now,
        //        comments: []
        //    },
        //    equipmentValidation: {
        //        currentState: ValidationState.OPEN,
        //        lastUpdateDate: now,
        //        comments: []
        //    }
        //
        //});
    }

}