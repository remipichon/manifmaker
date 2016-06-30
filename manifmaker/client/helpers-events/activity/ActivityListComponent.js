class ActivityListComponent extends BlazeComponent {
    template() {
        return "activityListComponent";
    }


    activitiesList() {
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
                searchable: false,
                fn: function (teamId, Task) {
                    return Teams.findOne(teamId).name;
                }
            },
            {
                label: 'Actions',
                searchable: false,
                tmpl: Template.activityButtons,
                fnAdjustColumnSizing: true
            }
        ];

        return {
            collection: Activities,
            rowsPerPage: 10,
            showFilter: false,
            showRowCount: true,
            fields: fields
        }
    }

}

ActivityListComponent.register("ActivityListComponent");