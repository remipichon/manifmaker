import {SecurityServiceClient} from "../../service/SecurityServiceClient"

class UserAvailabilitiesComponent extends BlazeComponent {

    reactiveConstructor() {
    }

    constructor() {
        super();
        this.displayCalendarVar = new ReactiveVar(true)

    }

    template() {
        return "userAvailabilities"
    }

    events() {
        return [
            {}
        ];
    }

    displayCalendar(){
        return this.displayCalendarVar.get();
    }

    callbackIfNoTerms(){
        return _.bind(function(){
            this.displayCalendarVar.set(false);
        },this);
    }

    userData() {
        return this.data().parentInstance.data()
    }

    assignmentTermDeadlineIsOver() {
        var currentTermId = AssignmentCalendarDisplayedDays.findOne().assignmentTermId //all items should have the same
        var currentTerm = AssignmentTerms.findOne(currentTermId);
        if (new moment().isAfter(currentTerm.addAvailabilitiesDeadline)) {
            return true;
        }
        return false;
    }

    readOnly() {
        if(SecurityServiceClient.softGrantAccessToPage(RolesEnum.ASSIGNMENTTASKUSER)) return false;
        var isReadyForAssignment = this.data().isReadyForAssignment;
        if (isReadyForAssignment) return true;

        return this.assignmentTermDeadlineIsOver()
    }


    self() {
        return this;
    }

}

UserAvailabilitiesComponent.register("UserAvailabilitiesComponent");
