import {AssignmentServiceClient} from "../../../client/service/AssignmentServiceClient"

class AssignmentTermSelectComponent extends BlazeComponent{
    template(){
        return "assignmentTermSelectComponent";
    }

    events(){
        return [{
            "change #assignments-terms-select": function (event) {
                var _id = $(event.target).val();
                AssignmentServiceClient.setCalendarTerms(_id);
            }
        }]
    }

    
    assignmentTerms() {
        var terms;
        if(this.data().teams)
            terms =  AssignmentTerms.find({teams:{$in:this.data().teams}});
        else
            terms = AssignmentTerms.find();

        if(terms.fetch().length === 0 && this.data().callbackIfNothingToDisplay)
            this.data().callbackIfNothingToDisplay();

        return terms;

    }
}

AssignmentTermSelectComponent.register("AssignmentTermSelectComponent");