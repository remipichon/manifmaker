import {SecurityServiceClient} from "../../client/service/SecurityServiceClient";
import {ManifMakerRouterController} from "./ManifMakerRouterController";

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

    SecurityServiceClient.grantAccessToPage(RolesEnum.TASKREAD);
    console.info("routing", "/tasks");

    this.render('tasksList', {
      to: 'mainContent'
    });
  },
  {data: {currentTab: 'Tasks'}, controller: ManifMakerRouterController, name: 'task.list'}
)

/**
 * @memberOf Route.Task
 * @summary Display the create task form without time slots and validation workflow
 * @locus client
 * @name 'task.create'  /task
 */
Router.route('/task', function () {

    SecurityServiceClient.grantAccessToPage(RolesEnum.TASKWRITE);
    console.info("routing", "/task?groupId=" + this.params.query.groupId);

    this.render('insertTaskForm', {
      data: _.bind(function () {
        return {groupId: this.params.query.groupId};
      }, this),
      to: 'mainContent'
    });

  },
  {data: {currentTab: 'Tasks'}, controller: ManifMakerRouterController, name: 'task.create'}
);

/**
 * @memberOf Route.Task
 * @summary Display the task update form by it's MongoId
 * @locus client
 * @param taskId
 * @name 'task.read'  /task/:_id
 */
Router.route('/task/:_id', function () {
    SecurityServiceClient.grantAccessToPage(RolesEnum.TASKWRITE);
    console.info("routing", "/task/" + this.params._id);

    if (!Tasks.findOne(this.params._id)) {
      console.info("routing", "task not found, rerouting to /tasks");
      Router.go("/tasks");
    }


    this.render('updateTaskForm', {
      data: function () {
        var currentTask = this.params._id;
        return Tasks.findOne({_id: currentTask});
      }, to: 'mainContent'
    });
  },
  {data: {currentTab: 'Tasks'}, controller: ManifMakerRouterController, name: 'task.update'}
);


/**
 * @memberOf Route.Task
 * @summary Display the task in read mode by it's MongoId
 * @locus client
 * @param taskId
 * @name 'task.read'  /task/:_id
 */
Router.route('/task/:_id/read', function () {
    SecurityServiceClient.grantAccessToPage(RolesEnum.TASKREAD);
    console.info("routing", "/task/" + this.params._id);

    if (!Tasks.findOne(this.params._id)) {
      console.info("routing", "task not found, rerouting to /tasks");
      Router.go("/tasks");
    }

    this.render('readTaskForm', {
      data: function () {
        var currentTask = this.params._id;
        return Tasks.findOne({_id: currentTask});
      }, to: 'mainContent'
    });

  },
  {data: {currentTab: 'Tasks'}, controller: ManifMakerRouterController, name: 'task.read'}
);
