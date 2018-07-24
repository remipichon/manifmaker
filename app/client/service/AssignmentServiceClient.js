import {AssignmentService} from "../../both/service/AssignmentService";
import {PeopleNeedService} from "../../both/service/PeopleNeedService";
import {TimeSlotService} from "../../both/service/TimeSlotService";
import {AssignmentReactiveVars} from "../../client/helpers-events/assignment/AssignmentReactiveVars";

/** @class AssignmentServiceClient */
export class AssignmentServiceClient {

  /**
   * @summary Filter user list in task to user mode only remove assignment only.
   * @description
   * Reactive Var :
   *
   *  - Get ReactiveVar AssignmentReactiveVars.SelectedPeopleNeed
   *  - Set AssignmentReactiveVars.SelectedTimeSlot
   *  - Set AssignmentReactiveVars.IsUnassignment
   *
   * @locus Client
   * @returns {timeSlot|null}
   */
  static taskToUserPerformUserFilterRemoveAssignment() {
    var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

    switch (currentAssignmentType) {
      case AssignmentType.USERTOTASK:

        var userId = AssignmentReactiveVars.SelectedUser.get()._id;
        let relevantSelectedDates = AssignmentReactiveVars.RelevantSelectedDates.get();
        let start = relevantSelectedDates.start;
        //we don't need end because in that case, start date IS the start of an assignment (we are in remove assignment mode, the name hints it

        var userAssignments = AssignmentService.getAssignmentForUser({_id: userId});
        var assignmentFound;
        userAssignments.forEach(assignment => {
          if ((new moment(assignment.start).isBefore(start) || new moment(assignment.start).isSame(start)
            ) && new moment(assignment.end).isAfter(start)) {
            assignmentFound = assignment;
          }
        });

        var newFilter = {
          _id: assignmentFound.taskId
        };

        AssignmentReactiveVars.SelectedPeopleNeed.set({_id: assignmentFound.peopleNeedId});
        AssignmentReactiveVars.TaskFilter.set(newFilter);
        AssignmentReactiveVars.IsUnassignment.set(true);

        break;
      case AssignmentType.TASKTOUSER:
        var peopleNeeded = AssignmentReactiveVars.SelectedPeopleNeed.get();

        var assignment = Assignments.findOne({
          peopleNeedId: peopleNeeded._id
        });

        var newFilter = {
          _id: assignment.userId
        };

        AssignmentReactiveVars.SelectedTimeSlot.set(TimeSlotService.getTaskAndTimeSlotAndPeopleNeedByPeopleNeedId(peopleNeeded._id).timeSlot);
        AssignmentReactiveVars.UserFilter.set(newFilter);
        AssignmentReactiveVars.IsUnassignment.set(true);
        break;
    }
  }

  /**
   * @summary filter task list which have timeslots within given start and end dates as long as the user has enclosing enclosingAvailability (user read from AssignmentReactiveVars.SelectedUser)
   * @param startDate
   * @param endDate
   */
  static filterTaskList(startDate, endDate) {

    console.log("filterTaskList get all tasks from", startDate.toDate(), "   to   ", endDate.toDate());

    var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

    switch (currentAssignmentType) {
      case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected enclosingAvailability slot
        var userId = AssignmentReactiveVars.SelectedUser.get()._id;
        var user = Meteor.users.findOne({_id: userId});

        /*
         ** Availabilities filter :
         Task's timeslots happening between start/end dates who are still withing user availabilities
         */
        let availabilitiesFilterStart = {$lt: endDate.toDate()};
        let availabilitiesFilterEnd = {$gt: startDate.toDate()};

        /*
         ** Skills filter
         User is eligible for a task if he has all skills for at least one task' people need's skills.
         The query looks like something like this : 'foreach timeSlot foreach peopleNeeded foreach skills' = at least user.skills
         */
        var timeSlotsFilter = {
          $elemMatch: {
            $or: [
              //userIdFilter,
              //skillsFilter,
              //noSkillsFilter
            ]
          }
        };
        let exactUser = {
          //userId filter
          peopleNeeded: {
            $elemMatch: {
              userId: user._id
            }
          }
        };
        exactUser.start = availabilitiesFilterStart;
        exactUser.end = availabilitiesFilterEnd;
        timeSlotsFilter.$elemMatch.$or.push(exactUser);
        let skillsAndTeam = {
          //skills filter
          peopleNeeded: {
            $elemMatch: {
              skills: {
                $elemMatch: {
                  $in: user.skills
                }
              },
              teamId: {
                $in: user.teams
              }
            }
          }
        };
        skillsAndTeam.start = availabilitiesFilterStart;
        skillsAndTeam.end = availabilitiesFilterEnd;
        timeSlotsFilter.$elemMatch.$or.push(skillsAndTeam);
        let teamNoSkill = {
          //skills filter
          peopleNeeded: {
            $elemMatch: {
              skills: { // $eq : [] doesn't work with miniMongo, here is a trick
                $not: {
                  $ne: []
                }
              },
              teamId: {
                $in: user.teams
              }
            }
          }
        };
        teamNoSkill.start = availabilitiesFilterStart;
        teamNoSkill.end = availabilitiesFilterEnd;
        timeSlotsFilter.$elemMatch.$or.push(teamNoSkill);
        let skillsNoTeam = {
          //skills filter
          peopleNeeded: {
            $elemMatch: {
              skills: {
                $elemMatch: {
                  $in: user.skills
                }
              },
              teamId: null
            }
          }
        };
        skillsNoTeam.start = availabilitiesFilterStart;
        skillsNoTeam.end = availabilitiesFilterEnd;
        timeSlotsFilter.$elemMatch.$or.push(skillsNoTeam);
        //aggregate is not supported by mini mongo
        AssignmentReactiveVars.TaskFilter.set(timeSlotsFilter);
        break;
      case
      AssignmentType.TASKTOUSER:
      //only display users that have at least one enclosingAvailability matching the selected time slot
      //we let the event bubbles to the parent
    }
  }

  /**
   * @summary Filter user list in task to user mode only.
   * Reactive Var :
   *
   *  - Get ReactiveVar AssignmentReactiveVars.SelectedPeopleNeed
   *  - Set AssignmentReactiveVars.SelectedTimeSlot
   *  - Set AssignmentReactiveVars.IsUnassignment
   *
   * @locus Anywhere
   * @returns {timeSlot|null}
   */
  static taskToUserPerformUserFilter() {
    /**
     *
     * By now, userId, teamId and skills can't be combined.
     * In particular we can't ask for a specific team and for specific skills (will be soon)
     *
     * Skills filter
     *
     * For selected task's time slot, the user must have all the required skills of at least
     * one of task's people need
     *
     */
    var peopleNeeded = AssignmentReactiveVars.SelectedPeopleNeed.get();
    var timeSlot = AssignmentReactiveVars.SelectedTimeSlot.get();
    AssignmentReactiveVars.IsUnassignment.set(false);

    var askingSpecificNeedAndSkills = [];
    if (peopleNeeded.userId) { //prior above teamId an skills
      askingSpecificNeedAndSkills.push({
        _id: peopleNeeded.userId
      });
    } else if (peopleNeeded.teamId && peopleNeeded.skills.length !== 0) {  //we combine teamId and skills
      askingSpecificNeedAndSkills.push({
        $and: [
          {
            teams: peopleNeeded.teamId
          },
          {
            skills: {
              $all: peopleNeeded.skills
            }
          }
        ]
      });
    } else if (peopleNeeded.teamId) { //we only use teamId
      askingSpecificNeedAndSkills.push({
        teams: peopleNeeded.teamId
      });
    } else if (peopleNeeded.skills.length !== 0) //if people need doesn't require any particular skills
      askingSpecificNeedAndSkills.push({skills: {$all: peopleNeeded.skills}});

    var userTeamsSkillsFilter;
    if (askingSpecificNeedAndSkills.length !== 0) //if all time slot's people need don't require any particular skills
      userTeamsSkillsFilter = {
        $or: askingSpecificNeedAndSkills
      };


    var availabilitiesFilter = {
      availabilities: {
        $elemMatch: {
          start: {$lte: timeSlot.start},
          end: {$gte: timeSlot.end}
        }
      }
    };

    /**
     * The user must be free during the time slot duration and have skills that match the required ones
     */
    var newFilter = {
      $and: [
        availabilitiesFilter,
        userTeamsSkillsFilter
      ]
    };


    AssignmentReactiveVars.UserFilter.set(newFilter);
  }

  /**
   * @summary seed AssignmentCalendarDisplayedDays according to term and accuracy
   * @description if _idTerms or accuracy are not defined, respectively CurrentSelectedTerm and CurrentSelectedAccuracy will be used
   * @locus client
   * @param _idTerms {AssignmentTerms}
   * @param accuracy {Number}
   */
  //it is triggered (with not args) whenever AssignmentTerm collection is ready, therefore we can assume it's reactive (the Tracker monitors it)
  static setCalendarTerms(_idTerms, accuracy) {
    _.each(AssignmentCalendarDisplayedDays.find().fetch(), function (doc) {
      AssignmentCalendarDisplayedDays.remove(doc._id)
    });

    var displayedTerm;
    if (!_idTerms) {
      if (AssignmentReactiveVars.CurrentSelectedTerm.get() != null)
        displayedTerm = AssignmentTerms.findOne(AssignmentReactiveVars.CurrentSelectedTerm.get());
      else {
        var terms = AssignmentTerms.find({}).fetch();
        displayedTerm = terms[0];           //TODO which one is default ?
        AssignmentReactiveVars.CurrentSelectedTerm.set(displayedTerm._id);
      }
    } else {
      displayedTerm = AssignmentTerms.findOne(_idTerms);
      AssignmentReactiveVars.CurrentSelectedTerm.set(_idTerms);
    }

    if (!accuracy) {
      if (AssignmentReactiveVars.CurrentSelectedAccuracy.get() != null)
        accuracy = AssignmentReactiveVars.CurrentSelectedAccuracy.get();
      else {
        accuracy = displayedTerm.calendarAccuracy
        AssignmentReactiveVars.CurrentSelectedAccuracy.set(accuracy);
      }
    } else {
      AssignmentReactiveVars.CurrentSelectedAccuracy.set(accuracy);
    }

    // AssignmentServiceClient.setCalendarAccuracy(accuracy);
    var quarterIncrement = ((accuracy < 1) ? 60 * accuracy : 60);
    let quarters = [];
    for (var i = 0; i <= 45; i = i + quarterIncrement)
      quarters.push({quarter: i, quarterLengthMinute: 60 * accuracy})

    var hourIncrement = ((accuracy <= 1) ? 1 : accuracy);
    let hours = [];
    for (var i = 0; i < 24; i = i + hourIncrement)
      hours.push({date: i, quarter: quarters});

    var start = new moment(displayedTerm.start);
    var end = new moment(displayedTerm.end);
    while (start.isBefore(end)) {
      AssignmentCalendarDisplayedDays.insert({
        hours: hours,
        date: start,
        assignmentTermId: displayedTerm._id //we store the selected term id in each days
      });
      start.add(1, 'days');
    }
  }

  /**
   * @summary Init Materialize multiselect HTML component on assignment page
   * @locus client
   */
  static initAssignmentSkillsFilter() {
    //init skills filter for assignment if we are on the assignment page
    $(document).ready(function () {
      $('#filter_skills_user').multiselect({
        enableFiltering: true,
        filterPlaceholder: 'Search for skills...',
        numberDisplayed: 2,
        nonSelectedText: 'Choose some skills',
        nSelectedText: ' skills selected'
      });
    });
    $(document).ready(function () {
      $('#filter_skills_task').multiselect({
        enableFiltering: true,
        filterPlaceholder: 'Search for skills...',
        numberDisplayed: 2,
        nonSelectedText: 'Choose some skills',
        nSelectedText: ' skills selected'
      });
    });
  }

  /**
   * @summary Init Materialize popover HTML component on assignment page and setup a custom leave which hide popover when mouse leave
   * @locus client
   */
  static initAssignmentPopover() {
    var originalLeave = $.fn.popover.Constructor.prototype.leave;
    $.fn.popover.Constructor.prototype.leave = function (obj) {
      var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
      var container, timeout;

      originalLeave.call(this, obj);

      if (obj.currentTarget) {
        container = $(obj.currentTarget).siblings('.popover')
        timeout = self.timeout;
        container.one('mouseenter', function () {
          //We entered the actual popover – call off the dogs
          clearTimeout(timeout);
          //Let's monitor popover content instead
          container.one('mouseleave', function () {
            $.fn.popover.Constructor.prototype.leave.call(self, self);
          });
        })
      }
    };

    $('body').popover({
      html: true,
      selector: '.creneau[data-popover]',
      trigger: 'click hover',
      placement: 'auto',
      delay: {show: 50, hide: 400}
    });

    $(document).on("click", ".popover .peopleNeed.assigned", function (event) {
      AssignmentServiceClient.readSelectedPeopleNeedAndTimeSlotFromPopover(event, true);
      AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
    });

    $(document).on("click", ".popover .peopleNeed:not(.assigned)", function (event) {
      AssignmentServiceClient.readSelectedPeopleNeedAndTimeSlotFromPopover(event, false);
      AssignmentServiceClient.taskToUserPerformUserFilter();
    });
  }

  /**
   * @summary Manage the task list checkbox "display assigned task" according to ReactiveVar AssignmentReactiveVars.CurrentAssignmentType
   * @locus client
   */
  static disableDisplayAssignedCheckbox() {
    var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();
    var checkbox = $("#display-assigned-task-checkbox");
    var label = $("#display-assigned-task-checkbox-label");
    switch (currentAssignmentType) {
      case AssignmentType.USERTOTASK:
        checkbox.attr("disabled", true);
        label.css("opacity", 0.3);
        break;
      case AssignmentType.TASKTOUSER:
        checkbox.removeAttr("disabled");
        label.css("opacity", 1);
        break;
      case AssignmentType.ALL:
        checkbox.removeAttr("disabled");
        label.css("opacity", 1);
        break;
    }

  }


  /**
   * @summary Read from popover to perform filter on user list in task to user mode only.
   * Reactive Var :
   *
   *  - Set AssignmentReactiveVars.SelectedPeopleNeed
   *  - Set AssignmentReactiveVars.SelectedTimeSlot
   *
   * @locus Anywhere
   * @returns {timeSlot|null}
   */
  static readSelectedPeopleNeedAndTimeSlotFromPopover(event, isAssigned) {
    var target = $(event.target);

    var peopleNeedId;
    if (target.data('_id')) {
      peopleNeedId = target.data('_id');
    } else {
      peopleNeedId = $(target.parents(".peopleNeed")).data('_id');
    }

    var task, ret;
    task = Tasks.findOne({
      timeSlots: {
        $elemMatch: {
          peopleNeeded: {
            $elemMatch: {
              _id: peopleNeedId
            }
          },
        }
      }
    });
    ret = PeopleNeedService.getPeopleNeedByIdAndTask(peopleNeedId, task);

    var peopleNeeded = ret.peopleNeed;
    var timeSlot = TimeSlotService.getTimeSlot(task, ret.timeSlotId);
    AssignmentReactiveVars.SelectedPeopleNeed.set(peopleNeeded);
    AssignmentReactiveVars.SelectedTimeSlot.set(timeSlot);
  }


  static isDisplayed(uniqueId) {
    return ( Meteor.users.findOne({
      _id: Meteor.userId(),
      dismissible: uniqueId
    })) ? false : true;
  }

  static congratsAssignment(mode, ressourceId) {
    if (AssignmentServiceClient.isDisplayed("congrat-assignment")) {
      switch (mode) {
        case AssignmentType.TASKTOUSER:
          sAlert.info("<p>You successfully assigned a task to a user ! You can see on the calendar that the task time slot is showing the assignment progress.<p>" +
            "<p>Click on 'User to Task mode' and select the user (<a href='/assignment/userToTask/" + ressourceId + "'>or click here</a>)</p>" +
            "<p>You can see the assigned task in place of the user availability.</p>",
            {html: true, timeout: 'none'});
          break;
        case AssignmentType.USERTOTASK:
          sAlert.info("<p>You successfully assigned a user to a task ! You can see on the calendar that the user is no longer available and has a task assigned.<p>" +
            "<p>Click on 'Task to User mode' and select the task (<a href='/assignment/taskToUser/" + ressourceId + "'>or click here</a>)</p>" +
            "<p>You can see the progress of the assignment on the time slot.</p>",
            {html: true, timeout: 'none'});
          break;
      }

    }
    Meteor.users.update(Meteor.userId(), {
      $push: {
        dismissible: "congrat-assignment"
      }
    })
  }

  static congratsRemoveAssignment(mode, ressourceId) {
    if (AssignmentServiceClient.isDisplayed("congrat-remove-assignment")) {
      switch (mode) {
        case AssignmentType.TASKTOUSER:
          sAlert.info("<p>You successfully remove the user from the task ! You can see on the calendar that the task time slot assignment progress decreased.<p>" +
            "<p>Click on 'User to Task mode' and select the user (<a href='/assignment/userToTask/" + ressourceId + "'>or click here</a>)</p>" +
            "<p>You can see the user being available again.</p>",
            {html: true, timeout: 'none'});
          break;
        case AssignmentType.USERTOTASK:
          sAlert.info("<p>You successfully remove the task from the user ! You can see on the calendar that the user is available again.<p>" +
            "<p>Click on 'Task to User mode' and select the task (<a href='/assignment/taskToUser/" + ressourceId + "'>or click here</a>)</p>" +
            "<p>You can see on the calendar that the task time slot assignment progress decreased.</p>",
            {html: true, timeout: 'none'});
          break;
      }

    }
    Meteor.users.update(Meteor.userId(), {
      $push: {
        dismissible: "congrat-remove-assignment"
      }
    })
  }

  static isAfterSame(one, two){
    one = new moment(one);
    two = new moment(two)
    return one.isAfter(two) || one.isSame(two);
  }

  static isBeforeSame(one, two){
    one = new moment(one);
    two = new moment(two)
    return one.isBefore(two) || one.isSame(two);
  }

  static getTaskAssignmentProgressForTerm(term, task) {
    //get all timeslot for this term, get all their people need ids
    let allPeopleNeeded = _.reduce(task.timeSlots, (memo, timeSlot) => {
      if(AssignmentServiceClient.isAfterSame(timeSlot.start, term.start)
        && AssignmentServiceClient.isBeforeSame(timeSlot.end, term.end)) {
        let peopleNeededIds = _.reduce(timeSlot.peopleNeeded, (memo, peopleNeed) => {
          memo.push(peopleNeed._id);
          return memo
        }, []);
        return memo.concat(peopleNeededIds);
      } else {
        return memo;
      }
    }, []);
    let assignedPeopleNeed = Assignments.find({peopleNeedId: {$in:allPeopleNeeded}}).count();
    return parseInt(assignedPeopleNeed / allPeopleNeeded.length * 100);
  }
}

