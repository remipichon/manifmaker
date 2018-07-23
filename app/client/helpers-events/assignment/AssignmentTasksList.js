import {AssignmentReactiveVars} from "./AssignmentReactiveVars"
import {TeamService} from "../../../both/service/TeamService"
import {PeopleNeedService} from "../../../both/service/PeopleNeedService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {AssignmentServiceClient} from "../../service/AssignmentServiceClient"

class AssignmentTasksList extends BlazeComponent {
  constructor(parent) {
    super();
    this.taskTeamFilter = new ReactiveVar(AssignmentReactiveVars.defaultFilter);
    this.isplayAssignedTask = new ReactiveVar(false);
    this.taskSkillsFilter = new ReactiveVar(null);
    this.taskNeededTeamFilter = new ReactiveVar(null); //ok

  }

  events() {
    return [{
      "click .href-assignment-task": this.onClickTaskName,
      "click .task": this.onClickTask,
      "click li.peopleNeed": this.onClickPeopleNeed,
      "click .tasks-list-header": this.switchTasksListDeveloped,
      "keyup #search_task_name": this.performSearch,
      "change #display-assigned-task-checkbox": this.switchDisplayAssignedTask
    }]
  }


  onClickTaskName(event) {
    console.info("routing", "/assignment/task/" + this.currentData()._id);
    Router.go("/assignment/task/" + this.currentData()._id);
  }

  onClickTask(event) {
    AssignmentReactiveVars.SelectedTaskBreadCrumb.set(this.currentData());
    if (AssignmentReactiveVars.CurrentAssignmentType.get() == AssignmentType.USERTOTASK) {
      if (AssignmentReactiveVars.IsUnassignment.get()) {
        Meteor.call("removeAssignUserToTaskTimeSlot",
          AssignmentReactiveVars.SelectedPeopleNeed.get()._id,
          AssignmentReactiveVars.SelectedUser.get()._id,
          function (error, result) {
            if (!error) {
              let _idTask = "not_implemented";
              AssignmentServiceClient.congratsRemoveAssignment(AssignmentType.USERTOTASK, _idTask);
            }
          });
        AssignmentReactiveVars.IsUnassignment.set(false);
      }
    }
  }

  onClickPeopleNeed(event) {
    event.stopPropagation();
    var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();
    var isUnassignment = AssignmentReactiveVars.IsUnassignment.get();
    var target = $(event.target);
    var _idTask, _idTimeSlot;
    if (target.hasClass("task"))
      _idTask = target.data("_id");
    else
      _idTask = target.parents(".task").data("_id");

    AssignmentReactiveVars.SelectedPeopleNeed.set(this.currentData());

    var userId = AssignmentReactiveVars.SelectedUser.get()._id;

    let moreThanOneAvailableTimeSlot = target.parents(".time-slot").siblings().length > 0;
    console.log("moreThanOneAvailableTimeSlot",moreThanOneAvailableTimeSlot)


    if (target.hasClass("time-slot"))
      _idTimeSlot = target.data("_id");
    else
      _idTimeSlot = target.parents(".time-slot").data("_id");

    switch (currentAssignmentType) {
      case AssignmentType.USERTOTASK:
        if (isUnassignment) {
          console.error("USERTOTASK, onClickPeopleNeed with isUnassignment: shouldn't happen");
          return;
        } else
          Meteor.call("assignUserToTaskTimeSlot", AssignmentReactiveVars.SelectedPeopleNeed.get()._id, userId, function (error, result) {
            if (!error) {
              if(!moreThanOneAvailableTimeSlot) {
                //reset workflow
                AssignmentReactiveVars.isSelectedAvailability.set(false);
                AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.noneFilter);
              }
              AssignmentServiceClient.congratsAssignment(AssignmentType.USERTOTASK, _idTask);
            } else {
              console.error(error);
            }
          });
        break;
      case AssignmentType.TASKTOUSER:
        break;
    }


  }

  switchTasksListDeveloped(event) {
    AssignmentReactiveVars.isTasksListDeveloped.set(!AssignmentReactiveVars.isTasksListDeveloped.get());
    if (AssignmentReactiveVars.isUsersListDeveloped.get()) {
      AssignmentReactiveVars.isUsersListDeveloped.set(false);
    }
  }

  isTasksListDeveloped() {
    return AssignmentReactiveVars.isTasksListDeveloped.get()
  }

  displayAssignedTaskState() {
    if (this.isplayAssignedTask.get()) return "checked"; else return "";
  }

  performSearch(event) {
    var searchInput = $("#search_task_name").val();

    //desactivation de la recherche par URL
    //console.info("routing", "/assignment/task/search/"+query);
    //Router.go("/assignment/task/search/"+query);

    if (searchInput === "") {
      AssignmentReactiveVars.TaskIndexFilter.set(AssignmentReactiveVars.noSearchFilter);
    } else {
      AssignmentReactiveVars.TaskIndexFilter.set(searchInput);
    }
  }

  filterRespTeam(error, docModified, newOption) {
    return _.bind(function (error, docModifier, newOption) {
      var _id = newOption;
      if (!_id) {
        this.taskTeamFilter.set(AssignmentReactiveVars.defaultFilter);
      } else {
        this.taskTeamFilter.set({
          teamId: _id
        });
      }
    }, this);
  }

  filterNeededTeam(error, docModified, newOption) {
    return _.bind(function (error, docModifier, newOption) {
      var _id = newOption;
      if (!_id) {
        this.taskNeededTeamFilter.set(null);
        //TODO add this "noNeededTeam" in the select
      } else if (_id === "noNeededTeam") {
        this.taskNeededTeamFilter.set("noNeededTeam");
      }
      else {
        this.taskNeededTeamFilter.set(_id);
      }
    }, this);
  }

  filterSkill(error, docModified, newOption) {
    return _.bind(function (error, docModifier, newOption) {
      var _ids = newOption;
      if (!_ids || _ids == "") {
        this.taskSkillsFilter.set(null);
        //TODO add this "noSkills" option in the select
      } else if (_ids[0] === "noSkills") {
        this.taskSkillsFilter.set([]);
      } else {
        this.taskSkillsFilter.set(_ids);
      }
    }, this);
  }

  switchDisplayAssignedTask(event) {
    this.isplayAssignedTask.set($($(event.target)[0]).is(':checked'));
  }

  optionQueryTeamsWithoutAlreadyAssigned() {
    return TeamService.optionQueryTeamsWithoutAlreadyAssigned();
  }

  tasks() {
    var filter = AssignmentReactiveVars.TaskFilter.get();
    var filterIndex = AssignmentReactiveVars.TaskIndexFilter.get();
    var teamFilter = this.taskTeamFilter.get();
    var displayAssignedTask = this.isplayAssignedTask.get();
    var assignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();
    var currentAssignmentTerm = AssignmentTerms.findOne(AssignmentCalendarDisplayedDays.findOne().assignmentTermId);

    var skillsFilter = this.taskSkillsFilter.get();
    var neededTeamFilter = this.taskNeededTeamFilter.get();
    var removeAssignmentFilter = {};
    var timeSlotsFilter = {$elemMatch: {}};

    if (filter._id) {
      removeAssignmentFilter = filter;
    } else if (filter === AssignmentReactiveVars.noneFilter) {
      teamFilter = AssignmentReactiveVars.noneFilter;
      removeAssignmentFilter = AssignmentReactiveVars.noneFilter;
    } else {
      if (filter.$elemMatch) {
        timeSlotsFilter = filter;
      }

      //assignmentTermFilter
      timeSlotsFilter.$elemMatch.start = {$gte: currentAssignmentTerm.start};
      timeSlotsFilter.$elemMatch.end = {$lt: currentAssignmentTerm.end};


      if (displayAssignedTask && assignmentType === AssignmentType.TASKTOUSER) {
        //skillsAndNeededTeamFilterForAssigned
        if (!timeSlotsFilter.$elemMatch.peopleNeeded) timeSlotsFilter.$elemMatch.peopleNeeded = {$elemMatch: {}};

        if (skillsFilter)
          timeSlotsFilter.$elemMatch.peopleNeeded.$elemMatch.skills = {$all: skillsFilter};
        if (neededTeamFilter) {
          if (neededTeamFilter === "noNeededTeam")
            timeSlotsFilter.$elemMatch.peopleNeeded.$elemMatch.teamId = null;
          else
            timeSlotsFilter.$elemMatch.peopleNeeded.$elemMatch.teamId = neededTeamFilter;
        }
      }
      if (!displayAssignedTask) {
        var assignedPeopleNeedIds = _.reduce(Assignments.find().fetch(), function (memo, val) {
          memo.push(val.peopleNeedId);
          return memo
        }, []);
        if (!timeSlotsFilter.$elemMatch.peopleNeeded) timeSlotsFilter.$elemMatch.peopleNeeded = {$elemMatch: {}};
        timeSlotsFilter.$elemMatch.peopleNeeded.$elemMatch._id = {$nin: assignedPeopleNeedIds};
      }


      if (skillsFilter) {
        if (!timeSlotsFilter.$elemMatch.peopleNeeded) timeSlotsFilter.$elemMatch.peopleNeeded = {$elemMatch: {}};
        timeSlotsFilter.$elemMatch.peopleNeeded.$elemMatch.skills = {$all: skillsFilter};
      }
      if (neededTeamFilter) {
        if (!timeSlotsFilter.$elemMatch.peopleNeeded) timeSlotsFilter.$elemMatch.peopleNeeded = {$elemMatch: {}};
        if (neededTeamFilter === "noNeededTeam")
          timeSlotsFilter.$elemMatch.peopleNeeded.$elemMatch.teamId = null;
        else
          timeSlotsFilter.$elemMatch.peopleNeeded.$elemMatch.teamId = neededTeamFilter;
      }

    }

    var validationReadyFilter = {
      "timeSlotValidation.currentState": ValidationState.READY
    };

    var searchResult;
    var filterResult;

    filterResult = Tasks.find({
      $and: [
        {timeSlots: timeSlotsFilter},
        validationReadyFilter,
        removeAssignmentFilter,
        teamFilter,
      ]
    }, {limit: 20}).fetch();

    searchResult = TasksIndex.search(filterIndex, {limit: 20}).fetch();
    let result = _.intersectionObjects(searchResult, filterResult);
    let finalResult = [];
    //check if selected user has availabilities for at leat one timeslot for each task
    if (AssignmentReactiveVars.SelectedUser.get()) {
      result.forEach(task => {
        let breakIt = false;
        task.timeSlots.forEach(timeSlot => {
          if (!breakIt) {
            //get only the timeslot for the term, match with mongo query above
            // timeSlotsFilter.$elemMatch.start = {$gte: currentAssignmentTerm.start};
            // timeSlotsFilter.$elemMatch.end = {$lt: currentAssignmentTerm.end};
            let timeSlotStart = new moment(timeSlot.start);
            let timeSlotEnd = new moment(timeSlot.end);
            let termStart = new moment(currentAssignmentTerm.start);
            let termEnd = new moment(currentAssignmentTerm.end);
            if( (timeSlotStart.isAfter(termStart) || timeSlotStart.isSame(termStart)) &&
              (timeSlotEnd.isBefore(termEnd) || timeSlotEnd.isSame(termEnd))) {
              if (AvailabilityService.checkUserAvailabilty(Meteor.users.findOne(AssignmentReactiveVars.SelectedUser.get()), timeSlot.start, timeSlot.end)) {
                finalResult.push(task);
                breakIt = true;
              }
            }
          }
        });
      });
    } else {
      finalResult = result;
    }

    return finalResult;
  }

  team() {
    return Teams.findOne({_id: this.currentData().teamId}).name;
  }

  user() {
    return Meteor.users.findOne({_id: this.currentData().userId}).username;
  }

  timeSlotsInfo() {
    let timeSlots = this.timeSlots();
    if (timeSlots.length == 0) return ""; //timeSlot infos can be directly see in the calendar

    var string = " • ";
    _.each(timeSlots, function (timeSlot) {
      string += new moment(timeSlot.start).format("H[h]mm") + " - " + new moment(timeSlot.end).format("H[h]mm") + " • ";
    });
    return string;
  }

  timeSlots() {
    var task = this.currentData();
    var timeSlots = task.timeSlots;
    if (AssignmentReactiveVars.CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {

      var relevantSelectedDates = AssignmentReactiveVars.RelevantSelectedDates.get();
      var selectedStartDate = relevantSelectedDates.start;
      var selectedEndDate = relevantSelectedDates.end;

      var result = [];
      _.each(timeSlots, (timeSlot) => {
        var start = new moment(timeSlot.start);
        var end = new moment(timeSlot.end);
        //is timeslot within selected dates ?
        //match with
        // timeSlotStart = {$lt: endDate.toDate()};
        // timeSlotEnd = {$gt: startDate.toDate()};
        //from filterTaskList
        if (start.isBefore(selectedEndDate) && end.isAfter(selectedStartDate)){
          //is user available during this timeslot ?
          if(AvailabilityService.checkUserAvailabilty( Meteor.users.findOne(AssignmentReactiveVars.SelectedUser.get()), start, end)) {
            result.push(timeSlot);
          }
        }
      });
      console.log("from timeSlots",timeSlots, "selected are",result, "for", selectedStartDate.toDate(), "  to   ", selectedEndDate.toDate())
      return result;
    } else {
      return []; //timeSlot infos can be directly see in the calendar
    }
  }

  peopleNeeded() {
    var peopleNeeded = this.currentData().peopleNeeded;

    if (AssignmentReactiveVars.CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {
      if (AssignmentReactiveVars.IsUnassignment.get()) {

        var userId = AssignmentReactiveVars.SelectedUser.get()._id;
        var relevantSelectedDates = AssignmentReactiveVars.RelevantSelectedDates.get();
        var selectedStartDate = relevantSelectedDates.start;
        var selectedEndDate = relevantSelectedDates.end;


        var userAssignments = AssignmentService.getAssignmentForUser({_id: userId});
        var assignmentFound;
        userAssignments.forEach(assignment => {
          //TODO #378 why don't we need enddate ?
          if ((new moment(assignment.start).isBefore(selectedStartDate) || new moment(assignment.start).isSame(selectedStartDate)
            ) && new moment(assignment.end).isAfter(selectedStartDate)) {
            assignmentFound = assignment;
          }
        });

        var timeSlotPeopleNeed = PeopleNeedService.getPeopleNeedByIdAndTask(assignmentFound.peopleNeedId, Tasks.findOne(assignmentFound.taskId));

        return [timeSlotPeopleNeed.peopleNeed]

      } else {
        var result = [];

        _.each(peopleNeeded, (peopleNeed) => {
          if (Assignments.findOne({peopleNeedId: peopleNeed._id})) return;
          var selectedUser = Meteor.users.findOne(AssignmentReactiveVars.SelectedUser.get());

          //userId : if existing, selected user must be the one
          if (peopleNeed.userId) {
            if (peopleNeed.userId === selectedUser._id) {
              result.push(peopleNeed);
              return;
            }
            return;
          }


          //teamId : if existing, selected user must at least have the required team
          if (peopleNeed.teamId) {
            if (!_.contains(selectedUser.teams, peopleNeed.teamId)) {
              return;
            }
          }

          //if no skills required, we don't care about the user's skills
          if (peopleNeed.skills.length === 0) {
            result.push(peopleNeed);
            return;
          }

          //skills : if not empty, user must have all the required skill
          var userHaveAllRequiredSkills = true;
          _.each(peopleNeed.skills, (skill) => {
            if (!_.contains(selectedUser.skills, skill)) {
              userHaveAllRequiredSkills = false;
            }
          });
          if (userHaveAllRequiredSkills) {
            result.push(peopleNeed);
            return;
          }
        });

        console.log("peopleneeded", peopleNeeded, " => ", result)
        return result;
      }

    } else {
      return peopleNeeded;
    }


    var skills = timeSlot.skills;
  }

  neededTeamOptions() {
    return {
      chooseLabel: "Choose a needed team",
    };
  }

  responsibleTeamOptions() {
    return {
      chooseLabel: "Choose a responsible team",
    };
  }

  isUnassignment(){
    if(AssignmentReactiveVars.IsUnassignment.get()){
      return "is-unassignment"
    }
  }


}

AssignmentTasksList.register("AssignmentTasksList");






