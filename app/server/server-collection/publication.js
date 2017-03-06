import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/**
 * @namespace Meteor_Publish
 */
//TODO namespace and memberof doesn't work with JSDoc

Meteor.startup(function () {

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Meteor.users publication. Publish all Meteor.users data if role associated or only current user data
     * @description
     * Role required : USERREAD ou ASSIGNMENTTASKUSER
     *
     * Return current user if no role
     * @returns {Collection}
     */
    Meteor.publish("users", function () {
        if(Meteor.users.findOne(this.userId).username === "superadmin"){
            return Meteor.users.find({});
        }
        else if(SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.USERREAD,"users")
            || SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"users")
            || SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"users"))
            return Meteor.users.find({username: {$ne: "superadmin"}});
        else
            return Meteor.users.find({_id : this.userId});
        //TODO ne pas envoyer les roles des users si pas le role 'user'
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Tasks publication. No query, publish all Tasks data.
     * @description
     * Role required : TASKREAD or ASSIGNMENTTASKUSER
     * @returns {Collection}
     */
    Meteor.publish("tasks", function () {
        if(SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.TASKREAD,"tasks")
        || SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"tasks"))
            return Tasks.find({});
        else
            return [];
    });


    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Activity publication. Publish activities that are not 'limitToTeam' or are 'limitToTeam' to the user's teams. Superadmin has all activities.
     * @description
     * Role required : ACTIVITYREAD
     * @returns {Collection}
     */
    Meteor.publish("activities", function () {
        if (SecurityServiceServer.grantAccessToCollection(this.userId, RolesEnum.ACTIVITYREAD, "Activity")) {
            var user = Meteor.users.findOne(this.userId);

            if(user.username === SUPERADMIN)
                    return Activities.find({});

            if(SecurityServiceServer.testAccessToItem(this.userId, RolesEnum.ALLACTIVITY)){
                return Activities.find({});
            }

            return Activities.find({
                $or: [
                    {limitToTeam: false},
                    {
                        limitToTeam: true,
                        teamId: {
                            $in: user.teams
                        }
                    }
                ]
            });
        }
        else
            return [];
    });


    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Assignments publication. No query, publish all Assignments data.
     * @description
     * Role required : ASSIGNMENTTASKUSER
     * @returns {Collection}
     */
    Meteor.publish("assignments", function () {
        if(SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"assignments"))
            return Assignments.find({});
        else
            return Assignments.find({userId:this.userId});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Skills publication. No query, publish all Skills data.
     * @returns {Collection}
     */
    Meteor.publish("skills", function () {
        return Skills.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Teams publication. No query, publish all Teams data.
     * @returns {Collection}
     */
    Meteor.publish("teams", function (){
        return Teams.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Task Groups publication. No query, publish all Groups data.
     * @returns {Collection}
     */
    Meteor.publish("task-groups", function (){
        return TaskGroups.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Places publication. No query, publish all Places data.
     * @returns {Collection}
     */
    Meteor.publish("places", function(){
        return Places.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary AssignmentTerms publication. No query, publish all AssignmentTerms data.
     * @description
     * Role required : none
     * @returns {Collection}
     */
    Meteor.publish("assignment-terms", function () {
        return AssignmentTerms.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary GroupRoles publication. No query, publish all GroupRoles data.
     * @returns {Collection}
     */
    Meteor.publish("group-roles", function () {
        if(Meteor.users.findOne(this.userId).username === "superadmin"){
            return GroupRoles.find({});
        }
        var superadminGroupRoles = GroupRoles.findOne({name:"superadmin"});
        return GroupRoles.find({_id: {$ne: superadminGroupRoles._id}});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Roles publication. No query, publish all Roles data.
     * @returns {Collection}
     */
    Meteor.publish("roles", function () {
        //TODO limit to user with role 'role' => i don't know...
        return Meteor.roles.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Equipment Categories publication. No query, publish all Roles data.
     * @returns {Collection}
     */
    Meteor.publish("equipment-categories", function () {
        return EquipmentCategories.find({});
    });


    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Equipment Categories publication. No query, publish all Roles data.
     * @returns {Collection}
     */
    Meteor.publish("power-supplies", function () {
        return PowerSupplies.find({});
    });



    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Water supply publication. No query, publish all Roles data.
     * @returns {Collection}
     */
    Meteor.publish("water-supplies", function () {
        return WaterSupplies.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Water disposal publication. No query, publish all Roles data.
     * @returns {Collection}
     */
    Meteor.publish("water-disposals", function () {
        return WaterDisposals.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Equipments publication. No query, publish all Roles data.
     * @returns {Collection}
     */
    Meteor.publish("equipments", function () {
        return Equipments.find({});
    });


    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Equipment Storage publication. No query, publish all Roles data.
     * @returns {Collection}
     */
    Meteor.publish("equipment-storages", function () {
        return EquipmentStorages.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Settings publication. No query, publish all but only one item is allowed
     * @returns {Collection}
     */
    Meteor.publish("settings", function () {
        return Settings.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Access Point publication. No query, publish all Access Point data.
     * @returns {Collection}
     */
    Meteor.publish("access-points", function () {
        return AccessPoints.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Web Category publication. No query, publish all Web Category data.
     * @returns {Collection}
     */
    Meteor.publish("web-categories", function () {
        return WebCategories.find({});
    });

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Android Category publication. No query, publish all Android Category data.
     * @returns {Collection}
     */
    Meteor.publish("android-categories", function () {
        return AndroidCategories.find({});
    });

    Meteor.publish("images", function () {
        return Images.find({});
    });

});
