import {ValidationService} from "../../both/service/ValidationService"
import {SecurityServiceClient} from "../../client/service/SecurityServiceClient"
import {ManifMakerRouterController} from "./ManifMakerRouterController"

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
    {controller: ManifMakerRouterController,name: 'task.list'}
)

/**
 * @memberOf Route.Task
 * @summary Display the create task form without time slots and validation workflow
 * @locus client
 * @name 'task.create'  /task
 */
Router.route('/task', function () {

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
    {controller: ManifMakerRouterController,name: 'task.create'}
);

/**
 * @memberOf Route.Task
 * @summary Display the task update form by it's MongoId
 * @locus client
 * @param taskId
 * @name 'task.read'  /task/:_id
 */
Router.route('/task/:_id', function () {

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
    {controller: ManifMakerRouterController,name: 'task.update'}
);


/**
 * @memberOf Route.Task
 * @summary Display the task in read mode by it's MongoId
 * @locus client
 * @param taskId
 * @name 'task.read'  /task/:_id
 */
Router.route('/task/:_id/read', function () {

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
    {controller: ManifMakerRouterController, name: 'task.read'}
);

/**
 * @memberOf Route.Task
 * @summary Update validation state for one the task part
 * @locus client
 * @param validationType
 * @param taskId
 * @param validationState
 * @name 'task.validation.timeSlot'  /task/validation/:validationType/:_id/:state
 */
Router.route('/task/validation/:validationType/:_id/:state', function () {
        if (this.params.state === "to-be-validated") {
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKWRITE);
        } else {
            var validationType = this.params.validationType;
            if (validationType === "time-slot")
                SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ASSIGNMENTVALIDATION, "time slot validation");
            if (validationType === "access-pass")
                SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ACCESSPASSVALIDATION, "access pass validation");
            if (validationType === "equipment")
                SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.EQUIPMENTVALIDATION, "equipment validation");
        }
        console.info("routing", "/task/validation/" + this.params.validationType + "/" + this.params._id + "/" + this.params.state);

        var comment = $("#" + this.params.validationType + "-validation-new-comment").val();
        $("#" + this.params.validationType + "-validation-new-comment").val("");

        ValidationService.updateValidation(this.params._id, ValidationStateUrl[this.params.state], ValidationTypeUrl[this.params.validationType], comment);

        this.redirect("/task/" + this.params._id);

    },
    {controller: ManifMakerRouterController,name: 'task.validation.timeSlot'}
);










