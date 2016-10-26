class UserAvailabilitiesComponent extends BlazeComponent {

    reactiveConstructor() {
    }

    constructor() {
        super();

    }

    template() {
        return "userAvailabilities"
    }

    events() {
        return [
            {}
        ];
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
        var isReadyForAssignment = this.data().isReadyForAssignment;
        if (isReadyForAssignment) return true;

        return this.assignmentTermDeadlineIsOver()
    }


    self() {
        return this;
    }

}

UserAvailabilitiesComponent.register("UserAvailabilitiesComponent");
