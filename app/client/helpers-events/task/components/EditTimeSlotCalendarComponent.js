import {BaseCalendarComponent} from "../../common/BaseCalendarComponent"
import {CalendarServiceClient} from "../../../../client/service/CalendarServiceClient"

class EditTimeSlotCalendarComponent extends BaseCalendarComponent {
  /* available in data
   this.data().parentInstance

   */
  constructor(){
    super();
    this.displayAccuracySelector = true;
  }

  events() {
    return super.events().concat({
      "click .creneau": this.selectTimeSlot,
    })
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

  quartHeureOnClick(e) {
    var $target = $(e.target);
    console.log("clickFreeTimeSlot", $target)
    this.data().parentInstance.addTimeSlot();
    let start = new moment($target.attr('quarter'));
    let end = new moment($target.attr('quarterend'));
    this.data().parentInstance.createTimeSlotDefaultStartDate.set(start);
    this.data().parentInstance.createTimeSlotDefaultEndDate.set(end)
  }

  selectTimeSlot(e) {
    var $target = $(e.target);
    console.log("selectTimeSlot", $target);
    e.stopPropagation()
    this.data().parentInstance.updatedTimeSlotId.set($target.parents(".creneau").data("timeslotdid"));
    this.data().parentInstance.isTimeSlotUpdated.set(true);
  }

  timeSlot(date, timeHours, idTask) {
    var minutes = this.currentData().quarter;
    var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours, minutes);
    var task = this.data().task;
    if (!task) return [];
    return CalendarServiceClient.computeTimeSlotsData(task, startCalendarTimeSlot);
  }

  getPeopleNeededMerged(timeSlotId) {
    return this.data().parentInstance.getPeopleNeededMerged(timeSlotId);
  }

  getPeopleNeededMergedWithoutUserId(timeSlotId) {
    return this.data().parentInstance.getPeopleNeededMergedWithoutUserId(timeSlotId);
  }

  getAlreadyAssignedPeopleNeedCount(timeSlotId) {
    return this.data().parentInstance.getAlreadyAssignedPeopleNeedCount(timeSlotId);
  }

  getUserIdNeedCount(timeSlotId) {
    return this.data().parentInstance.getUserIdNeedCount(timeSlotId);
  }

  currentTimeSlot() {
    return this.data().parentInstance.currentTimeSlot();
  }
}

EditTimeSlotCalendarComponent.register("EditTimeSlotCalendarComponent");