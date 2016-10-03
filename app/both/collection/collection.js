import {Schemas} from './model/SchemasHelpers'

/**
 * All MongoDB server collections (see {@link Meteor_Publish} to know what is published)
 * @namespace Collection
 */

/**
 * @memberOf Collection
 * @summary Users collection
 * @locus Anywhere
 * @instancename collection
 */
Users = new Mongo.Collection("users_custom");
UsersCustom = Users;

/**
 * @memberOf Collection
 * @summary Task collection
 * @locus Anywhere
 * @instancename collectiono
 */
Tasks = new Mongo.Collection("tasks");
/**
 * @memberOf Collection
 * @summary Assignments collection
 * @locus Anywhere
 * @instancename collection
 */
Assignments = new Mongo.Collection("assignment");

/**
 * @memberOf Collection
 * @summary Groups collection
 * @locus Anywhere
 * @instancename collection
 */
TaskGroups = new Mongo.Collection("task_groups"); //TODO group activity



//using schema
Tasks.attachSchema(Schemas.Tasks);
TaskGroups.attachSchema(Schemas.TaskGroups);
Assignments.attachSchema(Schemas.Assignments);
Users.attachSchema(Schemas.Users);

/**
 * @namespace Enum 
 */