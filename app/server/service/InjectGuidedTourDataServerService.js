import {InjectDataHelperServerService} from "./InjectDataHelperServerService";

/** @class InjectGuidedTourDataServerService */
export class InjectGuidedTourDataServerService {

  InjectGuidedTourDataServerService(options) {
    this.options = options;
  }


  injectAllData() {
    this.options = {
      year: 2018,
      month: 10,
      date: 1
    };
    this.injectGroupRoles();
    this.populateTeams();
    this.addSettings();
    this.populateAssignmentTerms();
    this.populateSkill();
    this.populateUser();
    this.populatePlaces();
    this.populateEquipmentCategories();
    this.populateEquipment();
    this.populateStorage();
    this.populatePowerSupply();
    this.populateWaterSupply();
    this.populateWaterDisposal();
    this.populateAccessPoint();
    this.populateActivities();
    this.populateTaskGroups();
    this.populateTasks();
    // throw new Meteor.Error("403", "InjectGuidedTourDataServerService is not made to inject data at startup");
  }

  injectGroupRoles() {
    this.groupRoles = {};
    this.groupRoles['organizeGroupRole'] = GroupRoles.insert({
      name: "organizer",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.USERREAD, RolesEnum.TASKREAD, RolesEnum.TASKWRITE, RolesEnum.ACTIVITYREAD, RolesEnum.ACTIVITYWRITE]
    });
    this.groupRoles['volunteerGroupRole'] = GroupRoles.insert({
      name: "volnteer",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.TASKREAD]
    });
    this.groupRoles['equipment'] = GroupRoles.insert({
      name: "equipment",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.CONFMAKER]
    });
    this.groupRoles['accessPass'] = GroupRoles.insert({
      name: "acessPass",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.ACCESSPASSVALIDATION, RolesEnum.CONFMAKER]
    });
    this.groupRoles['assigment'] = GroupRoles.insert({
      name: "assignment",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.TASKREAD, RolesEnum.TASKWRITE, RolesEnum.ASSIGNMENTVALIDATION, RolesEnum.ASSIGNMENTTASKUSER]
    });
    this.groupRoles['allUser'] = GroupRoles.insert({
      name: "allUser",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.USERREAD, RolesEnum.USERWRITE, RolesEnum.USERDELETE, RolesEnum.ROLE]
    });
    this.groupRoles['allTask'] = GroupRoles.insert({
      name: "allTask",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.TASKREAD, RolesEnum.TASKWRITE, RolesEnum.TASKDELETE, RolesEnum.ACCESSPASSVALIDATION, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.ASSIGNMENTVALIDATION]
    });
    this.groupRoles['allActivity'] = GroupRoles.insert({
      name: "allActivity",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.ACTIVITYREAD, RolesEnum.ACTIVITYWRITE, RolesEnum.ACTIVITYDELETE, RolesEnum.ACTIVITYGENERALVALIDATION, RolesEnum.EQUIPMENTVALIDATION, RolesEnum.ACCESSPASSVALIDATION]
    });
    this.groupRoles['allConf'] = GroupRoles.insert({
      name: "allConf",
      roles: [RolesEnum.MANIFMAKER, RolesEnum.CONFMAKER]
    });
    this.groupRoles['minimal'] = GroupRoles.insert({
      name: "minimal",
      roles: [RolesEnum.MANIFMAKER]
    });
  }

  populateTeams() {
    console.info("***********************************************************************");
    this.teams = {};
    console.info("inject Teams");
    this.teams['dreamTeam'] = Teams.insert({name: "dreamTeam"});
    this.teams['volunteers'] = Teams.insert({name: "volunteers"});
  }

  populateSkill() {
    console.info("***********************************************************************");
    this.skills = {};
    //skills
    console.info("inject Skills");
    this.skills['maitreNageur'] = Skills.insert({
      key: "MAITRE_NAGEUR",
      label: "Maitre Nageur",
      teams: [this.teams.volunteers]
    });
    this.skills['dj'] = Skills.insert({
      key: "DJ",
      label: "Disc Jokey",
      teams: [this.teams.dreamTeam]
    });
    this.skills['cuisinier'] = Skills.insert({
      key: "CUISTO",
      label: "Expert Burger",
      teams: [this.teams.dreamTeam]
    });
    this.skills['conducteurFen'] = Skills.insert({
      key: "CONDUCTEUR_FEN",
      label: "Permis cariste pour le fen",
      teams: [this.teams.volunteers, this.teams.dreamTeam]
    });
  }

  populateUser() {
    console.info("***********************************************************************");
    this.users = {};
    console.info("inject Meteor.users");
    this.users['bob'] = InjectDataHelperServerService.createAccountAndUser("spongebob", "spongebob@yopmail.com", "spongebob", this.groupRoles.organizeGroupRole);
    this.users['patrick'] = InjectDataHelperServerService.createAccountAndUser("patrickstar", "patrickstar@yopmail.com", "patrickstar", [this.groupRoles.organizeGroupRole, this.groupRoles.equipment]);
    this.users['sandy'] = InjectDataHelperServerService.createAccountAndUser("sandycheeks", "sandycheeks@yopmail.com", "sandycheeks", this.groupRoles.assigment);
    this.users['krab'] = InjectDataHelperServerService.createAccountAndUser("mrkrab", "mrkrab@yopmail.com", "mrkrab", this.groupRoles.minimal);
    this.users['squidward'] = InjectDataHelperServerService.createAccountAndUser("squidwardtantacles", "squidwardtantacles@yopmail.com", "squidwardtantacles", this.groupRoles.minimal);

    console.info("********");
    console.info("updating user bob");
    InjectDataHelperServerService.setTeamsAndSkills(this.users.bob, [this.teams.dreamTeam], [this.skills.dj]);
    Meteor.users.update(this.users.bob, {
      $set: {
        availabilities: [
          {
            start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 10, 0),
            end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 18, 0),
          }
        ],
        isReadyForAssignment: true
      }
    });
    console.info("********");
    console.info("updating user patrick");
    InjectDataHelperServerService.setTeamsAndSkills(this.users.patrick, [this.teams.dreamTeam], null);
    Meteor.users.update(this.users.patrick, {
      $set: {
        availabilities: [
          {
            start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 10, 0),
            end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 18, 0),
          }
        ],
        isReadyForAssignment: true
      }
    });
    console.info("********");
    console.info("updating user sandy");
    InjectDataHelperServerService.setTeamsAndSkills(this.users.sandy, [this.teams.dreamTeam], null);
    Meteor.users.update(this.users.sandy, {
      $set: {
        availabilities: [
          {
            start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 15, 0),
            end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date , 18, 0)
          }
        ]
      }
    });
    console.info("********");
    console.info("updating user krab");
    InjectDataHelperServerService.setTeamsAndSkills(this.users.krab, [this.teams.volunteers], null);
    Meteor.users.update(this.users.krab, {
      $set: {
        isReadyForAssignment: true,
        //will get availabilities during this.options.date
      }
    });
    console.info("********");
    console.info("updating squidward");
    InjectDataHelperServerService.setTeamsAndSkills(this.users.squidward, [this.teams.volunteers], [this.skills.conducteurFen]);
    Meteor.users.update(this.users.squidward, {
      $set: {
        isReadyForAssignment: true,
        //will get availabilities during this.options.date
      }
    });

  }

  populatePlaces() {
    console.info("***********************************************************************");
    //places
    console.info("inject Places");
    this.qgPlace = Places.insert({name: "QG Orga", location: "45.783142, 4.874600"});
    this.bocalPlace = Places.insert({name: "Bocal", location: "45.783142, 4.874600"});
    this.humaPlace = Places.insert({name: "Pelouse Humas", location: "45.783142, 4.874600"});
    this.petiteScenePlace = Places.insert({name: "Petite scene", location: "45.783142, 4.874600"});
    this.grandeScenePlace = Places.insert({name: "Grande scene", location: "45.783142, 4.874600"});
  }

  populateEquipmentCategories() {
    console.info("***********************************************************************");
    //equipment categories
    console.info("inject EquipmentCategories");
    this.barriereEquipmentCategory = EquipmentCategories.insert({name: "barrière"});
    this.attacheEquipmentCategory = EquipmentCategories.insert({name: "attache"});
    this.vehiculeEquipmentCategory = EquipmentCategories.insert({name: "véhicule"});
    this.elecEquipmentCategory = EquipmentCategories.insert({name: "élec", extraComputeRule: "SUM"});
  }

  populateEquipment() {
    console.info("***********************************************************************");
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

  populateStorage() {
    console.info("***********************************************************************");
    //storage
    console.info("inject EquipmentStorages");
    this.humasStorage = EquipmentStorages.insert({name: "Depot humas"});
    this.AIPStorage = EquipmentStorages.insert({name: "Depot AIP"});
    this.creuxStorage = EquipmentStorages.insert({name: "Creux GCU"});
  }

  populatePowerSupply() {
    console.info("***********************************************************************");
    //power supply
    console.info("inject PowerSupplies");
    this.AIPPowerSupply = PowerSupplies.insert({name: "AIP"});
    this.GCUPowerSupply = PowerSupplies.insert({name: "GCU"});

  }

  populateWaterSupply() {
    console.info("***********************************************************************");
    console.info("inject WaterSupplies");
    this.AIWaterSupply = WaterSupplies.insert({name: "AIP"});
    this.GCUWaterSupply = WaterSupplies.insert({name: "GCU"});

  }

  populateWaterDisposal() {
    console.info("***********************************************************************");
    console.info("inject WaterDisposals");
    this.AIWaterDisposal = WaterDisposals.insert({name: "AIP"});
    this.GCUWaterDisposal = WaterDisposals.insert({name: "GCU"});

  }

  populateAssignmentTerms() {
    console.info("***********************************************************************");
    //assignmentCalendarDay
    console.info("inject AssignmentTerms");
    AssignmentTerms.insert({
      name: "Journée Plage",
      start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 8, 0),
      end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 18, 0),
      teams: [this.teams.volunteers, this.teams.dreamTeam],
      charisma: 50,
      addAvailabilitiesDeadline: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year + 1, this.options.month, this.options.date, 0, 0),
      calendarAccuracy: 2
    });

    AssignmentTerms.insert({
      name: "Soirée au Krusty Krab",
      start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date + 1, 19, 0),
      end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date + 1, 23, 0),
      teams: [this.teams.volunteers, this.teams.dreamTeam],
      charisma: 100,
      addAvailabilitiesDeadline: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year + 1, this.options.month, this.options.date, 0, 0),
      calendarAccuracy: 1
    });

  }

  populateAccessPoint() {
    console.info("***********************************************************************");
    console.info("populateAccessPoint");
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

  populateActivities() {
    console.info("***********************************************************************");
    console.info("populateActivities");
    Activities.insert({
      name: "Tous au Krusty Krab !",
      teamId: this.teams.dreamTeam,
      liveEventMasterId: this.users.bob,
      placeId: this.bocalPlace,
      masterId: this.users.bob,
    });
  }

  populateTaskGroups() {
    console.info("***********************************************************************");
    console.info("populateTaskGroups");
    //task groups
  }

  populateTasks() {
    console.info("***********************************************************************");
    console.info("inject Tasks");
    var now = new Date();
    //tasks
    this.tasks = {};
    this.tasks.burgers = Tasks.insert({
      name: "Servir des burgers",
      teamId: this.teams.dreamTeam,
      liveEventMasterId: this.users.sandy,
      placeId: this.bocalPlace,
      masterId: this.users.sandy,
      timeSlotValidation: {
        currentState: ValidationState.READY,
        lastUpdateDate: now,
        comments: []
      },
      timeSlots: [
        {
          start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date + 1, 19, 0),
          end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date + 1, 20, 0),
          peopleNeeded: [
            {
              teamId: this.teams.dreamTeam
            },
            {
              teamId: this.teams.dreamTeam,
              skills: [this.skills.cuisinier]
            }
          ],
        },
        {
          start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date + 1, 20, 0),
          end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date + 1, 21, 0),
          peopleNeeded: [
            {
              teamId: this.teams.dreamTeam
            },
            {
              teamId: this.teams.dreamTeam,
              skills: [this.skills.cuisinier]
            }
          ],
        },
      ]
    });
    Tasks.update(this.tasks.burgers, {$set: {"equipmentValidation.currentState": ValidationState.READY}})
  }

  addSettings() {
    console.info("***********************************************************************");
    console.info("add settings");
    Settings.insert({one: 1});
    Settings.update(Settings.findOne()._id, {
      $set: {createAccountDefaultTeam: this.teams.volunteers}
    });
    Settings.update(Settings.findOne()._id, {
      $set: {defaultGroupRoles: this.groupRoles.volunteerGroupRole}
    });
    Settings.update(Settings.findOne()._id, {
      $set: {
        defaultActivityMapsLatLng: {
          lat: 45.783642,
          lng: 4.872970
        }
      }
    });
    Settings.update(Settings.findOne()._id, {
      $set: {
        activitiesEnclosingDate: {
          start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 0, 0),
          end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date + 3, 0, 0)
        }
      }
    });
  }

}