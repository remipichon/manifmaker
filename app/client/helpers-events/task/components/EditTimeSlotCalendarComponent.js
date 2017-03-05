import {BaseCalendarComponent} from "../../common/BaseCalendarComponent"
import {AssignmentService} from "../../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../../both/service/TimeSlotService"
import {CalendarServiceClient} from "../../../../client/service/CalendarServiceClient"

class EditTimeSlotCalendarComponent extends BaseCalendarComponent {
    /* available in data
     this.data().parentInstance

     */

    events() {
        return super.events().concat({
            "click .creneau": this.selectTimeSlot
        })
    }

    enableAction(date, timeHours){
        var startDate = this.getCalendarDateTime(date, timeHours, 0);
        var endDate = new moment(startDate).add(1,"hour");

        if (AssignmentTerms.findOne({
                $and:[
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


    selectTimeSlot(e){
        var $target = $(e.target);
        this.data().parentInstance.updatedTimeSlotId.set($target.parents(".creneau").data("timeslotdid"));
        this.data().parentInstance.isTimeSlotUpdated.set(true);
    }

    timeSlot(date, timeHours, idTask) {
        var minutes = this.currentData().quarter;
        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours, minutes);
        var task = this.data().task;
        if (!task) return [];

        var data = CalendarServiceClient.computeTimeSlotData(task,startCalendarTimeSlot);
        if(!data) return [];
        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }

    getPeopleNeededMerged(timeSlotId){
        return this.data().parentInstance.getPeopleNeededMerged(timeSlotId);
    }
    getPeopleNeededMergedWithoutUserId(timeSlotId){
        return this.data().parentInstance.getPeopleNeededMergedWithoutUserId(timeSlotId);
    }

    getAlreadyAssignedPeopleNeedCount(timeSlotId){
        return this.data().parentInstance.getAlreadyAssignedPeopleNeedCount(timeSlotId);
    }
    getUserIdNeedCount(timeSlotId){
        return this.data().parentInstance.getUserIdNeedCount(timeSlotId);
    }

    currentTimeSlot() {
        return this.data().parentInstance.currentTimeSlot();
    }
}

EditTimeSlotCalendarComponent.register("EditTimeSlotCalendarComponent");