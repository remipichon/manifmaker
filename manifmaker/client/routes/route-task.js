import {ValidationService} from "../../both/service/ValidationService"
import {SecurityServiceClient} from "../../client/service/SecurityServiceClient"

/**
 * @memberOf Route
 * @namespace Route.Task
 */

/**
 * @memberOf Route.Task
 * @summary Display tasks list
 * @locus client
 * @name 'home'  /tasks
 */
Router.route('/tasks', function () {
        this.wait(Meteor.subscribe('users'));
        this.wait(Meteor.subscribe('tasks'));

        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKREAD);
        console.info("routing", "/tasks");

        if (this.ready()) {
            this.render('tasksList', {
                to: 'mainContent'
            });
        } else {
            console.log("Route /tasks : waiting users and tasks data"); //TODO add a spinner
        }
    },
    {name: 'task.list'}
)

/**
 * @memberOf Route.Task
 * @summary Display the create task form without time slots and validation workflow
 * @locus client
 * @name 'task.create'  /task
 */
Router.route('/task', function () {
        this.wait(Meteor.subscribe('users'));

        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKWRITE);
        console.info("routing", "/task");

        if (this.ready()) {
            this.render('insertTaskForm', {
                to: 'mainContent'
            });
        } else {
            console.log("Route /task : waiting team data"); //TODO add a spinner
        }

    },
    {name: 'task.create'}
);

/**
 * @memberOf Route.Task
 * @summary Display the task update form by it's MongoId
 * @locus client
 * @param taskId
 * @name 'task.read'  /task/:_id
 */
Router.route('/task/:_id', function () {
        this.wait(Meteor.subscribe('tasks'));
        this.wait(Meteor.subscribe('teams'));
        this.wait(Meteor.subscribe('places'));
        this.wait(Meteor.subscribe('skills'));
        this.wait(Meteor.subscribe('users'));
        this.wait(Meteor.subscribe('power-supplies'));

        if (this.ready()) {

            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKWRITE);
            console.info("routing", "/task/" + this.params._id);

            if(!Tasks.findOne(this.params._id)){
                console.info("routing", "task not found, rerouting to /tasks");
                Router.go("/tasks");
            }


            this.render('updateTaskForm', {
                data: function () {
                    var currentTask = this.params._id;
                    return Tasks.findOne({_id: currentTask});
                }, to: 'mainContent'
            });
        } else {
            console.log("waiting for data")
        }
    },
    {name: 'task.update'}
);


/**
 * @memberOf Route.Task
 * @summary Display the task in read mode by it's MongoId
 * @locus client
 * @param taskId
 * @name 'task.read'  /task/:_id
 */
Router.route('/task/:_id/read', function () {
        this.wait(Meteor.subscribe('tasks'));
        this.wait(Meteor.subscribe('teams'));
        this.wait(Meteor.subscribe('places'));
        this.wait(Meteor.subscribe('skills'));
        this.wait(Meteor.subscribe('users'));
        this.wait(Meteor.subscribe('power-supplies'));

        if (this.ready()) {

            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKREAD);
            console.info("routing", "/task/" + this.params._id);

            if(!Tasks.findOne(this.params._id)){
                console.info("routing", "task not found, rerouting to /tasks");
                Router.go("/tasks");
            }

            this.render('readTaskForm', {
                data: function () {
                    var currentTask = this.params._id;
                    return Tasks.findOne({_id: currentTask});
                }, to: 'mainContent'
            });

        } else {
            console.log("waiting for data")
        }
    },
    {name: 'task.read'}
);

