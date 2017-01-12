import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {CalendarServiceClient} from "../../../client/service/CalendarServiceClient"
import {ReadAvailabilitiesCalendarComponent} from "./ReadAvailabilitiesCalendarComponent"

class EditAvailabilitiesCalendarComponent extends ReadAvailabilitiesCalendarComponent {
    /* available in data
     this.data().parentInstance

     See SwipeEditAvailabilitiesCalendarComponent for another implementation

     */

    events() {
        return super.events().concat({
            'click .quart_heure:not(.no-action)': this.calendarOnClick,
            // 'click .quart_heure:not(.no-action)': this.addAvailability,
           'mouseenter .quart_heure': this.selectAvailability,
            //'mouseup .quart_heure': this.endSelectAvailability,
            'mouseleave .jours': this.resetSelecting,
            // 'dblclick .quart_heure': this.removeAvailability,
        });
    }

    calendarOnClick(event) {
        var date = $
        event.stopPropagation();
        this.peopleNeedAssignedClick++;
        if (this.peopleNeedAssignedClick == 1) {

            (function(event,self){

                setTimeout(_.bind(function () {
                    if (this.peopleNeedAssignedClick == 1) {

                        if(this.isSelecting){
                            this.endSelectingAvailability(event);
                        } else
                        if(event.shiftKey){
                            console.log("start selecting")
                            this.startSelectingAvailability(event);
                        } else {
                            console.log("add")
                          this.addAvailability(event);
                        }

                    } else {
                        // AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
                        if(!this.isSelecting) {
                            console.log("rem0ve")
                            this.removeAvailability(event);
                        }
                    }
                    this.peopleNeedAssignedClick = 0;
                }, self), 300);


            })(event,this)


        }

    }

    startSelectingAvailability(event){
        event.stopPropagation();

        //prevent firing add on an existing availability
        if($($($(event.target)[0]).children()[0]).hasClass("creneau")){
            console.log("skipping add availability");
            return;
        }
        //
        // if($($(event.target)[0]).hasClass("creneau")){
        //     console.log("skipping add availability");
        //     return;
        // }

        var date = $(event.target).attr("quarter");
        if(!date) {
            console.error("could not read date",$(event.target));
            return;
        }
        var firstDate = new moment(date);
        // this.firstDate.set(date);
        //this.hasDragged = true;
        // this.secondDate.set(date);

        var user = this.parentComponent().parentComponent().data();
        var secondDate = new moment(firstDate).add(this.addHourAccordingToAccuracy(),"hour");

        console.log("EditAvailabilitiesCalendarComponent","start selecting",firstDate.toDate());
        // AvailabilityService.addAvailabilities(user,firstDate.toDate(),secondDate.toDate())

        this.firstDate.set(firstDate);
        this.isSelecting = true;

    }
    addAvailability(event){
        event.stopPropagation();

        //prevent firing add on an existing availability
        if($($($(event.target)[0]).children()[0]).hasClass("creneau")){
            console.log("skipping add availability");
            return;
        }
        //
        // if($($(event.target)[0]).hasClass("creneau")){
        //     console.log("skipping add availability");
        //     return;
        // }

        var date = $(event.target).attr("quarter");
        if(!date) {
            console.error("could not read date",$(event.target));
            return;
        }
        var firstDate = new moment(date);
        // this.firstDate.set(date);
        //this.hasDragged = true;
        // this.secondDate.set(date);

        var user = this.parentComponent().parentComponent().data();
        var secondDate = new moment(firstDate).add(this.addHourAccordingToAccuracy(),"hour");

        console.log("EditAvailabilitiesCalendarComponent","add",firstDate.toDate(),secondDate.toDate())
        AvailabilityService.addAvailabilities(user,firstDate.toDate(),secondDate.toDate())
    }

    selectAvailability(event){
        event.stopPropagation();

        var date = new moment($(event.target).attr("quarter"));
        this.hasDragged = true;
        
        
        this.secondDate.set(date);
    }

    endSelectingAvailability(event){
        event.stopPropagation();
        if(!this.firstDate.get() || !this.hasDragged) return;
        var lastDate;
        var firstDate = this.firstDate.get();
        if($(event.target).hasClass("creneau")) //user end selecting on an existing availabilities
            lastDate = new moment($(event.target).parent().attr("quarter"));
        else {
            var target;
            if($(event.target).attr("quarter"))
                target = $(event.target);
            else
                target = $(event.target).parent();

            lastDate = new moment(target.attr("quarter"));

        }

        if(firstDate.isBefore(lastDate)){
            lastDate = lastDate.add(this.addHourAccordingToAccuracy(), "hour");
        } else {
            firstDate = firstDate.add(this.addHourAccordingToAccuracy(), "hour");
        }



        var user = this.parentComponent().parentComponent().data();
        var start,end;
        if(firstDate.isAfter(lastDate)){
            start = new moment(lastDate);
            end = new moment(firstDate);
        } else {
            start = new moment(firstDate);
            end = new moment(lastDate) ;
        }
        this.resetSelecting();
        AvailabilityService.addAvailabilities(user,start.toDate(),end.toDate())
    }

    resetSelecting(){
        console.log("reset select");
        this.firstDate.set(null);
        this.hasDragged = false;
        this.secondDate.set(null);
        this.isSelecting = false;

    }

    removeAvailability(event){
        // this.resetSelect();
        sAlert.closeAll();
        event.stopPropagation();
        var date = $(event.target).attr("quarter");
        if(!date) {
            console.error("could not read date",$(event.target))
        }
        var firstDate = new moment(date);
        var user = this.parentComponent().parentComponent().data();
        var secondDate = new moment(firstDate).add(this.addHourAccordingToAccuracy(),"hour");
        console.log("EditAvailabilitiesCalendarComponent","remove",firstDate.toDate(),secondDate.toDate())

        AvailabilityService.removeAvailabilities(user,firstDate.toDate(),secondDate.toDate());
    }

    addHourAccordingToAccuracy(){
        return AssignmentCalendarDisplayedAccuracy.findOne().accuracy
    }


    //works for .heure et .quart d'heure
    isSelected(date, timeHours) {
        if (!this.firstDate.get() || !this.secondDate.get()) return;
        var start,end;

        var quarter = this.currentData().quarter;
        var current = this.getCalendarDateTime(date, timeHours, quarter);
        var firstDate = this.firstDate.get();
        var secondDate = this.secondDate.get();

        // console.log(firstDate.toDate(),secondDate.toDate())
        if(firstDate.isAfter(secondDate)){
            start = new moment(secondDate);
            end = new moment(firstDate);
            // if(start.diff(end,"minutes") / 60 ==  this.addHourAccordingToAccuracy()){
            //     //nothing
            // } else if(start.diff(end,"minutes") / 60 ==  this.addHourAccordingToAccuracy() * 2){
            //
            // } else {
                end.add(this.addHourAccordingToAccuracy(), "hour");
            // }

        } else {
            start = new moment(firstDate);
            end = new moment(secondDate);
            end.add(this.addHourAccordingToAccuracy(), "hour");
        }

        if (current.isBetween(start, end) || current.isSame(start))
            return "selected";
        return ""
    }

    constructor() {
        super();

        this.peopleNeedAssignedClick = 0; //to double click purpose..

        this.firstDate = new ReactiveVar(null);
        this.secondDate = new ReactiveVar(null);

        this.isSelecting = false;
    }
}

EditAvailabilitiesCalendarComponent.register("EditAvailabilitiesCalendarComponent");