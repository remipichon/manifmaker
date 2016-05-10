deleteAll = function() {
    Meteor.roles.remove({});
    GroupRoles.remove({});
    Meteor.users.remove({});

    Users.remove({});

    Assignments.remove({});
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
Meteor.startup(function () {

    // code to run on server at startup
    deleteAll();

    //AssignmentCalendarDisplayedDays.remove({});
    //AssignmentCalendarDisplayedHours.remove({});
    //AssignmentCalendarDisplayedQuarter.remove({});
    //AssignmentCalendarDisplayedAccuracy.remove({});


    //propagate assignment update
    //  Assignments.before.insert( /*if we need to add user and task data to assignments*/);
    Assignments.after.insert(ServerAssignmentService.propagateAssignment);
    Assignments.before.update(ServerAssignmentService.preventUpdate);
    Assignments.after.remove(ServerAssignmentService.removeAssignment);

    //propagate roles update
    Users.after.insert(ServerUserService.propagateRoles);
    Users.after.update(ServerUserService.propagateRoles);
    GroupRoles.after.update(ServerUserService.propagateGroupRoles);


    //init data
    initAccessRightData();
    populateData();
    console.info("**** Data init success ****");
    console.info("Here are some infos what have been added");
    console.info("Accounts Users collection size is "+Meteor.users.find().fetch().length);
    console.info("Customs Users collection size is "+Users.find().fetch().length);
    console.info("Tasks collection size is "+Tasks.find().fetch().length);
    console.info("Assignments collection size is "+ Assignments.find().fetch().length);
    console.info("Groups collection size is "+Groups.find().fetch().length);
    console.info("Skills collection size is "+Skills.find().fetch().length);
    console.info("Teams collection size is "+Teams.find().fetch().length);
    console.info("Places collection size is "+Places.find().fetch().length);
    console.info("AssignmentTerms collection size is "+AssignmentTerms.find().fetch().length);
    console.info("GroupRoles collection size is "+GroupRoles.find().fetch().length);

    //allow/deny policy
    Tasks.before.insert(ServerTaskService.allowInsert);
    Tasks.before.update(ServerTaskService.allowUpdate);
    Tasks.before.remove(ServerTaskService.allowDelete);

    Users.before.insert(ServerUserService.allowInsert);
    Users.before.update(ServerUserService.allowUpdate);
    Users.before.remove(ServerUserService.allowDelete);

    Assignments.before.insert(ServerAssignmentService.allowInsert);
    Assignments.before.update(ServerAssignmentService.allowUpdate);
    Assignments.before.remove(ServerAssignmentService.allowDelete);


    var referencesCollections = [Skills, Teams, Places, AssignmentTerms, GroupRoles];
    referencesCollections.forEach(ReferenceCollection => {
        ReferenceCollection.before.insert(ServerReferenceCollectionsService.allowInsert);
        ReferenceCollection.before.update(ServerReferenceCollectionsService.allowUpdate);
        ReferenceCollection.before.remove(ServerReferenceCollectionsService.allowDelete);
    });


});














