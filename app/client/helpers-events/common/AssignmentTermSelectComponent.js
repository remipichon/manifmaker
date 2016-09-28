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
        return AssignmentTerms.find({});
    }
}

AssignmentTermSelectComponent.register("AssignmentTermSelectComponent");