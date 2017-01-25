import {TeamService} from "../../../both/service/TeamService"
import {UserServiceClient} from "../../../client/service/UserServiceClient"
import {Utils} from "../../../client/service/Utils"

class UserListComponent extends BlazeComponent {
    template() {
        return "userListComponent";
    }

    events() {
        return [{
            "keyup #search_user_name": this.filterName,
        }];
    }

    filterTeam(error, docModified, newOption) {
        return _.bind(function (error, docModifier, newOption) {
            var _id = newOption;
            if(_id)
                this.userListTeamFilter.set(_id);
            else
                this.userListTeamFilter.set(null);

        },this);
    }

    optionQueryTeamsWithoutAlreadyAssigned(){
        return TeamService.optionQueryTeamsWithoutAlreadyAssigned();
    }

    filterName(event) {
        event.preventDefault();
        var _id = $(event.target).val();
        this.userListNameFilter.set(_id);
    }

    beforeRemove() {
        var user = this.currentData();
        return function () {
            UserServiceClient.beforeRemoveHook(user);
        }
    }


    onCreated() {
        this.userListTeamFilter = new ReactiveTable.Filter("user-list-team-filter", ["teams"]);
        this.userListNameFilter = new ReactiveTable.Filter('search-user-name-filter', ['username']);

    }




    usersList() {
        var fields = [
            {
                key: 'username',
                label: 'Username',
                cellClass: 'col-sm-3',
                headerClass: 'col-sm-3',
                fnAdjustColumnSizing: true,
                fn: _.bind(function (value) { return Utils.camelize(value); },this)
            },
            {
                key: 'teams',
                label: 'Team',
                cellClass: 'col-sm-2',
                headerClass: 'col-sm-2',
                fnAdjustColumnSizing: true,
                fn: function (teams, Task) {
                    var res = "";
                    teams.forEach(team => {
                        res += `${Teams.findOne(team).name}, `
                    });
                    return res.substring(0,res.length-2);
                }
            },
            {
                key: "isReadyForAssignment",
                label: 'Validated',
                cellClass: 'col-sm-2',
                headerClass: 'col-sm-2',
                tmpl: Template.isReadyForAssignment,
            }
        ];

        fields.push({
            label: 'Actions',
            cellClass: 'col-sm-2 text-center',
            headerClass: 'col-sm-2 text-center',
            sortable: false,
            searchable: false, //TODO doesn't work (try with a teamId)
            tmpl: Template.userButtons,
            fnAdjustColumnSizing: true
        });

        return {
            collection: Meteor.users,
            rowsPerPage: Meteor.users.find().fetch().length,
            showFilter: false,
            showRowCount: true,
            fields: fields,
            filters: [
                'user-list-team-filter',
                'search-user-name-filter'
            ]
        }
    }
}

UserListComponent.register("UserListComponent");