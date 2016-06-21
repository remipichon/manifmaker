<a name="Meteor Methods"></a>

## Meteor Methods : <code>object</code>
**Kind**: global namespace  

* [Meteor Methods](#Meteor Methods) : <code>object</code>
    * [.removeAssignUserToTaskTimeSlot(peopleNeedId, userId, taskId, timeSlotId)](#Meteor Methods.removeAssignUserToTaskTimeSlot) ⇒ <code>assignment</code>
    * [.assignUserToTaskTimeSlot(peopleNeedId, userId, taskId, timeSlotId)](#Meteor Methods.assignUserToTaskTimeSlot) ⇒ <code>MongoId</code>

<a name="Meteor Methods.removeAssignUserToTaskTimeSlot"></a>

### Meteor Methods.removeAssignUserToTaskTimeSlot(peopleNeedId, userId, taskId, timeSlotId) ⇒ <code>assignment</code>
- restore users' availabilities
 - move back task's people need to task's people need assigned
 - remove Assignment document

**Kind**: static method of <code>[Meteor Methods](#Meteor Methods)</code>  
**Summary**: Remove assignment for a user.  
**Locus**: anywhere  

| Param | Type |
| --- | --- |
| peopleNeedId | <code>MongoId</code> | 
| userId | <code>MongoId</code> | 
| taskId | <code>MongoId</code> | 
| timeSlotId | <code>MongoId</code> | 

<a name="Meteor Methods.assignUserToTaskTimeSlot"></a>

### Meteor Methods.assignUserToTaskTimeSlot(peopleNeedId, userId, taskId, timeSlotId) ⇒ <code>MongoId</code>
**Kind**: static method of <code>[Meteor Methods](#Meteor Methods)</code>  
**Summary**: Assign a specific people need to a user.

 - remove users' availabilities
 - move task's people need to task's people need assigned
 - insert Assignment document  
**Returns**: <code>MongoId</code> - assignmentId  
**Locus**: anywhere  

| Param | Type |
| --- | --- |
| peopleNeedId | <code>MongoId</code> | 
| userId | <code>MongoId</code> | 
| taskId | <code>MongoId</code> | 
| timeSlotId | <code>MongoId</code> | 

