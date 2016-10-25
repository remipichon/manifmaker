import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {CalendarServiceClient} from "../../../client/service/CalendarServiceClient"

class EditAvailabilitiesCalendarComponent extends BaseCalendarComponent {
    /* available in data
     this.data().parentInstance

     */

    events() {
        return super.events().concat({
            'mousedown .quart_heure:not(.no-action)': this.startSelectAvailability,
            'mouseenter .quart_heure': this.selectAvailability,
            'mouseup .quart_heure': this.endSelectAvailability,
            'mouseleave .jours': this.resetSelect,
            'dblclick .heure': this.removeAvailability,
        });
    }

    startSelectAvailability(event){
        event.stopPropagation();
        var date = new moment($(event.target).parent().attr("hours"));
        this.startDate.set(date);

    }

    selectAvailability(event){
        event.stopPropagation();
        if(!this.startDate.get()) return;
        var date = new moment($(event.target).parent().attr("hours"));
        this.hasDragged = true;
        this.tempEndDate.set(date);
    }

    endSelectAvailability(event){
        event.stopPropagation();
        if(!this.startDate.get() || !this.hasDragged) return;
        var date;
        if($(event.target).hasClass("creneau")) //user end selecting on an existing availabilities
            date = new moment($(event.target).parent().parent().attr("hours"));
        else
            date = new moment($(event.target).parent().attr("hours"));
        var user = this.parentComponent().parentComponent().data();
        var temp = this.startDate.get();
        this.resetSelect();
        AvailabilityService.addAvailabilities(user,temp.toDate(),date.toDate())
    }

    resetSelect(){
        this.startDate.set(null);
        this.hasDragged = false;
        this.tempEndDate.set(null);
    }

    removeAvailability(event){
        this.resetSelect();
        sAlert.closeAll();
        event.stopPropagation();
        var start = new moment($(event.target).parent().attr("hours"));
        var user = this.parentComponent().parentComponent().data();
        var end = new moment(start).add(1,"hour");
        AvailabilityService.removeAvailabilities(user,start.toDate(),end.toDate());
    }

    creanOnClick() {
        //to implement
    }

    quartHeureOnClick(event) {
        //to implement

        sAlert.info('Add availabilities by selecting slots with your mouse pressed or double click to remove one slot.');
        return;

        //TODO proposer de switcher sur ce mode si besoin, default sur mobile
        var date = new moment($(event.target).parent().attr("hours"));

        if(!this.startDate.get())
            this.startDate.set(date);
        else {
            var endDate = date;
            var user = this.parentComponent().parentComponent().data();
            AvailabilityService.addAvailabilities(user,this.startDate.get().toDate(),endDate.toDate())
            this.startDate.set(null);
        }
    }

    //works for .heure et .quart d'heure
    isSelected(date, timeHours) {
        if(!this.startDate.get() || !this.tempEndDate.get()) return;
        var current = this.getCalendarDateTime(date, timeHours, 0);
        var start = this.startDate.get();
        var end = this.tempEndDate.get();
        if(current.isBetween(start,end) || current.isSame(start))
            return "selected";
        return ""
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
        if(!data) return [];
        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }

    constructor() {
        super();

        this.startDate = new ReactiveVar(null);
        this.tempEndDate = new ReactiveVar(null);
    }
}

EditAvailabilitiesCalendarComponent.register("EditAvailabilitiesCalendarComponent");