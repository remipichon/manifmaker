import {TeamService} from "../../../both/service/TeamService"

class TaskGroupListComponent extends BlazeComponent {
    template() {
        return "taskGroupListComponent";
    }

    events() {
        return [{
            "keyup #search_task_group_name": this.filterName,
        }];
    }

    filterTeam(error, docModified, newOption) {
        return _.bind(function (error, docModifier, newOption) {
            var _id = newOption;
            this.taskGroupListTeamFilter.set(_id);
        },this);
    }

    optionQueryTeamsWithoutAlreadyAssigned(){
        return TeamService.optionQueryTeamsWithoutAlreadyAssigned();
    }

    filterName(event) {
        event.preventDefault();
        var _id = $(event.target).val();
        this.taskGroupListNameFilter.set(_id);
    }

    onCreated() {
        this.taskGroupListTeamFilter = new ReactiveTable.Filter("task-group-list-team-filter", ["teamId"]);
        this.taskGroupListNameFilter = new ReactiveTable.Filter('search-task-group-name-filter', ['name']);

    }


    taskGroupsList() {
        var fields = [
            {
                key: 'name',
                label: 'Name',
                cellClass: 'col-sm-3',
                headerClass: 'col-sm-3',
                fnAdjustColumnSizing: true
            },
            {
                key: 'teamId',
                label: 'Team',
                cellClass: 'col-sm-2',
                headerClass: 'col-sm-2',
                fnAdjustColumnSizing: true,
                searchable: false, //TODO doesn't work (try with a teamId)
                fn: function (teamId, Task) {
                    return Teams.findOne(teamId).name;
                }
            }
        ];

        fields.push({
            label: 'Actions',
            cellClass: 'col-sm-2 text-center',
            headerClass: 'col-sm-2 text-center',
            sortable: false,
            searchable: false, //TODO doesn't work (try with a teamId)
            tmpl: Template.taskGroupButtons,
            fnAdjustColumnSizing: true
        });

        return {
            collection: TaskGroups,
            rowsPerPage: TaskGroups.find().fetch().length,
            showFilter: false,
            showRowCount: true,
            fields: fields,
            filters: [
                'task-group-list-team-filter',
                'search-task-group-name-filter',
            ]
        }
    }
}

TaskGroupListComponent.register("TaskGroupListComponent");