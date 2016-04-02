/**
 * @memberOf Models
 * @summary Users collection
 * @locus Anywhere
 * @instancename collection
 */
Users = new Mongo.Collection("users_custom"); //TODO utiliser la meme collection que le package accounts ?

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
Groups = new Mongo.Collection("groups");

/**
 * @memberOf Models
 * @summary EasySearch settings to perform search by name on Task
 * @locus Anywhere
 * @instancename object
 */
TasksIndex = new EasySearch.Index({
    collection: Tasks,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf Models
 * @summary EasySearch settings to perform search by name on User
 * @locus Anywhere
 * @instancename object
 */
UsersIndex = new EasySearch.Index({
    collection: Users,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf Models
 * @summary EasySearch settings to perform search by name on Teams
 * @locus Anywhere
 * @instancename object
 */
TeamsIndex = new EasySearch.Index({
    collection: Teams,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf Models
 * @summary EasySearch settings to perform search by label on Skills
 * @locus Anywhere
 * @instancename object
 */
SkillsIndex = new EasySearch.Index({
    collection: Skills,
    fields: ['label'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf Models
 * @summary EasySearch settings to perform search by label on PowerSupplies
 * @locus Anywhere
 * @instancename object
 */
PowerSuppliesIndex = new EasySearch.Index({
    collection: PowerSupplies,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
* @memberOf Models
* @summary EasySearch settings to perform search by label on Places
* @locus Anywhere
* @instancename object
*/
PlacesIndex = new EasySearch.Index({
    collection: Places,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf Models
 * @summary EasySearch settings to perform search by label on EquipmentStorages
 * @locus Anywhere
 * @instancename object
 */
EquipmentStoragesIndex = new EasySearch.Index({
    collection: EquipmentStorages,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf Models
 * @summary EasySearch settings to perform search by label on PowerSupplies
 * @locus Anywhere
 * @instancename object
 */
PowerSuppliesIndex = new EasySearch.Index({
    collection: PowerSupplies,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});



//using schema
Tasks.attachSchema(Schemas.Tasks);
Assignments.attachSchema(Schemas.Assignments);
Users.attachSchema(Schemas.Users);
