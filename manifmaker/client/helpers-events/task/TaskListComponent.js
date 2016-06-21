class TaskListComponent extends BlazeComponent {
    template() {
        return "taskListComponent";
    }

    events() {
        return [{
            "change #task-list-team-selector": this.filterTeam
        }];
    }


    filterTeam(event) {
        event.preventDefault();
        var _id = $(event.target).val();
        this.taskListTeamFilter.set(_id);
    }

    onCreated() {
        this.taskListTeamFilter = new ReactiveTable.Filter("task-list-team-filter", ["teamId"]);
    }

    tasksList() {
        var fields = [
            {
                key: 'name',
                label: 'Task name',
                fnAdjustColumnSizing: true
            },
            {
                key: 'teamId',
                label: 'Team',
                fnAdjustColumnSizing: true,
                searchable: false, //TODO doesn't work (try with a teamId)
                fn: function (teamId, Task) {
                    return Teams.findOne(teamId).name;
                }
            },
            {
                key: 'timeSlots',
                label: 'Time slots count',
                searchable: false, //TODO doesn't work (try with a teamId)
                sortable: false,
                fn: function (timeSlots, Task) {
                    return timeSlots.length;
                },
                fnAdjustColumnSizing: true
            },
            {
                label: 'Actions',
                searchable: false, //TODO doesn't work (try with a teamId)
                tmpl: Template.taskButtons,
                fnAdjustColumnSizing: true
            }
        ];

        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TASKWRITE))
            fields.push({
                label: 'Validation',
                searchable: false, //TODO doesn't work (try with a teamId)
                tmpl: Template.validationStateForList,
            });

        return {
            collection: Tasks,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            filters: ['task-list-team-filter'],
            fields: fields
        }
    }
}

TaskListComponent.register("TaskListComponent");