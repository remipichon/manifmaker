import {InjectDataHelperServerService} from "./InjectDataHelperServerService";

/** @class InjectGuidedTourDataServerService */
export class InjectGuidedTourDataServerService {

  constructor(options, init) {
    this.options = options;
    this.init = init;
  }

  injectAllData() {
    if (this.init) {
      InjectDataInfo.insert({triggerEnv: "GUIDED_TOUR", date: new Date(), options: this.options});
    }
    this.injectGroupRoles();
    this.populateTeams();
    this.addSettings();
    this.populateAssignmentTerms();
    this.populateSkill();
    this.populateUser();
    this.populatePlaces();
    if (this.init) {
      this.populateEquipmentCategories();
      this.populateEquipment();
      this.populateStorage();
      this.populatePowerSupply();
      this.populateWaterSupply();
      this.populateWaterDisposal();
      this.populateAccessPoint();
    } else {
      this.populateActivities();
      this.populateTaskGroups();
      this.populateTasks();
    }
    // throw new Meteor.Error("403", "InjectGuidedTourDataServerService is not made to inject data at startup");
  }

  injectGroupRoles() {
    this.groupRoles = {};
    if (!this.init) {
      this.groupRoles['organizeGroupRole'] = GroupRoles.findOne({
        name: "organizer",
      })._id;
      this.groupRoles['volunteerGroupRole'] = GroupRoles.findOne({
        name: "volnteer",
      })._id;
      this.groupRoles['equipment'] = GroupRoles.findOne({
        name: "equipment",
      })._id;
      this.groupRoles['accessPass'] = GroupRoles.findOne({
        name: "acessPass",
      })._id;
      this.groupRoles['assigment'] = GroupRoles.findOne({
        name: "assignment",
      })._id;
      this.groupRoles['allUser'] = GroupRoles.findOne({
        name: "allUser",
      })._id;
      this.groupRoles['allTask'] = GroupRoles.findOne({
        name: "allTask",
      })._id;
      this.groupRoles['allActivity'] = GroupRoles.findOne({
        name: "allActivity",
      })._id;
      this.groupRoles['allConf'] = GroupRoles.findOne({
        name: "allConf",
      })._id;
      this.groupRoles['minimal'] = GroupRoles.findOne({
        name: "minimal",
      })._id;
    } else {
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
  }

  populateTeams() {
    console.info("***********************************************************************");
    this.teams = {};
    console.info("inject Teams");
    this.teams['dreamTeam'] = Teams.insert({name: "Dream Team " + this.options.suffix});
    this.teams['volunteers'] = Teams.insert({name: "Volunteers " + this.options.suffix});
  }

  populateSkill() {
    console.info("***********************************************************************");
    this.skills = {};
    //skills
    if (!this.init) {
      this.skills['maitreNageur'] = Skills.findOne({
        key: "MAITRE_NAGEUR",
      })._id;
      this.skills['dj'] = Skills.findOne({
        key: "DJ",
      })._id;
      this.skills['cuisinier'] = Skills.findOne({
        key: "CUISTO",
      })._id;
      this.skills['conducteurFen'] = Skills.findOne({
        key: "CONDUCTEUR_FEN",
      })._id;
      Skills.update(this.skills['maitreNageur'], {$push: {"teams": this.teams.volunteers}});
      Skills.update(this.skills['dj'], {$push: {"teams": this.teams.dreamTeam}});
      Skills.update(this.skills['cuisinier'], {$push: {"teams": this.teams.dreamTeam}});
      Skills.update(this.skills['conducteurFen'], {$push: {"teams": this.teams.volunteers}});
      Skills.update(this.skills['conducteurFen'], {$push: {"teams": this.teams.dreamTeam}});

    } else {
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
  }

  populateUser() {
    console.info("***********************************************************************");
    this.users = {};
    console.info("inject Meteor.users");
    this.users['bob'] = InjectDataHelperServerService.createAccountAndUser("spongebob" + this.options.suffix, `spongebob${this.options.suffix}@yopmail.com`, "spongebob", this.groupRoles.organizeGroupRole);
    this.users['patrick'] = InjectDataHelperServerService.createAccountAndUser("patrickstar" + this.options.suffix, `patrickstar${this.options.suffix}@yopmail.com`, "patrickstar", [this.groupRoles.organizeGroupRole, this.groupRoles.equipment]);
    this.users['sandy'] = InjectDataHelperServerService.createAccountAndUser("sandycheeks" + this.options.suffix, `sandycheeks${this.options.suffix}@yopmail.com`, "sandycheeks", this.groupRoles.assigment);
    this.users['krab'] = InjectDataHelperServerService.createAccountAndUser("mrkrab" + this.options.suffix, `mrkrab${this.options.suffix}@yopmail.com`, "mrkrab", this.groupRoles.minimal);
    this.users['squidward'] = InjectDataHelperServerService.createAccountAndUser("squidwardtantacles" + this.options.suffix, `squidwardtantacles${this.options.suffix}@yopmail.com`, "squidwardtantacles", this.groupRoles.minimal);

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
            end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 18, 0)
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
    this.places = {}
    if (!this.init) {
      this.places['plage'] = Places.findOne({name: "Plage de Bikini Bottom"})._id;
      this.places['ck'] = Places.findOne({name: "Crousty Krab Croustillant"})._id;
    } else {
      //places
      console.info("inject Places");
      this.places['plage'] = Places.insert({name: "Plage de Bikini Bottom", location: "45.783142, 4.874600"});
      this.places['ck'] = Places.insert({name: "Crousty Krab Croustillant", location: "45.783142, 4.874600"});
    }
  }

  populateEquipmentCategories() {
    console.info("***********************************************************************");
    //equipment categories
    this.equipmentCategories = {};
    if (!this.init) {
      this.equipmentCategories['plage'] = EquipmentCategories.findOne({name: "Necessaire de plage"})._id;
    } else {
      console.info("inject EquipmentCategories");
      this.equipmentCategories['plage'] = EquipmentCategories.insert({name: "Necessaire de plage"});
    }
  }

  populateEquipment() {
    console.info("***********************************************************************");
    //equipment
    this.equipments = {};
    if (!this.init) {
      this.equipments['chaise'] = Equipments.findOne({name: "chaise longue"})._id;
      this.equipments['sautjaune'] = Equipments.findOne({name: "saut jaune en plastique"})._id;
      this.equipments['sautbleu'] = Equipments.findOne({name: "saut bleu en plastique"})._id;
      this.equipments['pelle'] = Equipments.findOne({name: "pelle en plastique"})._id;
    } else {
      console.info("inject Equipments");
      this.equipments['chaise'] = Equipments.insert({
        name: "chaise longue",
        quantity: 20,
        targetUsage: EquipementTargetUsage.ACTIVITY,
        EquipmentCategories_Id: this.equipmentCategories.plage
      });
      this.equipments['sautjaune'] = Equipments.insert({
        name: "saut jaune en plastique",
        quantity: 1,
        targetUsage: EquipementTargetUsage.ACTIVITY,
        EquipmentCategories_Id: this.equipmentCategories.plage
      });
      this.equipments['sautbleu'] = Equipments.insert({
        name: "saut bleue en plastique",
        quantity: 1,
        targetUsage: EquipementTargetUsage.ACTIVITY,
        EquipmentCategories_Id: this.equipmentCategories.plage
      });
      this.equipments['pelle'] = Equipments.insert({
        name: "pelle en plastique",
        quantity: 30,
        targetUsage: EquipementTargetUsage.TASK,
        EquipmentCategories_Id: this.equipmentCategories.plage
      });

    }


  }

  populateStorage() {
    console.info("***********************************************************************");
    console.info("inject EquipmentStorages");
  }

  populatePowerSupply() {
    console.info("***********************************************************************");
    console.info("inject PowerSupplies");

  }

  populateWaterSupply() {
    console.info("***********************************************************************");
    console.info("inject WaterSupplies");

  }

  populateWaterDisposal() {
    console.info("***********************************************************************");
    console.info("inject WaterDisposals");
  }

  populateAssignmentTerms() {
    console.info("***********************************************************************");
    //assignmentCalendarDay
    console.info("inject AssignmentTerms");
    AssignmentTerms.insert({
      name: "Journée Plage " + this.options.suffix,
      start: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 8, 0),
      end: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year, this.options.month, this.options.date, 18, 0),
      teams: [this.teams.volunteers, this.teams.dreamTeam],
      charisma: 50,
      addAvailabilitiesDeadline: InjectDataHelperServerService.getDateFromDateAndHourMinute(this.options.year + 1, this.options.month, this.options.date, 0, 0),
      calendarAccuracy: 2
    });

    AssignmentTerms.insert({
      name: "Soirée au Krusty Krab " + this.options.suffix,
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
  }

  populateActivities() {
    console.info("***********************************************************************");
    console.info("populateActivities");
    Activities.insert({
      name: "Tous au Krusty Krab ! " + this.options.suffix,
      teamId: this.teams.dreamTeam,
      liveEventMasterId: this.users.bob,
      placeId: this.places.ck,
      masterId: this.users.bob,
    });
  }

  populateTaskGroups() {
    console.info("***********************************************************************");
    console.info("populateTaskGroups");
  }

  populateTasks() {
    console.info("***********************************************************************");
    console.info("inject Tasks");
    var now = new Date();
    //tasks
    this.tasks = {};
    this.tasks.burgers = Tasks.insert({
      name: "Servir des burgers " + this.options.suffix,
      teamId: this.teams.dreamTeam,
      liveEventMasterId: this.users.sandy,
      placeId: this.places.ck,
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
    if (!this.init) return;
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