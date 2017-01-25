export class TaskGroupServiceClient{
    static beforeRemove(context) {
        var groupId = context.currentData()._id;
        var taskInGroup = Tasks.find({groupId: groupId}).fetch();
        var taskCount = taskInGroup.length;
        bootbox.confirm({
                title: "You are about to delete a task group, are you sure ?",
                message: "The "+taskCount+" tasks linked to this group will not be deleted.",
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: _.bind(function (result) {
                    if (result) {
                        Router.go("/task-groups");
                        this.remove();
                    }
                }, context)
            }
        );
    }
}