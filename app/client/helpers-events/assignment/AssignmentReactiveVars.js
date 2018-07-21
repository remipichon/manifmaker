const defaultFilter = {};
const noSearchFilter = "";
const noneFilter = {none: "none"};

export var AssignmentReactiveVars = {
  IsPopOverOpened: new ReactiveVar(false), //route and service
  UserFilter: new ReactiveVar(defaultFilter), //route and service
  UserIndexFilter: new ReactiveVar(noSearchFilter), //route and service
  TaskFilter: new ReactiveVar(defaultFilter), //route and calendar component
  TaskIndexFilter: new ReactiveVar(noSearchFilter), //route
  CurrentAssignmentType: new ReactiveVar(AssignmentType.ALL), //service and route
  SelectedUser: new ReactiveVar(null), //route and menu
  SelectedTask: new ReactiveVar(null),//route and menu
  SelectedTaskBreadCrumb: new ReactiveVar(null), //TODO voir si on peut la merger avec AssignmentReactiveVars.SelectedTask
  SelectedTimeSlot: new ReactiveVar(null), //route and menu
  SelectedDate: new ReactiveVar(null),//rpute and menu
  isSelectedAvailability: new ReactiveVar(false), //rpute and menu
  SelectedPeopleNeed: new ReactiveVar(null), //service and cmponentn
  IsUnassignment: new ReactiveVar(false), //menu and service,
  isUsersListDeveloped: new ReactiveVar(false),
  isTasksListDeveloped: new ReactiveVar(false),
  defaultFilter: defaultFilter,
  noSearchFilter: noSearchFilter,
  noneFilter: noneFilter
};