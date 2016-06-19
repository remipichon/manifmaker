## Classes

<dl>
<dt><a href="#AssignmentServiceClient">AssignmentServiceClient</a></dt>
<dd></dd>
<dt><a href="#ServerAssignmentService">ServerAssignmentService</a></dt>
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
<a name="ServerAssignmentService"></a>

## ServerAssignmentService
**Kind**: global class  

* [ServerAssignmentService](#ServerAssignmentService)
    * [.propagateAssignment(assignmentId, assignment, fieldNames)](#ServerAssignmentService.propagateAssignment)
    * [.removeAssignment(assignmentId, assignment)](#ServerAssignmentService.removeAssignment)

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

