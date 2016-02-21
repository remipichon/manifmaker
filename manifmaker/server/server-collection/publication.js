Meteor.startup(function () {

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Users publication. Publish all Users data if role associated or only current user data
     *
     * Role required : read
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
     * @memberOf Meteor Publish
     * @locus server
     * @summary Tasks publication. No query, publish all Tasks data.
     *
     * Role required : read
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
     * @memberOf Meteor Publish
     * @locus server
     * @summary Assignments publication. No query, publish all Assignments data.
     *
     * Role required : assignment
     * @returns {Collection}
     */
    Meteor.publish("assignments", function () {
        if(SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"Assignment"))
            return Assignments.find({});
        else
            return [];
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Skills publication. No query, publish all Skills data.
     * @returns {Collection}
     */
    Meteor.publish("skills", function () {
        return Skills.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Teams publication. No query, publish all Teams data.
     * @returns {Collection}
     */
    Meteor.publish("teams", function (){
        return Teams.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Groups publication. No query, publish all Groups data.
     * @returns {Collection}
     */
    Meteor.publish("groups", function (){
        return Groups.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Places publication. No query, publish all Places data.
     * @returns {Collection}
     */
    Meteor.publish("places", function(){
        return Places.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary AssignmentTerms publication. No query, publish all AssignmentTerms data.
     *
     * Role required : assignment
     * @returns {Collection}
     */
    Meteor.publish("assignment-terms", function () {
        if(SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.ASSIGNMENTTASKUSER,"AssignmentTerms"))
            return AssignmentTerms.find({});
        else
            return [];
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary GroupRoles publication. No query, publish all GroupRoles data.
     * @returns {Collection}
     */
    Meteor.publish("group-roles", function () {
        return GroupRoles.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Roles publication. No query, publish all Roles data.
     * @returns {Collection}
     */
    Meteor.publish("roles", function () {
        //TODO limit to user with role 'role' => i don't know...
        return Meteor.roles.find({});
    });

});
