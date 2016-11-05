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
            bootbox.confirm("You are about to delete a task, are you sure ?", _.bind(function(result){
                if(result){
                    Router.go("/tasks");
                    this.remove();
                }
            },this));
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


