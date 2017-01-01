import {ValidationService} from "../../both/service/ValidationService"
import {SecurityServiceClient} from "../../client/service/SecurityServiceClient"
import {ManifMakerRouterController} from "./ManifMakerRouterController"

/**
 * @memberOf Route
 * @namespace Route.TaskGroup
 */

/**
 * @memberOf Route.TaskGroup
 * @summary Display taskGroups list
 * @locus client
 * @name 'home'  /task-groups
 */
Router.route('/task-groups', function () {

        SecurityServiceClient.grantAccessToPage( RolesEnum.TASKGROUPREAD);
        console.info("routing", "/task-groups");

        if (this.ready()) {
            this.render('taskGroupsList', {
                to: 'mainContent'
            });
        } else {
            console.log("Route /task-groups : waiting users and taskGroups data"); //TODO add a spinner
        }
    },
    {data:{currentTab:'Tasks'},controller: ManifMakerRouterController,name: 'task-group.list'}
)

/**
 * @memberOf Route.TaskGroup
 * @summary Display the create taskGroup form without time slots and validation workflow
 * @locus client
 * @name 'taskGroup.create'  /task-group
 */
Router.route('/task-group', function () {

        SecurityServiceClient.grantAccessToPage( RolesEnum.TASKGROUPWRITE);
        console.info("routing", "/task-group");

        if (this.ready()) {
            this.render('insertTaskGroupForm', {
                to: 'mainContent'
            });
        } else {
            console.log("Route /task-group : waiting team data"); //TODO add a spinner
        }

    },
    {data:{currentTab:'Tasks'},controller: ManifMakerRouterController,name: 'task-group.create'}
);

/**
 * @memberOf Route.TaskGroup
 * @summary Display the taskGroup update form by it's MongoId
 * @locus client
 * @param taskGroupId
 * @name 'taskGroup.read'  /task-group/:_id
 */
Router.route('/task-group/:_id', function () {
        SecurityServiceClient.grantAccessToPage( RolesEnum.TASKGROUPWRITE);
        console.info("routing", "/task-group/" + this.params._id);

        if(!TaskGroups.findOne(this.params._id)){
            console.info("routing", "taskGroup not found, rerouting to /task-groups");
            Router.go("/task-groups");
        }


        this.render('updateTaskGroupForm', {
            data: function () {
                var currentTaskGroup = this.params._id;
                return TaskGroups.findOne({_id: currentTaskGroup});
            }, to: 'mainContent'
        });
    },
    {data:{currentTab:'Tasks'},controller: ManifMakerRouterController,name: 'task-group.update'}
);


/**
 * @memberOf Route.TaskGroup
 * @summary Display the taskGroup in read mode by it's MongoId
 * @locus client
 * @param taskGroupId
 * @name 'taskGroup.read'  /task-group/:_id
 */
Router.route('/task-group/:_id/read', function () {
        SecurityServiceClient.grantAccessToPage( RolesEnum.TASKGROUPREAD);
        console.info("routing", "/task-group/" + this.params._id);

        if(!TaskGroups.findOne(this.params._id)){
            console.info("routing", "taskGroup not found, rerouting to /task-groups");
            Router.go("/task-groups");
        }

        this.render('readTaskGroupForm', {
            data: function () {
                var currentTaskGroup = this.params._id;
                return TaskGroups.findOne({_id: currentTaskGroup});
            }, to: 'mainContent'
        });

    },
    {data:{currentTab:'Tasks'},controller: ManifMakerRouterController, name: 'task-group.read'}
);
