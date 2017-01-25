import {TeamService} from "../../../both/service/TeamService"
import {Utils} from "../../../client/service/Utils"

export class ActivityListComponent extends BlazeComponent {
    template() {
        return "activityListComponent";
    }

    events() {
        return [{
            "keyup #search_activity_name": this.filterName,
            "click #advanced-search-button": this.switchAdvanced,
            "click #checkbox-after-filter": this.switchAfterFilter,
            "click #checkbox-before-filter": this.switchBeforeFilter,
        }];
    }

    /**
     * Switch between hiding and showing the advanced search menu
     * @param event
     */
    switchAdvanced(event){
        this.activityListAdvancedSearch.set(!this.isSearchAdvanced());
    }

    isSearchAdvanced(){
        return this.activityListAdvancedSearch.get();
    }

    filterTeam(error, docModified, newOption) {
        return _.bind(function (error, docModifier, newOption) {
            var _id = newOption;
            this.activityListTeamFilter.set(_id);
        },this);
    }


    filterResponsible(error, docModifier, newOption) {
        return _.bind(function(error,docModifier,newOption) {
            var _id = newOption;
            this.activityListResponsibleFilter.set(_id);
        },this);
    }

    filterValidationStatus(error, docModifier, newOption) {
        return _.bind(function(error,docModifier,validationOption) {
            var queryAccessPass = "", queryEquipment = "", queryGeneralInfo = "";
            if(validationOption) {
                var validationRole = validationOption.split("_")[0];
                var validationStatus = validationOption.split("_")[1];

                if (validationRole === RolesEnum.EQUIPMENTVALIDATION) {
                    queryEquipment = validationStatus;
                } else if (validationRole === RolesEnum.ACCESSPASSVALIDATION) {
                    queryAccessPass = validationStatus;
                } else if (validationRole === RolesEnum.ACTIVITYGENERALVALIDATION) {
                    queryGeneralInfo = validationStatus;
                }else if (validationRole === "ALL") {
                    //TODO
                    queryEquipment = validationStatus;
                    queryAccessPass = validationStatus;
                    queryGeneralInfo = validationStatus
                }
            }

            this.activityListAccessPassValidationStateFilter.set(queryAccessPass);
            this.activityListGeneralInformationValidationStateFilter.set(queryGeneralInfo);
            this.activityListEquipmentValidationStateFilter.set(queryEquipment);
        }, this);
    }


    optionQueryTeamsWithoutAlreadyAssigned(){
        return TeamService.optionQueryTeamsWithoutAlreadyAssigned();
    }

    optionValidationStatus(){
        /*
         user with at least one validation role :
         for each of its validation role :
         <ROLE>_TOBEVALIDATED
         <ROLE>_REFUSED
         user without any validation role :
         ALL_OPEN
         ALL_TOBEVALIDATED
         ALL_REFUSED
         ALL_READY
         */
        var result = [];
        var validationRoles = [
            Meteor.roles.findOne({name:"ACTIVITYGENERALVALIDATION"}),
            Meteor.roles.findOne({name:"ACCESSPASSVALIDATION"}),
            Meteor.roles.findOne({name:"EQUIPMENTVALIDATION"}),
        ];
        var userValidationRole = [];
        validationRoles.forEach(validationRole => {
            if(Roles.userIsInRole(Meteor.userId(), validationRole.name))
                userValidationRole.push(validationRole.name);
        });

        if(userValidationRole.length > 0){
            validationRoles.forEach(validationRole => {
                result.push({
                    label: RolesEnumDisplay[validationRole.name] + " " +ValidationStateDisplay.TOBEVALIDATED,
                    value: validationRole.name + "_" + ValidationState.TOBEVALIDATED
                });
                result.push({
                    label: RolesEnumDisplay[validationRole.name] + " " +ValidationStateDisplay.REFUSED,
                    value: validationRole.name + "_" + ValidationState.REFUSED
                });
            })
        } else {
            result.push({
                label: ValidationStateDisplay.OPEN,
                value: "ALL_"+ValidationState.OPEN
            });
            result.push({
                label: ValidationStateDisplay.TOBEVALIDATED,
                value: "ALL_"+ValidationState.TOBEVALIDATED
            });
            result.push({
                label: ValidationStateDisplay.REFUSED,
                value: "ALL_"+ValidationState.REFUSED
            });
            result.push({
                label: ValidationStateDisplay.READY,
                value: "ALL_"+ValidationState.READY
            });
        }
        return result;
    }

    filterName(event) {
        event.preventDefault();
        var _id = $(event.target).val();
        this.activityListNameFilter.set(_id);
    }


    switchAfterFilter(event){
        var _id = $(event.target).prop("checked");
        if(_id){
            this.isAfterFilterOn.set(true);

            var _date = this.$(".date-after-filter>.datetimepicker").data("DateTimePicker").date(); //get the date
            this.changeDateFilter(_date,"after");
        }else{
            this.deleteDateFilter("after");
            this.isAfterFilterOn.set(false);
        }
    }
    isAfterFilterReadOnly(){
        return !this.isAfterFilterOn.get();
    }
    filterAfter(newOption) {
        return _.bind(function(newOption) {
            var _time = new moment(newOption);
            this.changeDateFilter(_time,"after");
        },this);
    }

    switchBeforeFilter(event){
        var _id = $(event.target).prop("checked");
        if(_id){
            this.isBeforeFilterOn.set(true);

            var _date = this.$(".date-before-filter>.datetimepicker").data("DateTimePicker").date(); //get the date
            this.changeDateFilter(_date,"before");
        }else{
            this.deleteDateFilter("before");
            this.isBeforeFilterOn.set(false);
        }
    }
    isBeforeFilterReadOnly(){
        return !this.isBeforeFilterOn.get();
    }
    filterBefore(newOption) {
        return _.bind(function(newOption) {
            var _time = new Date(newOption);
            this.changeDateFilter(_time,"before");
        },this);
    }


    changeDateFilter(newDate,beforeOrAfter){
        if(this.activityDateFilter.get()["$elemMatch"]){ //if a filter is already defined
            var dateQuery = this.activityDateFilter.get();
            if(beforeOrAfter=="before"){
                dateQuery["$elemMatch"]["end"]={ "$lte":  newDate.toDate() };
            }else if(beforeOrAfter=="after"){
                dateQuery["$elemMatch"]["start"]={ "$gte":  newDate.toDate() };
            }
            this.activityDateFilter.set(dateQuery);
        }else{
            if(beforeOrAfter=="before"){
                this.activityDateFilter.set({ "$elemMatch": {"end": { "$lte":  newDate.toDate() } } });
            }else if(beforeOrAfter=="after"){
                this.activityDateFilter.set({ "$elemMatch": {"start": { "$gte":  newDate.toDate() } } });
            }
        }
    }
    deleteDateFilter(beforeOrAfter){
        var paramToChange, otherParam;
        if(beforeOrAfter=="before"){
            paramToChange="end";otherParam="start";
        }else if(beforeOrAfter=="after"){
            paramToChange="start";otherParam="end";
        }

        if(this.activityDateFilter.get()["$elemMatch"]){ //if a filter is defined
            if(this.activityDateFilter.get()["$elemMatch"][otherParam]){ //if the other filter is active
                var dateQuery = this.activityDateFilter.get();
                delete dateQuery["$elemMatch"][paramToChange]; //just delete the one we don't want
                this.activityDateFilter.set(dateQuery);
            }else{
                this.activityDateFilter.set("");
            }
        }else{
            this.activityDateFilter.set("");
        }
    }

    onCreated() {
        this.activityListTeamFilter = new ReactiveTable.Filter("activity-list-team-filter", ["teamId"]);
        this.activityListResponsibleFilter = new ReactiveTable.Filter("activity-list-responsible-filter", ["masterId"]);
        this.activityListNameFilter = new ReactiveTable.Filter('search-activity-name-filter', ['name']);
        this.activityListGeneralInformationValidationStateFilter = new ReactiveTable.Filter('activity-general-information-validation-state-filter', ['generalInformationValidation.currentState']);
        this.activityListAccessPassValidationStateFilter = new ReactiveTable.Filter('activity-access-pass-validation-state-filter', ['accessPassValidation.currentState']);
        this.activityListEquipmentValidationStateFilter = new ReactiveTable.Filter('activity-equipment-validation-state-filter', ['equipmentValidation.currentState']);
        this.activityDateFilter = new ReactiveTable.Filter("activity-date-filter", ["timeSlots"]);

    }

    constructor(){
        super();
        this.activityListAdvancedSearch = new ReactiveVar(false);
        this.isAfterFilterOn = new ReactiveVar(false);
        this.isBeforeFilterOn = new ReactiveVar(false);
    }


    activitiesList() {
        var fields = [
            {
                key: 'name',
                label: 'Name',
                cellClass: 'col-sm-3',
                headerClass: 'col-sm-3',
                fnAdjustColumnSizing: true,
                fn: _.bind(function (value) { return Utils.camelize(value); },this)
            },
            // TODO add GROUP
            /*{
             key: 'groupId',
             label: 'Group',
             cellClass: 'col-sm-2',
             headerClass: 'col-sm-2',
             fnAdjustColumnSizing: true,
             searchable: false,
             fn: function (groupId, Activity) {
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
                fn: function (teamId, Activity) {
                    return Teams.findOne(teamId).name;
                }
            }
        ];

        this.addExtraColumn(fields);

        fields.push({
            label: 'Actions',
            cellClass: 'col-sm-2 text-center',
            headerClass: 'col-sm-2 text-center',
            sortable: false,
            searchable: false, //TODO doesn't work (try with a teamId)
            tmpl: Template.activityButtons,
            fnAdjustColumnSizing: true
        });

        return {
            collection: Activities,
            rowsPerPage: Activities.find().fetch().size,
            showFilter: false,
            showRowCount: true,
            fields: fields,
            filters: [
                'activity-list-team-filter',
                'activity-list-responsible-filter',
                'search-activity-name-filter',
                'activity-access-pass-validation-state-filter',
                'activity-general-information-validation-state-filter',
                'activity-equipment-validation-state-filter',
                'activity-date-filter'
            ]
        }
    }

    addExtraColumn(fields) {
        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TASKWRITE))
            fields.push({
                label: 'Validation',
                cellClass: 'col-sm-2 text-center',
                headerClass: 'col-sm-2 text-center',
                sortable: false,
                searchable: false, //TODO doesn't work (try with a teamId)
                tmpl: Template.validationStateForActivityList,
                fnAdjustColumnSizing: true
            });
    }

}

ActivityListComponent.register("ActivityListComponent");