import {AssignmentServiceClient} from "../../../client/service/AssignmentServiceClient"

class AssignmentTermButtonsComponent extends BlazeComponent{
    template(){
        return "assignmentTermButtonsComponent";
    }

    events(){
        return [{
            "click .assignments-terms-button": function (event) {
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
        terms[i].selected = "disabled";
        console.info(selectedTermId,i);

        return terms;

    }
}

AssignmentTermButtonsComponent.register("AssignmentTermButtonsComponent");