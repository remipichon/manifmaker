import {TaskListComponent} from "../task/TaskListComponent"

class TaskListForGroupComponent extends TaskListComponent {

    onCreated(){
        super.onCreated();
        this.taskInGroupFilter = new ReactiveTable.Filter("task-in-group-filter", ["groupId"]);
        this.taskInGroupFilter.set(this.parentComponent().data()._id);
    }

    tasksList (){
        var result = super.tasksList();
        result.filters.push("task-in-group-filter");
        return result;
    }

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

    toggleDisplayAllTasks(event){
        if($(event.target).prop("checked"))
            this.taskInGroupFilter.set("");
        else
            this.taskInGroupFilter.set(this.parentComponent().data()._id);

    }

    updateGroupId(event) {
        var groupId = this.parentComponent().data()._id;
        var task = this.currentData();
        if ($(event.target).prop('checked')) {
            var groupId = Tasks.findOne(task._id).groupId;
            if(groupId){
                bootbox.confirm(`Task is in group '${TaskGroups.findOne(groupId).name}'. Do you want to switch to '${this.parentComponent().data().name}' ?`, _.bind(function(result){
                    if(result){
                        Tasks.update(task._id, {
                            $set: {groupId: this.parentComponent().data()._id}
                        });
                    } else {
                        $(event.target).attr("checked",false);
                    }
                },this));
            }
        } else
            Tasks.update(task._id, {
                $set: {groupId: null}
            });
    }

    events() {
        return super.events().concat({
            'change .add-to-group-checkbox': this.updateGroupId,
            'click #display-all-task-toggle': this.toggleDisplayAllTasks
        });
    }
}

TaskListForGroupComponent.register("TaskListForGroupComponent");