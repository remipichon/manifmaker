import {TaskListComponent} from "../task/TaskListComponent"

class TaskListForGroupComponent extends TaskListComponent {

    addExtraColumn(fields) {
        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TASKWRITE))
            fields.push({
                label: 'Belongs to this group',
                cellClass: 'col-sm-2 text-center',
                headerClass: 'col-sm-2 text-center',
                sortable: false,
                searchable: false, //TODO doesn't work (try with a teamId)
                tmpl: Template.checkBoxToAddToGroup,
                fnAdjustColumnSizing: true
            });
    }


    isChecked(taskId, groupId){
        var groupId = this.parentComponent().data()._id;
        var task = this.currentData();
        if(task.groupId === groupId)
            return "checked"
        return "";
    }

    updateGroupId(event) {
        var groupId = this.parentComponent().data()._id;
        var task = this.currentData();
        if ($(event.target).prop('checked'))
            Tasks.update(task._id, {
                $set: {groupId: groupId}
            });
        else
            Tasks.update(task._id, {
                $set: {groupId: null}
            });
    }

    events() {
        return super.events().concat({
            'change .add-to-group-checkbox': this.updateGroupId
        });
    }
}

TaskListForGroupComponent.register("TaskListForGroupComponent");