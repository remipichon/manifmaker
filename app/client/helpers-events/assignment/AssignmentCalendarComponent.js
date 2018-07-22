import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AssignmentServiceClient} from "../../../client/service/AssignmentServiceClient"
import {AssignmentReactiveVars} from "./AssignmentReactiveVars"
import {CalendarServiceClient} from "../../../client/service/CalendarServiceClient"


class AssignmentCalendarComponent extends BaseCalendarComponent {
  constructor() {
    super();
    this.displayAccuracySelector = true
  }


  events() {
    return super.events().concat({
      //userToTask
      "click .heure .affecte": this.clickOnAssignment,
      //click on availabilities is managed by the super.quartHeureOnClick
      //taskToUser popover management
      "click .creneau": this.openPopOver,
      "click .calendar": this.closePopOver,
      "click .close-popover": this.closePopOver,
      "click .popOver": this.stopPropa,
      //taskToUser in-popover events
      "click .popOver .peopleNeed": this.peopleNeedOnClick,
      "click .popOver .peopleNeed.assigned": this.peopleNeedAssignedOnClick,
    })
  }


  getActiveTimeSlotId() {
    return AssignmentReactiveVars.SelectedTimeSlot.get()._id;
  }

  popOverIsOpen() {
    return AssignmentReactiveVars.IsPopOverOpened.get();
  }

  labelSkills() {
    return Skills.findOne({_id: this.currentData().toString()}).label;
  }

  userName() {
    return Meteor.users.findOne({_id: this.currentData().userId}).username;
  }

  displayAssignedUser() {
    var assignment = Assignments.findOne({peopleNeedId: this.currentData()._id})
    return Meteor.users.findOne({_id: assignment.userId}).username;
  }

  teamName() {
    return Teams.findOne({_id: this.currentData().teamId}).name;
  }

  enableAction(date, timeHours) {
    var startDate = this.getCalendarDateTime(date, timeHours, 0);
    var endDate = new moment(startDate).add(1, "hour");

    if (AssignmentTerms.findOne({
        $and: [
          {
            start: {
              $lte: startDate.toDate()
            }
          },
          {
            end: {
              $gte: endDate.toDate()
            }
          }
        ],
        $or: [
          {
            assignmentTermPeriods: {
              $size: 0
            }
          },
          {
            assignmentTermPeriods: {
              $elemMatch: {
                $and: [
                  {
                    start: {
                      $lte: startDate.toDate()
                    }
                  },
                  {
                    end: {
                      $gte: endDate.toDate()
                    }
                  }
                ],
              }
            }
          }
        ]
      })
    )
      return true;

    return false;

  }

  //works for .heure et .quart d'heure
  isSelected(date, timeHours) {
    if (this.getCalendarDateTime(date, timeHours, 0).isSame(AssignmentReactiveVars.SelectedDate.get())) {
      return "selected"
    }
    return ""
  }

  isTaskToUser() {
    return AssignmentReactiveVars.CurrentAssignmentType.get() === AssignmentType.TASKTOUSER;
  }


  timeSlot(date, timeHours, idTask) {
    var minutes = this.currentData().quarter;
    var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours, minutes);
    var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

    switch (currentAssignmentType) {
      case AssignmentType.USERTOTASK:
        var user = AssignmentReactiveVars.SelectedUser.get() == null ? null : Meteor.users.findOne(AssignmentReactiveVars.SelectedUser.get());
        if (user === null) return [];
        return CalendarServiceClient.computeAvailabilitiesAssignmentsData(user, startCalendarTimeSlot);
      case AssignmentType.TASKTOUSER:
        var task = AssignmentReactiveVars.SelectedTask.get() == null ? null : Tasks.findOne(AssignmentReactiveVars.SelectedTask.get());
        if (!task) return [];
        return CalendarServiceClient.computeTimeSlotsData(task, startCalendarTimeSlot);
      case AssignmentType.ALL:
        return [];
    }
  }


  peopleNeededNonAssigned() {
    return _.reject(this.currentData().peopleNeeded, function (peopleNeed) {
      return Assignments.findOne({peopleNeedId: peopleNeed._id}) != null;
    });
  }

  peopleNeededAssigned() {
    return _.reject(this.currentData().peopleNeeded, function (peopleNeed) {
      return Assignments.findOne({peopleNeedId: peopleNeed._id}) == null;
    });
  }

  peopleNeedAssignedOnClick(event) {
    AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
  }

  openPopOver(event) {
    if (AssignmentReactiveVars.CurrentAssignmentType.get() == AssignmentType.TASKTOUSER) {
      if (event) event.stopPropagation();
      Router.go(`/assignment/taskToUser/${AssignmentReactiveVars.SelectedTask.get()._id}/${this.currentData()._id}`)
    }
  }

  closePopOver(event) {
    event.stopPropagation();
    AssignmentReactiveVars.IsPopOverOpened.set(false);
  }

  stopPropa(event) {
    event.stopPropagation();
  }

  peopleNeedOnClick(event) {
    AssignmentReactiveVars.SelectedPeopleNeed.set(this.currentData());
    AssignmentReactiveVars.SelectedTimeSlot.set(TimeSlotService.getTaskAndTimeSlotAndPeopleNeedByPeopleNeedId(this.currentData()._id).timeSlot);
    AssignmentServiceClient.taskToUserPerformUserFilter();
  }

  clickOnAssignment(event){
    console.log("clickOnAssignment")
    event.stopPropagation()

    //TODO #378 selectedDate to find clicked assignment...
    AssignmentReactiveVars.SelectedDate.set(new moment($(event.target).attr('start')));

    AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
  }


  //userToTask (we click on a creneau, not on the entire availability)
  quartHeureOnClick(event) {
    if (AssignmentReactiveVars.CurrentAssignmentType.get() == AssignmentType.USERTOTASK) {

      //what time did we click on ?
      var $target = $(event.target);
      let startDate, endDate;

      console.log("quartHeureOnClick");
      if (typeof $target.attr("quarter") !== "undefined") {
        startDate = new moment($target.attr('quarter'));
        endDate = new moment($target.attr('quarterend'));
      }

      //TODO #378 fuck, we should be using the route...

      AssignmentReactiveVars.isSelectedAvailability.set(true);
      AssignmentReactiveVars.SelectedDate.set(startDate);
      AssignmentReactiveVars.RelevantSelectedDates.set({
        start: startDate,
        end: endDate
      });

      this.filterTaskList(startDate, endDate);

    }
  }

  /**
   * @summary filter task list which have timeslots within given start and end dates as long as the user has enclosing enclosingAvailability (user read from AssignmentReactiveVars.SelectedUser)
   * @param startDate
   * @param endDate
   * @returns {Array}
   */
  filterTaskList(startDate, endDate) {

    console.log("filterTaskList get all tasks from",startDate.toDate(),"   to   ", endDate.toDate());

    var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

    switch (currentAssignmentType) {
      case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected enclosingAvailability slot

        //TODO #378 non strict mode is tricky here, make sure to get the proper target
        // TODO #378 read the selectedDate which is either clicked calendarSlotStart or the previous assi/avail end
        // TODO #378 endDate, either clicker calendarSlotEnd or the new assi/avail start
        // TODO #378 correctly get the avail or assi status of the click
        // TODO #378 filter task list with proper start/end

        var userId = AssignmentReactiveVars.SelectedUser.get()._id;
        var user = Meteor.users.findOne({_id: userId});

        /*
        ** Availabilities filter :
        Task's timeslots happening between start/end dates who are still withing user availabilities
        */
        
        //availabilities filter
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
        return [];
    }
  }

  percentAffected() {
    var nbr_assigned = this.peopleNeededAssigned().length;
    var nbr_total = this.currentData().peopleNeeded.length;
    if (nbr_total > 0)
      return 100 * nbr_assigned / nbr_total;
    else
      return 0;
  }


}

AssignmentCalendarComponent.register("AssignmentCalendarComponent");





