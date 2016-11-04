import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {CalendarServiceClient} from "../../../client/service/CalendarServiceClient"

export class ReadAvailabilitiesCalendarComponent extends BaseCalendarComponent {
    /* available in data
     this.data().parentInstance

     */

    events() {
        return super.events().concat({
        });
    }

    enableAction(date, timeHours){
        var user = this.parentComponent().parentComponent().data();
        var userTeams = user.teams;

        var startDate = this.getCalendarDateTime(date, timeHours, 0);
        var endDate = new moment(startDate).add(1,"hour");

        if (AssignmentTerms.findOne({
                teams: {
                    $elemMatch: {
                        $in: userTeams
                    }
                },
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


    timeSlot(date, timeHours, idTask) {
        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours);
        var user = this.data().user;
        if (!user) return [];

        var data = CalendarServiceClient.computeAvailabilitiesData(user,startCalendarTimeSlot);
        var dataAssignment = CalendarServiceClient.computeAssignmentData(user,startCalendarTimeSlot);

        if(!data && !dataAssignment) return [];

        if(data) return [data]
        if(dataAssignment) return [dataAssignment];
        //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }

    constructor() {
        super();
    }
}

ReadAvailabilitiesCalendarComponent.register("ReadAvailabilitiesCalendarComponent");