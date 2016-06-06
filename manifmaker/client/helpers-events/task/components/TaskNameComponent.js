class TaskNameComponent extends BlazeComponent{
    template() {
        return "taskNameEdit";
    }

    constructor(){
        super();
        this.nameIsEditingReactive = new ReactiveVar(false);

    }

    events() {
        return [
            {
                "input .header-limited-to-text": this.displayDoneButton,//TODO more precise selector
                "click #done-name": this.updateName,//TODO more precise selector
                "click #edit-name": this.focusName,//TODO more precise selector,
                "keydown #edit-task-name-content": this.enterKeydown
            }
        ];
    }

    nameIsEditing() {
        return this.nameIsEditingReactive.get();
    }

    enterKeydown(e){
        if (e.which == 13 && e.shiftKey == false) {
            //Prevent insertion of a return
            //You could do other things here, for example
            //focus on the next field
            this.updateName();
            e.preventDefault();
            e.stopPropagation();
            this.$("#edit-task-name-content").blur();
            return false;
        }
    }

    displayDoneButton() {
        this.nameIsEditingReactive.set(true);
    }

    focusName() {
        $("[data-key=name]").focus();
        this.nameIsEditingReactive.set(true);
    }

    updateName(e) {
        this.nameIsEditingReactive.set(false);

        var name = $("[data-key=name]").html();
        if (Tasks.simpleSchema().namedContext("updateTask").validateOne({name: name}, "name")) {
            Tasks.update({_id: this.data()._id}, {
                $set: {
                    name: name
                }
            })
        } else {
            //TODO add error ?
        }
    }

}


TaskNameComponent.register("TaskNameComponent");