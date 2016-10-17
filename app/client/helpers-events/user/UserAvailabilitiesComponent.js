
class UserAvailabilitiesComponent extends BlazeComponent{

    reactiveConstructor() {
    }

    constructor() {
        super();

    }

    template(){
        return "userAvailabilities"
    }

    events() {
        return [
            {

            }
        ];
    }

    userData(){
        return this.data().parentInstance.data()
    }


    self() {
        return this;
    }

}

UserAvailabilitiesComponent.register("UserAvailabilitiesComponent");
