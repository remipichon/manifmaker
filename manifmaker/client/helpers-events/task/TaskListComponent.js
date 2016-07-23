class TaskListComponent extends BlazeComponent {
    template() {
        return "taskListComponent";
    }

    events() {
        return [{
            "keyup #search_task_name": this.filterName,
            "click #advanced-search-button": this.switchAdvanced,
        }];
    }

    /**
     * Switch between hiding and showing the advanced search menu
     * @param event
     */
    switchAdvanced(event){
        if(this.isSearchAdvanced()) {
            //TODO this is not the way to do it, it has to be done with Blaze and reactive var, I can show you
            document.getElementById("advanced-search-button").innerHTML='More <i class="mdi mdi-chevron-down mdi-inline"></i>';
        }else{
            document.getElementById("advanced-search-button").innerHTML='Less <i class="mdi mdi-chevron-up mdi-inline"></i>';
        }
        this.taskListAdvancedSearch.set(!this.isSearchAdvanced());
    }

    isSearchAdvanced(){
        return this.taskListAdvancedSearch.get();
    }

    filterTeam(error, docModified, newOption) {
        return _.bind(function (error, docModifier, newOption) {
            var _id = newOption
            this.taskListTeamFilter.set(_id);
        },this);
    }


    filterResponsible(error, docModifier, newOption) {
        return _.bind(function(error,docModifier,newOption) {
            var _id = newOption
            this.taskListResponsibleFilter.set(_id);
        },this);
   }

    optionQueryTeamsWithoutAlreadyAssigned(){
        return {
            name: {
                $not: ASSIGNMENTREADYTEAM
            }
        }
    }

    optionValidationStatus(){
        return [
            {
                label: "First option",
                value: "ONE"
            },
            {
                label: "Second cat",
                value: "TWO"
            },
            {
                label: "Cypress",
                value: "THREE"
            }
        ]
    }

    filterName(event) {
        event.preventDefault();
        var _id = $(event.target).val();
        this.taskListNameFilter.set(_id);
    }

    onCreated() {
        this.taskListTeamFilter = new ReactiveTable.Filter("task-list-team-filter", ["teamId"]);
        this.taskListResponsibleFilter = new ReactiveTable.Filter("task-list-responsible-filter", ["masterId"]);
        this.taskListNameFilter = new ReactiveTable.Filter('search-task-name-filter', ['name']);
        this.taskListAdvancedSearch = new ReactiveVar(false);
    }


    tasksList() {
        var fields = [
            {
                key: 'name',
                label: 'Name',
                cellClass: 'col-sm-3',
                headerClass: 'col-sm-3',
                fnAdjustColumnSizing: true
            },
            // TODO add GROUP
            /*{
                key: 'groupId',
                label: 'Group',
                cellClass: 'col-sm-2',
                headerClass: 'col-sm-2',
                fnAdjustColumnSizing: true,
                searchable: false,
                fn: function (groupId, Task) {
                    return Groups.findOne(groupId).name;
                }
            },*/
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
            },
            {
                key: 'timeSlots',
                label: 'Time slots count',
                cellClass: 'col-sm-1 text-center',
                headerClass: 'col-sm-1 text-center',
                searchable: false, //TODO doesn't work (try with a teamId)
                sortable: false,
                fn: function (timeSlots, Task) {
                    return timeSlots.length;
                },
                fnAdjustColumnSizing: true
            }
        ];

        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TASKWRITE))
            fields.push({
                label: 'Validation',
                cellClass: 'col-sm-2 text-center',
                headerClass: 'col-sm-2 text-center',
                sortable: false,
                searchable: false, //TODO doesn't work (try with a teamId)
                tmpl: Template.validationStateForList,
                fnAdjustColumnSizing: true
            });

        fields.push({
            label: 'Actions',
            cellClass: 'col-sm-2 text-center',
            headerClass: 'col-sm-2 text-center',
            sortable: false,
            searchable: false, //TODO doesn't work (try with a teamId)
            tmpl: Template.taskButtons,
            fnAdjustColumnSizing: true
        });

        return {
            collection: Tasks,
            rowsPerPage: 10,
            showFilter: false,
            showRowCount: true,
            filters: ['task-list-team-filter','task-list-responsible-filter','search-task-name-filter'],
            fields: fields
        }
    }
}

TaskListComponent.register("TaskListComponent");