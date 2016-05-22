defaultFilter = {};
noSearchFilter = "";
noneFilter = {none: "none"};

export var AssignmentReactiveVars = {
    UserFilter: new ReactiveVar(defaultFilter), //route and service
    UserIndexFilter: new ReactiveVar(noSearchFilter), //route and service
    TaskFilter: new ReactiveVar(defaultFilter), //route and calendar component
    TaskIndexFilter: new ReactiveVar(noSearchFilter), //route
    CurrentAssignmentType: new ReactiveVar(AssignmentType.ALL), //service and route
    SelectedUser : new ReactiveVar(null), //route and menu
    SelectedTask: new ReactiveVar(null),//route and menu
    SelectedTaskBreadCrumb: new ReactiveVar(null), //TODO voir si on peut la merger avec AssignmentReactiveVars.SelectedTask
    SelectedTimeSlot: new ReactiveVar(null), //route and menu
    SelectedDate: new ReactiveVar(null),//rpute and menu
    SelectedAvailability: new ReactiveVar(null), //rpute and menu
    SelectedPeopleNeed: new ReactiveVar(null), //service and cmponentn
    IsUnassignment: new ReactiveVar(false) //menu and service
};