Template.usersList.helpers({
    usersList: function () {
        var fields = [
            {
                key: 'name',
                label: 'Task name',
                fnAdjustColumnSizing: true
            },
            {
                key: 'teams',
                label: 'Teams',
                fnAdjustColumnSizing: true,
                searchable: false, //TODO doesn't work (try with a teamId)
                fn: function (teams, user) {
                    return _.reduce(Teams.find({_id: {$in: teams}}).fetch(), function (memo, team) {
                        if (team.name === ASSIGNMENTREADYTEAM) return memo;
                        if (memo === "") return team.name;
                        return memo + ", " + team.name;
                    }, "");
                }
            }
        ];
        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.ROLE))
            fields.push({
                    label: 'Roles',
                    fnAdjustColumnSizing: true,
                    searchable: false,
                    fn: function (nothing, user) {
                        if (!user.loginUserId) return "User don't have a associated login account";
                        var groups = GroupRoles.find({_id: {$in: user.groupRoles}}).fetch(); //get all related roles
                        var result = []; //reduce to get only the roles array
                        groups.forEach(group => {
                            result.push(group.roles);
                        });
                        var allGroupRolesMerged = _.uniq(_.flatten(result)); //obtain a single array
                        return allGroupRolesMerged;
                    }
                }
            );
        fields.push({
                label: 'Actions',
                tmpl: Template.userButtons,
                fnAdjustColumnSizing: true
            }
        );

        return {
            collection: Users,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            filters: ['user-list-team-filter'],
            fields: fields
        }
    },

});


Template.userButtons.helpers({
    displayUpdateButtons: function () {
        if(this.loginUserId === Meteor.userId())
            return true;
        return Roles.userIsInRole(Meteor.userId(),RolesEnum.USERWRITE);
    }
});


Template.usersList.created = function () {
    this.userListTeamFilter = new ReactiveTable.Filter("user-list-team-filter", ["teams"]);
};

Template.usersList.events({
    "change #user-list-team-selector": function (event, template) {
        event.preventDefault();
        var _id = $(event.target).val();
        template.userListTeamFilter.set(_id);
    }
});

