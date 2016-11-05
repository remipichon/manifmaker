<a name="Route"></a>

## Route : <code>object</code>
**Kind**: global namespace  

* [Route](#Route) : <code>object</code>
    * [.common](#Route.common) : <code>object</code>
        * [.home  /](#Route.common.home  /)
        * [.login  /login](#Route.common.login  /login)
        * [.forbidden  /login](#Route.common.forbidden  /login)
        * [.demo-select  /demo-select](#Route.common.demo-select  /demo-select)
        * [.inject-data  /inject-data](#Route.common.inject-data  /inject-data)
    * [.TaskGroup](#Route.TaskGroup) : <code>object</code>
        * [.home  /task-groups](#Route.TaskGroup.home  /task-groups)
        * [.taskGroup.create  /task-group](#Route.TaskGroup.taskGroup.create  /task-group)
        * [.taskGroup.read  /task-group/:_id](#Route.TaskGroup.taskGroup.read  /task-group/__id)
        * [.taskGroup.read  /task-group/:_id](#Route.TaskGroup.taskGroup.read  /task-group/__id)
    * [.Task](#Route.Task) : <code>object</code>
        * [.home  /tasks](#Route.Task.home  /tasks)
        * [.task.create  /task](#Route.Task.task.create  /task)
        * [.task.read  /task/:_id](#Route.Task.task.read  /task/__id)
        * [.task.read  /task/:_id](#Route.Task.task.read  /task/__id)
    * [.User](#Route.User) : <code>object</code>
        * [.user.list  /users](#Route.User.user.list  /users)
        * [.user.create  /user](#Route.User.user.create  /user)
        * [.user.register  /user](#Route.User.user.register  /user)
        * [.user.read  /user/:_id](#Route.User.user.read  /user/__id)
        * [.user.read  /user/:_id](#Route.User.user.read  /user/__id)
        * [.logout  /logout](#Route.User.logout  /logout)

<a name="Route.common"></a>

### Route.common : <code>object</code>
**Kind**: static namespace of <code>[Route](#Route)</code>  

* [.common](#Route.common) : <code>object</code>
    * [.home  /](#Route.common.home  /)
    * [.login  /login](#Route.common.login  /login)
    * [.forbidden  /login](#Route.common.forbidden  /login)
    * [.demo-select  /demo-select](#Route.common.demo-select  /demo-select)
    * [.inject-data  /inject-data](#Route.common.inject-data  /inject-data)

<a name="Route.common.home  /"></a>

#### common.home  /
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Home  
**Locus**: client  
<a name="Route.common.login  /login"></a>

#### common.login  /login
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Login  
**Locus**: client  
<a name="Route.common.forbidden  /login"></a>

#### common.forbidden  /login
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Login  
**Locus**: client  
<a name="Route.common.demo-select  /demo-select"></a>

#### common.demo-select  /demo-select
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Demo du custom select  
**Locus**: client  
<a name="Route.common.inject-data  /inject-data"></a>

#### common.inject-data  /inject-data
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Inject Dada (remove all before)  
**Locus**: client  
<a name="Route.TaskGroup"></a>

### Route.TaskGroup : <code>object</code>
**Kind**: static namespace of <code>[Route](#Route)</code>  

* [.TaskGroup](#Route.TaskGroup) : <code>object</code>
    * [.home  /task-groups](#Route.TaskGroup.home  /task-groups)
    * [.taskGroup.create  /task-group](#Route.TaskGroup.taskGroup.create  /task-group)
    * [.taskGroup.read  /task-group/:_id](#Route.TaskGroup.taskGroup.read  /task-group/__id)
    * [.taskGroup.read  /task-group/:_id](#Route.TaskGroup.taskGroup.read  /task-group/__id)

<a name="Route.TaskGroup.home  /task-groups"></a>

#### TaskGroup.home  /task-groups
**Kind**: static property of <code>[TaskGroup](#Route.TaskGroup)</code>  
**Summary**: Display taskGroups list  
**Locus**: client  
<a name="Route.TaskGroup.taskGroup.create  /task-group"></a>

#### TaskGroup.taskGroup.create  /task-group
**Kind**: static property of <code>[TaskGroup](#Route.TaskGroup)</code>  
**Summary**: Display the create taskGroup form without time slots and validation workflow  
**Locus**: client  
<a name="Route.TaskGroup.taskGroup.read  /task-group/__id"></a>

#### TaskGroup.taskGroup.read  /task-group/:_id
**Kind**: static property of <code>[TaskGroup](#Route.TaskGroup)</code>  
**Summary**: Display the taskGroup update form by it's MongoId  
**Locus**: client  

| Param |
| --- |
| taskGroupId | 

<a name="Route.TaskGroup.taskGroup.read  /task-group/__id"></a>

#### TaskGroup.taskGroup.read  /task-group/:_id
**Kind**: static property of <code>[TaskGroup](#Route.TaskGroup)</code>  
**Summary**: Display the taskGroup in read mode by it's MongoId  
**Locus**: client  

| Param |
| --- |
| taskGroupId | 

<a name="Route.Task"></a>

### Route.Task : <code>object</code>
**Kind**: static namespace of <code>[Route](#Route)</code>  

* [.Task](#Route.Task) : <code>object</code>
    * [.home  /tasks](#Route.Task.home  /tasks)
    * [.task.create  /task](#Route.Task.task.create  /task)
    * [.task.read  /task/:_id](#Route.Task.task.read  /task/__id)
    * [.task.read  /task/:_id](#Route.Task.task.read  /task/__id)

<a name="Route.Task.home  /tasks"></a>

#### Task.home  /tasks
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Display tasks list  
**Locus**: client  
<a name="Route.Task.task.create  /task"></a>

#### Task.task.create  /task
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Display the create task form without time slots and validation workflow  
**Locus**: client  
<a name="Route.Task.task.read  /task/__id"></a>

#### Task.task.read  /task/:_id
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Display the task update form by it's MongoId  
**Locus**: client  

| Param |
| --- |
| taskId | 

<a name="Route.Task.task.read  /task/__id"></a>

#### Task.task.read  /task/:_id
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Display the task in read mode by it's MongoId  
**Locus**: client  

| Param |
| --- |
| taskId | 

<a name="Route.User"></a>

### Route.User : <code>object</code>
**Kind**: static namespace of <code>[Route](#Route)</code>  

* [.User](#Route.User) : <code>object</code>
    * [.user.list  /users](#Route.User.user.list  /users)
    * [.user.create  /user](#Route.User.user.create  /user)
    * [.user.register  /user](#Route.User.user.register  /user)
    * [.user.read  /user/:_id](#Route.User.user.read  /user/__id)
    * [.user.read  /user/:_id](#Route.User.user.read  /user/__id)
    * [.logout  /logout](#Route.User.logout  /logout)

<a name="Route.User.user.list  /users"></a>

#### User.user.list  /users
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Display the user list with filter and search  
**Locus**: client  
<a name="Route.User.user.create  /user"></a>

#### User.user.create  /user
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Redirect tp the register user form  
**Locus**: client  
<a name="Route.User.user.register  /user"></a>

#### User.user.register  /user
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Display register form  
**Locus**: client  
<a name="Route.User.user.read  /user/__id"></a>

#### User.user.read  /user/:_id
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Display the user update form by it's MongoId  
**Locus**: client  

| Param |
| --- |
| userId | 

<a name="Route.User.user.read  /user/__id"></a>

#### User.user.read  /user/:_id
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Display the user in read mode by it's MongoId  
**Locus**: client  

| Param |
| --- |
| userId | 

<a name="Route.User.logout  /logout"></a>

#### User.logout  /logout
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Logout usser  
**Locus**: client  
