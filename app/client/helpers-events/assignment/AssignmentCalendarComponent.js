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
    if (this.getCalendarDateTime(date, timeHours, 0).isSame(AssignmentReactiveVars.RelevantSelectedDates.get().start)) {
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

    AssignmentReactiveVars.RelevantSelectedDates.set({
      start: new moment($(event.target).attr('start')),
      end: new moment($(event.target).attr('end'))
    });

    AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
  }


  //userToTask (we click on a creneau, not on the entire availability)
  quartHeureOnClick(event) {
    if (AssignmentReactiveVars.CurrentAssignmentType.get() == AssignmentType.USERTOTASK) {
      //what time did we click on ?
      var $target = $(event.target);
      let startDate = new moment($target.attr('quarter')),
        endDate = new moment($target.attr('quarterend'));
      Router.go(`/assignment/userToTask/${AssignmentReactiveVars.SelectedUser.get()._id}/${startDate}/${endDate}`);
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





