class ValidationStateForListComponent extends BlazeComponent {


    /**
     * All are mandatories, no data check
     * dataValidation : see Validation schema
     * mdiIcon : mdi class to add a related icon
     * validationTypeLabel : displayed label
     */


    template() {
        return "validationStateForList"
    }

    lastComment(attribute, type) {
        var lastComment;
        this.data().dataValidation.comments.forEach(comment => {
            if (!lastComment)
                lastComment = comment;
            if (new moment(comment.creationDate).isAfter(new moment(lastComment.creationDate))) {
                lastComment = comment
            }
        });
        return lastComment[attribute];
    }


    lastComment(attribute, type) {
        var lastComment;
        this.data().dataValidation.comments.forEach(comment => {
            if (!lastComment)
                lastComment = comment;
            if (new moment(comment.creationDate).isAfter(new moment(lastComment.creationDate))) {
                lastComment = comment
            }
        });
        return lastComment[attribute];
    }
}

ValidationStateForListComponent.register("ValidationStateForListComponent");