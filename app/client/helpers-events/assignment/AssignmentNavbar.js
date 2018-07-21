import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

class AssignmentNavbar extends BlazeComponent {

  assignmentTerms() {
    return AssignmentTerms.find({});
  }

  breadCrumbAssignment() {
    var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get(),
      selectedUser = AssignmentReactiveVars.SelectedUser.get(),
      selectedTask = AssignmentReactiveVars.SelectedTask.get(),
      selectedTaskBreadCrumb = AssignmentReactiveVars.SelectedTaskBreadCrumb.get(),
      selectedDate = AssignmentReactiveVars.SelectedDate.get(),
      selectedTimeSlot = AssignmentReactiveVars.SelectedTimeSlot.get(),
      isUnassignment = AssignmentReactiveVars.IsUnassignment.get(),
      result = [];

    if (isUnassignment) {
      result.push({
        label: "! Remove assignment !",
        class: "is-unassignment",
        url: ""
      });
    }

    if (currentAssignmentType === AssignmentType.USERTOTASK) {
      if (selectedUser === null) {
        result.push({
          label: "Select an user",
          url: ""
        });
      } else {
        var userName = Meteor.users.findOne(selectedUser._id).username;
        result.push({
          label: userName,
          url: "/assignment/userToTask/" + selectedUser._id
        });

        if (!AssignmentReactiveVars.isSelectedAvailability.get()) {
          if(isUnassignment)
            result.push({
              label: "Select the task to confirm unassignment",
              url: ""
            });
          else
            result.push({
              label: "Select one of the availabilities",
              url: ""
            });
          AssignmentReactiveVars.SelectedTaskBreadCrumb.set(null);
          //apres de amples reflexion, disons que je vois pas ou reinit ce SelectedTaskBreadcrum
          //ca risque d'avoir des effets de bords pénibles, mais l'avantage c'est que ca ne fait
          //que planter le breadcrumb, d'ou le pertinence de ce code ici
        } else {
          result.push({
            label: selectedDate.format("ddd D HH:mm"),
            url: "/assignment/userToTask/" + selectedUser._id + "/" + selectedDate.format('x')
          });

          if (!selectedTaskBreadCrumb) {
            result.push({
              label: "Select one of the available tasks",
              url: ""
            });
          } else {
            result.push({
              label: selectedTaskBreadCrumb.name,
              url: ""
            });
            result.push({
              label: "Select one of the people need",
              url: ""
            });
          }
        }
      }
      return result;
    }

    if (currentAssignmentType === AssignmentType.TASKTOUSER) {
      if (selectedTask === null) {
        result.push({
          label: "Select a task",
          url: ""
        });
      } else {
        var taskName = Tasks.findOne(selectedTask._id).name;
        result.push({
          label: taskName,
          url: "/assignment/taskToUser/" + selectedTask._id
        });

        if (selectedTimeSlot === null) {//TODO pas top
          result.push({
            label: "Select one of the time slot from the calendar and a people need from the popover",
            url: ""
          });
        } else {

          var task = Tasks.findOne(selectedTask);
          var timeSlot = TimeSlotService.getTimeSlot(task, selectedTimeSlot._id);

          result.push({
            label: new moment(timeSlot.start).format("HH:mm") + " to " + new moment(timeSlot.end).format("HH:mm"),
            url: "/assignment/taskToUser/" + selectedTask._id + "/" + selectedTimeSlot._id
          });

          if (isUnassignment)
            result.push({
              label: "Select the user to confirm unassignment",
              url: ""
            });
          else
            result.push({
              label: "Select one of the available user",
              url: ""
            });

        }
      }
      return result;
    }

    if (currentAssignmentType == AssignmentType.ALL) {
      result.push({
        label: "Welcome, start by selecting an assignment mode",
        url: ""
      });
      return result;
    }

  }

}

AssignmentNavbar.register("AssignmentNavbar");

