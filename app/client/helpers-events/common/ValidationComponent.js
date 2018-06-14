import {ValidationService} from "../../../both/service/ValidationService"
import {SecurityServiceClient} from "../../../client/service/SecurityServiceClient"

class ValidationComponent extends BlazeComponent {


  /**
   * All are mandatory, no data check
   * validationTypeLabel : displayed label
   * validationTypeName : variable (string without spaces or special char)
   * validationData : see Validation Schema
   * validationRole : see Roles enum
   * targetCollectionWriteRole
   * targetCollection : Mongo collection
   * targetItemId : Mongo collection _id
   */


  events() {
    return [{
      "click .toggle-validation-comments-list": this.switchListDeveloped,
      "click .askforvalidation-button,.refuse-button,.close-button": this.changeState,
    }];
  }

  template() {
    return "validationComponent"
  }

  onCreated() {
    this.commentListDeveloped = new ReactiveVar(false);
  }


  /**
   * this var is used to determine which icon should be displayed (to expand/collapse). The collapsing itself in made in bootstrap
   */
  isCommentsListDeveloped() {
    return this.commentListDeveloped.get();
  }

  switchListDeveloped(event) {
    this.commentListDeveloped.set(!this.commentListDeveloped.get());
  }

  /**
   * This function states if the comment input has to be displayed or not
   * @param validationType 'EQUIPMENTVALIDATION' or 'ASSIGNMENTVALIDATION'
   * @param state 'TOBEVALIDATED' or 'OPEN' or 'READY' or 'REFUSED'
   * @returns {boolean}
   */
  displayTextArea(validationType, state) {
    if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
      (state === "TOBEVALIDATED" || state === "READY"))
      return false;
    return true;
  }

  /**
   * @summary Update validation state
   * @locus client
   * @param event
   */
  changeState(event) {
    var state = this.$(event.target).data('state');

    if (state === "to-be-validated") {
      SecurityServiceClient.grantAccessToPage(this.data().targetCollectionWriteRole);
    } else {
      SecurityServiceClient.grantAccessToPage(this.data().validationRole, `${this.data().validationTypeLabel} validation`);
    }

    var comment = this.$(".validation-new-comment").val();
    this.$(".validation-new-comment").val("");

    ValidationService.updateValidation(window[this.data().targetCollection], this.data().targetItemId, ValidationStateUrl[state], ValidationTypeUrl[this.data().validationTypeName], comment);
  }

}


ValidationComponent.register("ValidationComponent");
