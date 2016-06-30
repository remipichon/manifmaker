class UpdateActivityComponent extends BlazeComponent {

    self() {
        return this;
    }


    template() {
        return "updateActivityComponent";
    }


    activityDoc(){
        return Activities.findOne(this.data()._id);
    }


}

UpdateActivityComponent.register('UpdateActivityComponent');
