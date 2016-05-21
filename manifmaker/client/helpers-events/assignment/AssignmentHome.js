class AssignmentHome extends BlazeComponent{

    constructor(){
        super();
        this.UserFilter = new ReactiveVar(defaultFilter);
        this.UserIndexFilter = new ReactiveVar(noSearchFilter);
        this.UserTeamFilter = new ReactiveVar(defaultFilter);
        this.UserSkillsFilter = new ReactiveVar(defaultFilter);
    }

    self(){
        return this;
    }

    template(){
        return "assignmentHome"
    }

}


AssignmentHome.register("AssignmentHome");