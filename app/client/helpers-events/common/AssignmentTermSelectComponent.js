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
        if(this.data() && this.data().teams)
            terms =  AssignmentTerms.find({teams:{$in:this.data().teams}});
        else
            terms = AssignmentTerms.find();
        terms = terms.fetch();

        if(terms.length === 0 && this.data() && this.data().callbackIfNothingToDisplay)
            this.data().callbackIfNothingToDisplay();

        //select the currently used term
        var selectedTermId = AssignmentCalendarDisplayedDays.findOne().assignmentTermId;
        var i = terms.indexOf(_.findWhere(terms,{_id:selectedTermId}));
        terms[i].selected = "selected";
        console.info(selectedTermId,i);

        return terms;

    }
}

AssignmentTermSelectComponent.register("AssignmentTermSelectComponent");