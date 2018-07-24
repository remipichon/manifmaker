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
    AssignmentReactiveVars.isUsersListDeveloped.set(true);
    AssignmentReactiveVars.isTasksListDeveloped.set(false);
    AssignmentReactiveVars.IsUnassignment.set(false);
  }

  onClickTaskToUser(event) {
    AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.noneFilter);
    AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.defaultFilter);
    AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    AssignmentReactiveVars.isUsersListDeveloped.set(false);
    AssignmentReactiveVars.isTasksListDeveloped.set(true);
    AssignmentReactiveVars.IsUnassignment.set(false);
  }

  isSelected(mode) {
    if (mode === AssignmentReactiveVars.CurrentAssignmentType.get()) {
      return "active";
    }
    return "";
  }

}

AssignmentIndicationsBar.register("AssignmentIndicationsBar");