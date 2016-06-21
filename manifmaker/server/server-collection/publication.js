import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/**
 * @namespace Meteor_Publish
 */
//TODO namespace and memberof doesn't work with JSDoc

Meteor.startup(function () {

    /**
     * @memberOf Meteor_Publish
     * @locus server
     * @summary Users publication. Publish all Users data if role associated or only current user data
     * @description
     * Role required : USERREAD ou ASSIGNMENTTASKUSER
     *
     * Return current user if no role
     * @returns {Collection}
     */
    Meteor.publish("users", function () {
        if(SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.USERREAD,"Task")
        || SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"Assignment"))
            return Users.find({});
        else
            return Users.find({loginUserId : this.userId});
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
        if(SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.TASKREAD,"Task")
        || SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"Assignment"))
            return Tasks.find({});
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
        if(SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"Assignment"))
            return Assignments.find({});
        else
            return [];
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
     * @summary Groups publication. No query, publish all Groups data.
     * @returns {Collection}
     */
    Meteor.publish("groups", function (){
        return Groups.find({});
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
        return GroupRoles.find({});
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

});
