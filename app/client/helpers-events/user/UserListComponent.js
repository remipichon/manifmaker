import {TeamService} from "../../../both/service/TeamService"
import {UserServiceClient} from "../../../client/service/UserServiceClient"

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
            this.userListTeamFilter.set({teams:_id});
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
        this.userListNameFilter = new ReactiveTable.Filter('search-user-name-filter', ['name']);

    }


    usersList() {
        var fields = [
            {
                key: 'name',
                label: 'Name',
                cellClass: 'col-sm-3',
                headerClass: 'col-sm-3',
                fnAdjustColumnSizing: true
            },
            {
                key: 'teams',
                label: 'Team',
                cellClass: 'col-sm-2',
                headerClass: 'col-sm-2',
                fnAdjustColumnSizing: true,
                fn: function (teams, Task) {
                    return Teams.findOne(teams[0]).name; //user.teams : on n'utilsie que la premiere ici
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
            rowsPerPage: 10,
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