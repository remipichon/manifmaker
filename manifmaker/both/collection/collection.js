import {Schemas} from './model/SchemasHelpers'

/**
 * @memberOf Models
 * @summary Users collection
 * @locus Anywhere
 * @instancename collection
 */
Users = new Mongo.Collection("users_custom");

/**
 * @memberOf Models
 * @summary Task collection
 * @locus Anywhere
 * @instancename collectiono
 */
Tasks = new Mongo.Collection("tasks");
/**
 * @memberOf Models
 * @summary Assignments collection
 * @locus Anywhere
 * @instancename collection
 */
Assignments = new Mongo.Collection("assignment");

/**
 * @memberOf Models
 * @summary Groups collection
 * @locus Anywhere
 * @instancename collection
 */
Groups = new Mongo.Collection("groups"); //TODO group activity



//using schema
Tasks.attachSchema(Schemas.Tasks);
Assignments.attachSchema(Schemas.Assignments);
Users.attachSchema(Schemas.Users);
