Template.taskButtons.helpers({
    onDeleteSuccess: function() {
        return function () {
            sAlert.info("Task has been successfully deleted");
        }
    },

    onDeleteError: function() {
        return function (error) {
            sAlert.info(`Something went wrong when deleting Task (${error})`);
            console.error(`Something went wrong when deleting Task (${error})`);
        }
    },

    beforeRemove: function() {
        return function () {
            //TODO add a better dialog box to confirm deletion
            if(window.confirm("About to delete the task")){
                Router.go("/tasks");
                this.remove();
            }
        }
    }
});

Template.validationStateForList.helpers({
    lastComment: function (attribute, type) {
        var lastComment;
        this[type].comments.forEach(comment => {
            if (!lastComment)
                lastComment = comment;
            if (new moment(comment.creationDate).isAfter(new moment(lastComment.creationDate))) {
                lastComment = comment
            }
        });
        return lastComment[attribute];
    }
});


