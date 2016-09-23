## Classes

<dl>
<dt><a href="#AssignmentServiceClient">AssignmentServiceClient</a></dt>
<dd></dd>
<dt><a href="#SecurityServiceClient">SecurityServiceClient</a></dt>
<dd></dd>
<dt><a href="#InjectDataServerService">InjectDataServerService</a></dt>
<dd></dd>
<dt><a href="#SecurityServiceServer">SecurityServiceServer</a></dt>
<dd></dd>
<dt><a href="#ServerAssignmentService">ServerAssignmentService</a></dt>
<dd></dd>
<dt><a href="#ServerUserService">ServerUserService</a></dt>
<dd></dd>
<dt><a href="#ServerReferenceCollectionsService">ServerReferenceCollectionsService</a></dt>
<dd></dd>
<dt><a href="#ServerService">ServerService</a></dt>
<dd></dd>
<dt><a href="#ServerTaskService">ServerTaskService</a></dt>
<dd></dd>
<dt><a href="#ServerUserService">ServerUserService</a></dt>
<dd></dd>
</dl>

<a name="AssignmentServiceClient"></a>

## AssignmentServiceClient
**Kind**: global class  

* [AssignmentServiceClient](#AssignmentServiceClient)
    * [.taskToUserPerformUserFilterRemoveAssignment()](#AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment) ⇒ <code>timeSlot</code> &#124; <code>null</code>
    * [.taskToUserPerformUserFilter()](#AssignmentServiceClient.taskToUserPerformUserFilter) ⇒ <code>timeSlot</code> &#124; <code>null</code>
    * [.setCalendarAccuracy(accuracy)](#AssignmentServiceClient.setCalendarAccuracy)
    * [.setCalendarTerms(_idAssignmentTerms)](#AssignmentServiceClient.setCalendarTerms)
    * [.initAssignmentSkillsFilter()](#AssignmentServiceClient.initAssignmentSkillsFilter)
    * [.initAssignmentPopover()](#AssignmentServiceClient.initAssignmentPopover)
    * [.disableDisplayAssignedCheckbox()](#AssignmentServiceClient.disableDisplayAssignedCheckbox)
    * [.readSelectedPeopleNeedAndTimeSlotFromPopover()](#AssignmentServiceClient.readSelectedPeopleNeedAndTimeSlotFromPopover) ⇒ <code>timeSlot</code> &#124; <code>null</code>

<a name="AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment"></a>

### AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment() ⇒ <code>timeSlot</code> &#124; <code>null</code>
Reactive Var :

 - Get ReactiveVar AssignmentReactiveVars.SelectedPeopleNeed
 - Set AssignmentReactiveVars.SelectedTimeSlot
 - Set AssignmentReactiveVars.IsUnassignment

**Kind**: static method of <code>[AssignmentServiceClient](#AssignmentServiceClient)</code>  
**Summary**: Filter user list in task to user mode only remove assignment only.  
**Locus**: Anywhere  
<a name="AssignmentServiceClient.taskToUserPerformUserFilter"></a>

### AssignmentServiceClient.taskToUserPerformUserFilter() ⇒ <code>timeSlot</code> &#124; <code>null</code>
**Kind**: static method of <code>[AssignmentServiceClient](#AssignmentServiceClient)</code>  
**Summary**: Filter user list in task to user mode only.
Reactive Var :

 - Get ReactiveVar AssignmentReactiveVars.SelectedPeopleNeed
 - Set AssignmentReactiveVars.SelectedTimeSlot
 - Set AssignmentReactiveVars.IsUnassignment  
**Locus**: Anywhere  
<a name="AssignmentServiceClient.setCalendarAccuracy"></a>

### AssignmentServiceClient.setCalendarAccuracy(accuracy)
**Kind**: static method of <code>[AssignmentServiceClient](#AssignmentServiceClient)</code>  
**Summary**: On the assignment calendar, display more or less hours accuracy  
**Locus**: client  

| Param | Type |
| --- | --- |
| accuracy | <code>CalendarAccuracy</code> | 

<a name="AssignmentServiceClient.setCalendarTerms"></a>

### AssignmentServiceClient.setCalendarTerms(_idAssignmentTerms)
**Kind**: static method of <code>[AssignmentServiceClient](#AssignmentServiceClient)</code>  
**Summary**: On the assignment calendar, all the days covered by the given assignment term  
**Locus**: client  

| Param | Type |
| --- | --- |
| _idAssignmentTerms | <code>AssignmentTerms</code> | 

<a name="AssignmentServiceClient.initAssignmentSkillsFilter"></a>

### AssignmentServiceClient.initAssignmentSkillsFilter()
**Kind**: static method of <code>[AssignmentServiceClient](#AssignmentServiceClient)</code>  
**Summary**: Init Materialize multiselect HTML component on assignment page  
**Locus**: client  
<a name="AssignmentServiceClient.initAssignmentPopover"></a>

### AssignmentServiceClient.initAssignmentPopover()
**Kind**: static method of <code>[AssignmentServiceClient](#AssignmentServiceClient)</code>  
**Summary**: Init Materialize popover HTML component on assignment page and setup a custom leave which hide popover when mouse leave  
**Locus**: client  
<a name="AssignmentServiceClient.disableDisplayAssignedCheckbox"></a>

### AssignmentServiceClient.disableDisplayAssignedCheckbox()
**Kind**: static method of <code>[AssignmentServiceClient](#AssignmentServiceClient)</code>  
**Summary**: Manage the task list checkbox "display assigned task" according to ReactiveVar AssignmentReactiveVars.CurrentAssignmentType  
**Locus**: client  
<a name="AssignmentServiceClient.readSelectedPeopleNeedAndTimeSlotFromPopover"></a>

### AssignmentServiceClient.readSelectedPeopleNeedAndTimeSlotFromPopover() ⇒ <code>timeSlot</code> &#124; <code>null</code>
**Kind**: static method of <code>[AssignmentServiceClient](#AssignmentServiceClient)</code>  
**Summary**: Read from popover to perform filter on user list in task to user mode only.
Reactive Var :

 - Set AssignmentReactiveVars.SelectedPeopleNeed
 - Set AssignmentReactiveVars.SelectedTimeSlot  
**Locus**: Anywhere  
<a name="SecurityServiceClient"></a>

## SecurityServiceClient
**Kind**: global class  
<a name="SecurityServiceClient.grantAccessToPage"></a>

### SecurityServiceClient.grantAccessToPage(userId, neededRole, page)
**Kind**: static method of <code>[SecurityServiceClient](#SecurityServiceClient)</code>  
**Summary**: check if userId has the neededRole  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>Mongo_id</code> |  |
| neededRole | <code>RolesEnum</code> |  |
| page | <code>String</code> | for logging purpose only |

<a name="InjectDataServerService"></a>

## InjectDataServerService
**Kind**: global class  

* [InjectDataServerService](#InjectDataServerService)
    * [.injectAllData()](#InjectDataServerService.injectAllData)
    * [.deleteAll()](#InjectDataServerService.deleteAll)
    * [.initAccessRightData()](#InjectDataServerService.initAccessRightData)
    * [.populateData()](#InjectDataServerService.populateData)
    * [.createAccountAndUser(username, email, password, groupRoleId)](#InjectDataServerService.createAccountAndUser) ⇒ <code>\*</code>

<a name="InjectDataServerService.injectAllData"></a>

### InjectDataServerService.injectAllData()
**Kind**: static method of <code>[InjectDataServerService](#InjectDataServerService)</code>  
**Summary**: perform deleteAll, initAccessRightData and populateData  
<a name="InjectDataServerService.deleteAll"></a>

### InjectDataServerService.deleteAll()
**Kind**: static method of <code>[InjectDataServerService](#InjectDataServerService)</code>  
**Summmary**: delete all data  
<a name="InjectDataServerService.initAccessRightData"></a>

### InjectDataServerService.initAccessRightData()
**Kind**: static method of <code>[InjectDataServerService](#InjectDataServerService)</code>  
**Summary**: Initialize Roles and superadmin profil  
<a name="InjectDataServerService.populateData"></a>

### InjectDataServerService.populateData()
-  conf
  - 3 tasks
  - 3 users with some availabilities

**Kind**: static method of <code>[InjectDataServerService](#InjectDataServerService)</code>  
**Summary**: inject test data  
<a name="InjectDataServerService.createAccountAndUser"></a>

### InjectDataServerService.createAccountAndUser(username, email, password, groupRoleId) ⇒ <code>\*</code>
**Kind**: static method of <code>[InjectDataServerService](#InjectDataServerService)</code>  
**Summary**: insert a User and an Account  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> | unique |
| email | <code>emailformat</code> | unique |
| password |  |  |
| groupRoleId | <code>MongoId</code> &#124; <code>Array.&lt;MongoId&gt;</code> | group role to add (at least one is needed) |

<a name="SecurityServiceServer"></a>

## SecurityServiceServer
**Kind**: global class  

* [SecurityServiceServer](#SecurityServiceServer)
    * [.grantAccessToItem(userId, neededRole, doc)](#SecurityServiceServer.grantAccessToItem)
    * [.testAccessToItem(userId, neededRole)](#SecurityServiceServer.testAccessToItem) ⇒ <code>boolean</code>
    * [.grantAccessToCollection(userId, neededRole, collection)](#SecurityServiceServer.grantAccessToCollection) ⇒ <code>boolean</code>

<a name="SecurityServiceServer.grantAccessToItem"></a>

### SecurityServiceServer.grantAccessToItem(userId, neededRole, doc)
**Kind**: static method of <code>[SecurityServiceServer](#SecurityServiceServer)</code>  
**Summary**: throw error if userId does not have the role needed to update the doc  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>MongoId</code> |  |
| neededRole | <code>RoleEnum</code> |  |
| doc | <code>object</code> | the whole object to update |

<a name="SecurityServiceServer.testAccessToItem"></a>

### SecurityServiceServer.testAccessToItem(userId, neededRole) ⇒ <code>boolean</code>
same as grantAccessToItem but return true (access granted) or false (access denied) without log

**Kind**: static method of <code>[SecurityServiceServer](#SecurityServiceServer)</code>  

| Param |
| --- |
| userId | 
| neededRole | 

<a name="SecurityServiceServer.grantAccessToCollection"></a>

### SecurityServiceServer.grantAccessToCollection(userId, neededRole, collection) ⇒ <code>boolean</code>
same as grantAccessToItem but return true (access granted) or false (access denied) with

**Kind**: static method of <code>[SecurityServiceServer](#SecurityServiceServer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId |  |  |
| neededRole |  |  |
| collection | <code>String</code> | collection name to get access |

<a name="ServerAssignmentService"></a>

## ServerAssignmentService
**Kind**: global class  

* [ServerAssignmentService](#ServerAssignmentService)
    * [.propagateAssignment(assignmentId, assignment, fieldNames)](#ServerAssignmentService.propagateAssignment)
    * [.removeAssignment(assignmentId, assignment)](#ServerAssignmentService.removeAssignment)
    * [.preventUpdate()](#ServerAssignmentService.preventUpdate)
    * [.allowInsert()](#ServerAssignmentService.allowInsert)
    * [.allowUpdate()](#ServerAssignmentService.allowUpdate)
    * [.allowDelete()](#ServerAssignmentService.allowDelete)

<a name="ServerAssignmentService.propagateAssignment"></a>

### ServerAssignmentService.propagateAssignment(assignmentId, assignment, fieldNames)
**Kind**: static method of <code>[ServerAssignmentService](#ServerAssignmentService)</code>  
**Summary**: Assignments.after.insert hook. Add TaskAssignment to Task and UserAssignment to User.  
**Locus**: server  

| Param | Type |
| --- | --- |
| assignmentId | <code>MongoId</code> | 
| assignment | <code>Assignment</code> | 
| fieldNames | <code>Array.&lt;String&gt;</code> | 

<a name="ServerAssignmentService.removeAssignment"></a>

### ServerAssignmentService.removeAssignment(assignmentId, assignment)
**Kind**: static method of <code>[ServerAssignmentService](#ServerAssignmentService)</code>  
**Summary**: Assignments.after.remove hook. Remove TaskAssignment to Task and UserAssignment to User.  
**Locus**: server  

| Param | Type |
| --- | --- |
| assignmentId | <code>MongoId</code> | 
| assignment | <code>Assignment</code> | 

<a name="ServerAssignmentService.preventUpdate"></a>

### ServerAssignmentService.preventUpdate()
- Collection Hooks :  Assignments.before.update
- Assignment can not be updated

**Kind**: static method of <code>[ServerAssignmentService](#ServerAssignmentService)</code>  
**Summary**: Assignments.before.update  
<a name="ServerAssignmentService.allowInsert"></a>

### ServerAssignmentService.allowInsert()
- Collection Hooks :  Assignments.before.insert
- Needed role : ASSIGNMENTTASKUSER

**Kind**: static method of <code>[ServerAssignmentService](#ServerAssignmentService)</code>  
**Summary**: Assignments.before.insert  
<a name="ServerAssignmentService.allowUpdate"></a>

### ServerAssignmentService.allowUpdate()
- Collection Hooks :  Assignments.before.update
- Needed role : ASSIGNMENTTASKUSER

**Kind**: static method of <code>[ServerAssignmentService](#ServerAssignmentService)</code>  
**Summary**: Assignments.before.update  
<a name="ServerAssignmentService.allowDelete"></a>

### ServerAssignmentService.allowDelete()
- Collection Hooks :  Assignments.before.remove
- Needed role : ASSIGNMENTTASKUSER

**Kind**: static method of <code>[ServerAssignmentService](#ServerAssignmentService)</code>  
**Summary**: Assignments.before.remove  
<a name="ServerUserService"></a>

## ServerUserService
**Kind**: global class  

* [ServerUserService](#ServerUserService)
    * [.propagateGroupRoles(userId, doc, fieldNames, modifier, options)](#ServerUserService.propagateGroupRoles)
    * [.propagateRoles(userId, doc, fieldNames, modifier, options)](#ServerUserService.propagateRoles)
    * [.allowInsert()](#ServerUserService.allowInsert)
    * [.allowUpdate()](#ServerUserService.allowUpdate)
    * [.allowDelete()](#ServerUserService.allowDelete)

<a name="ServerUserService.propagateGroupRoles"></a>

### ServerUserService.propagateGroupRoles(userId, doc, fieldNames, modifier, options)
If group roles' roles are updated user roles are update as well.

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: GroupRoles.after.update hook  
**Locus**: server  

| Param |
| --- |
| userId | 
| doc | 
| fieldNames | 
| modifier | 
| options | 

<a name="ServerUserService.propagateRoles"></a>

### ServerUserService.propagateRoles(userId, doc, fieldNames, modifier, options)
About roles, we only add roles to the custom Users collection, **not** with the Roles library. This hooks is responsible to propagate roles to the
Meteor.users linked account.

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: Users.after.update hook.  
**Locus**: server  

| Param |
| --- |
| userId | 
| doc | 
| fieldNames | 
| modifier | 
| options | 

<a name="ServerUserService.allowInsert"></a>

### ServerUserService.allowInsert()
- Collection Hooks :  Users.before.insert
- Needed role : USERWRITE

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: Users.before.insert  
<a name="ServerUserService.allowUpdate"></a>

### ServerUserService.allowUpdate()
- Collection Hooks :  Users.before.update
- Needed role : USERWRITE
   - ROLE
   - ASSIGNMENTTASKUSER

if userId is the doc being updated, no need of USERWRITE (a user can update itself)

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: Users.before.update  
<a name="ServerUserService.allowDelete"></a>

### ServerUserService.allowDelete()
- Collection Hooks :  Users.before.remove
- Needed role : USERDELETE

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: Users.before.remove  
<a name="ServerReferenceCollectionsService"></a>

## ServerReferenceCollectionsService
**Kind**: global class  

* [ServerReferenceCollectionsService](#ServerReferenceCollectionsService)
    * [.allowInsert()](#ServerReferenceCollectionsService.allowInsert)
    * [.allowUpdate()](#ServerReferenceCollectionsService.allowUpdate)
    * [.allowDelete()](#ServerReferenceCollectionsService.allowDelete)

<a name="ServerReferenceCollectionsService.allowInsert"></a>

### ServerReferenceCollectionsService.allowInsert()
- Collection Hooks :  ReferenceCollection.before.insert
- Needed role : CONFMAKER

**Kind**: static method of <code>[ServerReferenceCollectionsService](#ServerReferenceCollectionsService)</code>  
**Summary**: ReferenceCollection.before.insert  
<a name="ServerReferenceCollectionsService.allowUpdate"></a>

### ServerReferenceCollectionsService.allowUpdate()
- Collection Hooks :  ReferenceCollection.before.update
- Needed role : CONFMAKER

**Kind**: static method of <code>[ServerReferenceCollectionsService](#ServerReferenceCollectionsService)</code>  
**Summary**: ReferenceCollection.before.update  
<a name="ServerReferenceCollectionsService.allowDelete"></a>

### ServerReferenceCollectionsService.allowDelete()
- Collection Hooks :  ReferenceCollection.before.remove
- Needed role : CONFMAKER

**Kind**: static method of <code>[ServerReferenceCollectionsService](#ServerReferenceCollectionsService)</code>  
**Summary**: ReferenceCollection.before.remove  
<a name="ServerService"></a>

## ServerService
**Kind**: global class  
<a name="ServerService.addCollectionHooks"></a>

### ServerService.addCollectionHooks()
Add hooks to the following collection
 - Assignments
 - Users
 - GroupRoles
 - Tasks
 - all ReferenceCollection

 See collection server service to have details about hooks

**Kind**: static method of <code>[ServerService](#ServerService)</code>  
**Summary**: add collection hooks  
<a name="ServerTaskService"></a>

## ServerTaskService
**Kind**: global class  

* [ServerTaskService](#ServerTaskService)
    * [.allowInsert()](#ServerTaskService.allowInsert)
    * [.allowUpdate()](#ServerTaskService.allowUpdate)
    * [.allowDelete()](#ServerTaskService.allowDelete)

<a name="ServerTaskService.allowInsert"></a>

### ServerTaskService.allowInsert()
- Collection Hooks :  Tasks.before.insert
- Needed role : TASKWRITE

**Kind**: static method of <code>[ServerTaskService](#ServerTaskService)</code>  
**Summary**: Tasks.before.insert  
<a name="ServerTaskService.allowUpdate"></a>

### ServerTaskService.allowUpdate()
- Collection Hooks :  Tasks.before.update
- Needed role : TASKWRITE
  - ACCESSPASSVALIDATION
  - ASSIGNMENTVALIDATION
  - EQUIPMENTVALIDATION
  - ASSIGNMENTTASKUSER

  Also check task validation state to authorize

**Kind**: static method of <code>[ServerTaskService](#ServerTaskService)</code>  
**Summary**: Tasks.before.update  
<a name="ServerTaskService.allowDelete"></a>

### ServerTaskService.allowDelete()
- Collection Hooks :  Tasks.before.delete
- Needed role : TASKDELETE

**Kind**: static method of <code>[ServerTaskService](#ServerTaskService)</code>  
**Summary**: Tasks.before.delete  
<a name="ServerUserService"></a>

## ServerUserService
**Kind**: global class  

* [ServerUserService](#ServerUserService)
    * [.propagateGroupRoles(userId, doc, fieldNames, modifier, options)](#ServerUserService.propagateGroupRoles)
    * [.propagateRoles(userId, doc, fieldNames, modifier, options)](#ServerUserService.propagateRoles)
    * [.allowInsert()](#ServerUserService.allowInsert)
    * [.allowUpdate()](#ServerUserService.allowUpdate)
    * [.allowDelete()](#ServerUserService.allowDelete)

<a name="ServerUserService.propagateGroupRoles"></a>

### ServerUserService.propagateGroupRoles(userId, doc, fieldNames, modifier, options)
If group roles' roles are updated user roles are update as well.

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: GroupRoles.after.update hook  
**Locus**: server  

| Param |
| --- |
| userId | 
| doc | 
| fieldNames | 
| modifier | 
| options | 

<a name="ServerUserService.propagateRoles"></a>

### ServerUserService.propagateRoles(userId, doc, fieldNames, modifier, options)
About roles, we only add roles to the custom Users collection, **not** with the Roles library. This hooks is responsible to propagate roles to the
Meteor.users linked account.

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: Users.after.update hook.  
**Locus**: server  

| Param |
| --- |
| userId | 
| doc | 
| fieldNames | 
| modifier | 
| options | 

<a name="ServerUserService.allowInsert"></a>

### ServerUserService.allowInsert()
- Collection Hooks :  Users.before.insert
- Needed role : USERWRITE

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: Users.before.insert  
<a name="ServerUserService.allowUpdate"></a>

### ServerUserService.allowUpdate()
- Collection Hooks :  Users.before.update
- Needed role : USERWRITE
   - ROLE
   - ASSIGNMENTTASKUSER

if userId is the doc being updated, no need of USERWRITE (a user can update itself)

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: Users.before.update  
<a name="ServerUserService.allowDelete"></a>

### ServerUserService.allowDelete()
- Collection Hooks :  Users.before.remove
- Needed role : USERDELETE

**Kind**: static method of <code>[ServerUserService](#ServerUserService)</code>  
**Summary**: Users.before.remove  
