import {AssignmentService} from "../../../both/service/AssignmentService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {ReadAvailabilitiesCalendarComponent} from "./ReadAvailabilitiesCalendarComponent"

class EditAvailabilitiesCalendarComponent extends ReadAvailabilitiesCalendarComponent {
  /* available in data
   this.data().parentInstance

   See SwipeEditAvailabilitiesCalendarComponent for another implementation

   */

  constructor() {
    super();
    this.availabilityClick = 0; //to double click purpose..
    this.firstDate = new ReactiveVar(null);
    this.secondDate = new ReactiveVar(null);
    this.isSelecting = false;
  }

  events() {
    return super.events().concat({
      'click .quart_heure:not(.no-action)': this.calendarOnClick,
      'mouseenter .quart_heure': this.selectAvailability,
      'mouseleave .jours': this.resetSelecting,
    });
  }

  calendarOnClick(event) {
    event.stopPropagation();
    // this.availabilityClick++;
    // if (this.availabilityClick == 1) {
    //     (function(event,self){
    //         setTimeout(_.bind(function () {
    //             var oldAvailability = this.availabilityClick
    //             this.availabilityClick = 0;

    // if (oldAvailability == 1) {
    if (this.isSelecting) {
      this.endSelectingAvailability(event);
    } else if (event.shiftKey) {
      this.startSelectingAvailability(event);
    } else {
      this.addAvailability(event);
    }
    // } else {
    //     if(!this.isSelecting) {
    //         this.removeAvailability(event);
    //     }
    // }
    // }, self), 200);
    // })(event,this)
    // }
  }

  readFirstDate(event) {
    event.stopPropagation();

    //prevent firing add on an existing availability
    // if($($($(event.target)[0]).children()[0]).hasClass("creneau")){
    //     console.warn("EditAvailabilitiesCalendarComponent : skipping add availability.");
    //     return;
    // }

    var date = $(event.target).attr("quarter") || $(event.target).parents().attr("quarter");
    if (!date) {
      console.warn("EditAvailabilitiesCalendarComponent : could not read date from 'quarter' attribute.", $(event.target));
      return;
    }
    return new moment(date);
  }

  startSelectingAvailability(event) {
    this.firstDate.set(this.readFirstDate(event));
    this.isSelecting = true;
  }

  addAvailability(event) {
    var firstDate = this.readFirstDate(event);
    //TODO #378 read date comme il faut
    var user = this.parentComponent().parentComponent().data();
    var secondDate = new moment(firstDate).add(this.addHourAccordingToAccuracy(), "hour");
    if (!firstDate || !secondDate) return;

    if (AvailabilityService.checkUserAvailabilty(user, firstDate, secondDate)) {
      //sAlert.info("Double click to delete an availability");
      this.removeAvailability(event);
    } else if (AssignmentService.userHasAssignmentBetweenDates(user, firstDate, secondDate)) {
      sAlert.info("You cannot edit an assigned availability");
    } else {
      AvailabilityService.addAvailabilities(user, firstDate.toDate(), secondDate.toDate())
    }
  }

  selectAvailability(event) {
    event.stopPropagation();
    var date = new moment($(event.target).attr("quarter"));
    this.hasDragged = true;
    this.secondDate.set(date);
  }

  endSelectingAvailability(event) {
    event.stopPropagation();
    if (!this.firstDate.get() || !this.hasDragged) return;
    var lastDate;
    var firstDate = this.firstDate.get();
    if ($(event.target).hasClass("creneau")) //user end selecting on an existing availabilities
      lastDate = new moment($(event.target).parent().attr("quarter"));
    else {
      var target;
      if ($(event.target).attr("quarter"))
        target = $(event.target);
      else
        target = $(event.target).parent();

      lastDate = new moment(target.attr("quarter"));

    }

    if (firstDate.isBefore(lastDate)) {
      lastDate = lastDate.add(this.addHourAccordingToAccuracy(), "hour");
    } else {
      firstDate = firstDate.add(this.addHourAccordingToAccuracy(), "hour");
    }


    var user = this.parentComponent().parentComponent().data();
    var start, end;
    if (firstDate.isAfter(lastDate)) {
      start = new moment(lastDate);
      end = new moment(firstDate);
    } else {
      start = new moment(firstDate);
      end = new moment(lastDate);
    }
    this.resetSelecting();
    AvailabilityService.addAvailabilities(user, start.toDate(), end.toDate())
  }

  resetSelecting() {
    this.firstDate.set(null);
    this.hasDragged = false;
    this.secondDate.set(null);
    this.isSelecting = false;
  }

  removeAvailability(event) {
    sAlert.closeAll();
    event.stopPropagation();
    var date = $(event.target).attr("quarter") || $(event.target).parents().attr("quarter");
    if (!date) {
      console.warn("EditAvailabilitiesCalendarComponent : could not read date from 'quarter' attribute.", $(event.target));
      return;
    }
    var firstDate = new moment(date);
    var user = this.parentComponent().parentComponent().data();
    var secondDate = new moment(firstDate).add(this.addHourAccordingToAccuracy(), "hour");
    AvailabilityService.removeAvailabilities(user, firstDate.toDate(), secondDate.toDate());
  }

  addHourAccordingToAccuracy() {
    return AssignmentCalendarDisplayedAccuracy.findOne().accuracy
  }

  //works for .heure et .quart d'heure
  isSelected(date, timeHours) {
    if (!this.firstDate.get() || !this.secondDate.get()) return;
    var start, end;

    var quarter = this.currentData().quarter;
    var current = this.getCalendarDateTime(date, timeHours, quarter);
    var firstDate = this.firstDate.get();
    var secondDate = this.secondDate.get();

    if (firstDate.isAfter(secondDate)) {
      start = new moment(secondDate);
      end = new moment(firstDate);
      end.add(this.addHourAccordingToAccuracy(), "hour");
    } else {
      start = new moment(firstDate);
      end = new moment(secondDate);
      end.add(this.addHourAccordingToAccuracy(), "hour");
    }

    if (current.isBetween(start, end) || current.isSame(start))
      return "selected";
    return ""
  }
}

EditAvailabilitiesCalendarComponent.register("EditAvailabilitiesCalendarComponent");