import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

class AssignmentIndicationsBar extends BlazeComponent {
    events() {
        return [{
            "click #userToTask": this.onClickUserToTask,
            "click #taskToUser": this.onClickTaskToUser
        }];
    }

    onClickUserToTask(event) {
        AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.noneFilter);
        AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.defaultFilter);
        AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.USERTOTASK);
    }

    onClickTaskToUser(event) {
        AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.noneFilter);
        AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.defaultFilter);
        AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    }

    isSelected(mode) {
        if (mode === AssignmentReactiveVars.CurrentAssignmentType.get()) {
            return "active";
        }
        return "";
    }

}

AssignmentIndicationsBar.register("AssignmentIndicationsBar");