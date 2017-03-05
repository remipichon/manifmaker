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
            "click #checkbox-validated": this.switchValidatedFilter,
            "click #checkbox-unvalidated": this.switchUnvalidatedFilter,
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

    switchUnvalidatedFilter(){
        if(this.userListUnvalidatedFilter.get()!=""){ //if a filter is already defined
            this.userListUnvalidatedFilter.set("");
        }else{
            this.userListUnvalidatedFilter.set("false");
        }
    }

    switchValidatedFilter(){
        if(this.userListValidatedFilter.get()!=""){ //if a filter is already defined
            this.userListValidatedFilter.set("");
        }else{
            this.userListValidatedFilter.set("true");
        }
    }


    onCreated() {
        this.isAfterFilterOn = new ReactiveVar(false);
        this.isBeforeFilterOn = new ReactiveVar(false);
        this.userListTeamFilter = new ReactiveTable.Filter("user-list-team-filter", ["teams"]);
        this.userListNameFilter = new ReactiveTable.Filter('search-user-name-filter', ['username','profile.lastName','profile.familyName','profile.phoneNumber','emails.0.address']);
        this.userListValidatedFilter = new ReactiveTable.Filter('user-list-validated-filter', ['isReadyForAssignment']);
        this.userListUnvalidatedFilter = new ReactiveTable.Filter('user-list-unvalidated-filter', ['isReadyForAssignment']);

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
                fn: function (teams, User) {
                    var res = "";
                    teams.forEach(team => {
                        res += `${Teams.findOne(team).name}, `
                    });
                    return res.substring(0,res.length-2);
                }
            },
            {
                key: 'profile.phoneNumber',
                label: 'Phone Number',
                cellClass: 'col-sm-2',
                headerClass: 'col-sm-2',
                fnAdjustColumnSizing: true,
            },
            {
                key: 'emails',
                label: 'Email',
                cellClass: 'col-sm-2',
                headerClass: 'col-sm-2',
                fnAdjustColumnSizing: true,
                fn: function (emails, User) {
                    return emails[0].address;
                }
            },
            {
                key: 'profile',
                label: 'INSA',
                cellClass: 'col-sm-2',
                headerClass: 'col-sm-2',
                fnAdjustColumnSizing: true,
                fn: function (profile, User) {
                    return ((profile.annee)?profile.annee:"") + ((profile.departement)?profile.departement:"")
                }
            },
            {
                key: "isReadyForAssignment",
                label: 'Validated',
                cellClass: 'col-sm-1',
                headerClass: 'col-sm-1',
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
                'search-user-name-filter',
                'user-list-validated-filter',
                'user-list-unvalidated-filter'
            ]
        }
    }
}

UserListComponent.register("UserListComponent");