/**
 * EasySearch allow to perform smart search on any collection using a field as index.
 * @namespace EasySearch
 */

/**
 * @memberOf EasySearch
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
 * @memberOf EasySearch
 * @summary EasySearch settings to perform search by name on Activity
 * @locus Anywhere
 * @instancename object
 */
ActivitiesIndex = new EasySearch.Index({
    collection: Activities,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf EasySearch
 * @summary EasySearch settings to perform search by name on Task Group
 * @locus Anywhere
 * @instancename object
 */
TaskGroupsIndex = new EasySearch.Index({
    collection: TaskGroups,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf EasySearch
 * @summary EasySearch settings to perform search by name on User
 * @locus Anywhere
 * @instancename object
 */
UsersIndex = new EasySearch.Index({
    collection: Meteor.users,
    fields: ['familyName','firstName','username'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf EasySearch
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
 * @memberOf EasySearch
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
 * @memberOf EasySearch
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
 * @memberOf EasySearch
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
 * @memberOf EasySearch
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
 * @memberOf EasySearch
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
 * @memberOf EasySearch
 * @summary EasySearch settings to perform search by label on WaterSupplies
 * @locus Anywhere
 * @instancename object
 */
WaterSuppliesIndex = new EasySearch.Index({
    collection: WaterSupplies,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @memberOf EasySearch
 * @summary EasySearch settings to perform search by label on WaterSupplies
 * @locus Anywhere
 * @instancename object
 */
WaterDisposalsIndex = new EasySearch.Index({
    collection: WaterDisposals,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});