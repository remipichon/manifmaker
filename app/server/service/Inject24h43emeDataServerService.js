import {ServerService} from "./ServerService";
import {SecurityServiceServer} from "./SecurityServiceServer";
import {ServerUserService} from "./ServerUserService";
import {InjectDataHelperServerService} from "./InjectDataHelperServerService";

/** @class Inject24h43emeDataServerService */
export class Inject24h43emeDataServerService {

    injectConfMakerData(){
        this._populateTeams();
        this._populatePlaces();
        this._populateEquipmentCategories();
        this._populateEquipment();
        this._populateStorage();
        this._populatePowerSupply();
        this._populateWaterSupply();
        this._populateWaterDisposal();
        this._populateSkill();
        this._populateAssignmentTerms();
        this._populateAccessPoint();
        this.addSettings();
    }


    addSettings() {
        Settings.insert({one: 1})
        Settings.update(Settings.findOne()._id, {
            $set: {createAccountDefaultTeam: Teams.findOne({name: "hard"})._id}
        });
        Settings.update(Settings.findOne()._id, {
            $set: {
                defaultActivityMapsLatLng: {
                    lat: 45.783642,
                    lng: 4.872970
                }
            }
        });
    }

    _injectAuthenticationUsers() {
        console.info("inject user");
        InjectDataHelperServerService.createAccountAndUser("test_orga_hard", "test_orga_hard@yopmail.com", "test_orga_hard", this.hardGroupRole);
    }

    populateTestData() {
        this._injectAuthenticationUsers();
        this._populateTaskGroups();
        this._populateUser();
        this._populateActivities();
        this._populateTasks();
    }

    _populateTeams() {
        //teams
        console.info("inject Teams");
        this.hardTeam = Teams.insert({name: "hard"});
        this.confianceTeam = Teams.insert({name: "confiance"});
        this.softTeam = Teams.insert({name: "soft"});

        this.pedaleTeam = Teams.insert({name: "pédale"});
        this.communicationTeam = Teams.insert({name: "communication"});
        this.sportTeam = Teams.insert({name: "sport"});
        this.animTeam = Teams.insert({name: "animation"});
    }

    _populatePlaces() {
        //places
        console.info("inject Places");
        this.qgPlace = Places.insert({name: "QG Orga"});
        this.bocalPlace = Places.insert({name: "Bocal"});
        this.humaPlace = Places.insert({name: "Pelouse Humas"});
        this.petiteScenePlace = Places.insert({name: "Petite scene"});
        this.grandeScenePlace = Places.insert({name: "Grande scene"});
    }

    _populateEquipmentCategories() {
        //equipment categories
        console.info("inject EquipmentCategories");
        this.barriereEquipmentCategory = EquipmentCategories.insert({name: "barrière"});
        this.attacheEquipmentCategory = EquipmentCategories.insert({name: "attache"});
        this.vehiculeEquipmentCategory = EquipmentCategories.insert({name: "véhicule"});
        this.elecEquipmentCategory = EquipmentCategories.insert({name: "élec", extraComputeRule: "SUM"});
    }

    _populateEquipment() {
        //equipment
        console.info("inject Equipments");
        this.vauban = Equipments.insert({
            name: "vauban",
            quantity: 1500,
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
        this.grandFrigo = Equipments.insert({
            name: "Grand Frigo",
            quantity: 3,
            extra: "30W",
            targetUsage: EquipementTargetUsage.ACTIVITY,
            EquipmentCategories_Id: this.elecEquipmentCategory
        });
        this.petitFrigo = Equipments.insert({
            name: "Petit Frigo",
            quantity: 7,
            extra: "15W",
            targetUsage: EquipementTargetUsage.ACTIVITY,
            EquipmentCategories_Id: this.elecEquipmentCategory
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
        this.GCUPowerSupply = PowerSupplies.insert({name: "GCU"});

    }
    _populateWaterSupply() {
        console.info("inject WaterSupplies");
        this.AIWaterSupply = WaterSupplies.insert({name: "AIP"});
        this.GCUWaterSupply = WaterSupplies.insert({name: "GCU"});

    }

    _populateWaterDisposal() {
        console.info("inject WaterDisposals");
        this.AIWaterDisposal = WaterDisposals.insert({name: "AIP"});
        this.GCUWaterDisposal = WaterDisposals.insert({name: "GCU"});

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
        this.collageTaskGroup = TaskGroups.insert({name: "Collage - Test", teamId: this.communicationTeam});
    }

    _populateAssignmentTerms() {
        //assignmentCalendarDay
        console.info("inject AssignmentTerms");
        AssignmentTerms.insert({
            name: "Collage - test",
            start: InjectDataHelperServerService.getDateFromDateAndHourMinute(2017, 4, 17, 0, 0),
            end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 30, 0, 0),
            teams: [this.hardTeam],
            charisma: 50,
            assignmentTermPeriods: [
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 17, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 17, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 18, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 18, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 19, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 19, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 20, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 20, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 21, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 21, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 22, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 22, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 23, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 23, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 24, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 24, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 25, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 25, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 26, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 26, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 27, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 27, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 28, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 28, 8, 0),
                },
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 29, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 29, 8, 0),
                },

            ],
            calendarAccuracy: 2
        });

    }

    _populateAccessPoint(){
        console.info("inject Access Point");

        this.accessPoint1 = AccessPoints.insert({
            name: "PS1",
            selectedImage: "PS1 selected image",
            notSelectedImage: "PS1 not selected image"
        });
        this.accessPoint2 = AccessPoints.insert({
            name: "PS2",
            selectedImage: "PS2 selected image",
            notSelectedImage: "PS2 not selected image"
        });
        this.accessPoint3 = AccessPoints.insert({
            name: "PS3",
            selectedImage: "PS3 selected image",
            notSelectedImage: "PS3 not selected image"
        });
    }

    _populateActivities(){
        Activities.insert({
            name: "Chateau coconuts - test",
            teamId: this.communicationTeam,
            liveEventMasterId: this.hardId,
            placeId: this.bocalPlace,
            masterId: this.hardId,
            accessPasses:[{
                beneficiaries: "Dagier",
                start:InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 17, 6, 0),
                end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 19, 6, 0),
                recipientName: "Chouffe",
                recipientPhoneNumber: "0123456789",
                accessPointGranted:[
                    this.accessPoint1,
                    this.accessPoint2,
                    this.accessPoint3,
                ]

            }]
        });
    }

    _populateUser() {
        //users
        console.info("inject Meteor.users");

        this.hardId = Meteor.users.findOne({username: "test_orga_hard"})._id
        InjectDataHelperServerService.setTeamsAndSkills(this.hardId, [this.hardTeam], [this.conducteurSkill]);
        Meteor.users.update(this.hardId, {
            $set: {
                isReadyForAssignment: true,
                availabilities: [
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 17, 6, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 17, 8, 0)
                    },
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 18, 6, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 18, 8, 0)
                    },
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 19, 6, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 19, 8, 0)
                    },
                    {
                        start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 29, 6, 0),
                        end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 29, 8, 0)
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
            name: "Collage parcours 1 - test",
            teamId: this.communicationTeam,
            liveEventMasterId: this.hardId,
            groupId: this.collageTaskGroup,
            placeId: this.bocalPlace,
            masterId: this.hardId,
            timeSlotValidation: {
                        currentState: ValidationState.READY,
                        lastUpdateDate: now,
                        comments: []
            },
            timeSlots: [
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 17, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 17, 8, 0),
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
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 18, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 18, 8, 0),
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
                {
                    start: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 29, 6, 0),
                    end: InjectDataHelperServerService. getDateFromDateAndHourMinute(2017, 4, 29, 8, 0),
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

    }

}