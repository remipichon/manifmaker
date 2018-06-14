export class ValidationService {


  /**
   * @memberOf ValidationService
   * @summary Add a new comment and update validation status of a given task. Does't do any security check as we can basically reach every state from every state
   * @locus Anywhere
   * @param TargetCollection : Mongo Collection
   * @param itemId
   * @param validationStateAsked
   * @param validationType
   * @param comment
   */
  static updateValidation(TargetCollection, itemId, validationStateAsked, validationType, comment) {
    var task = TargetCollection.findOne(itemId);
    var validationState = task[validationType];

    var now = new Date();
    validationState.comments.unshift({
      author: Meteor.users.findOne(Meteor.userId).username,
      content: comment,
      creationDate: now,
      stateBefore: validationState.currentState,
      stateAfter: validationStateAsked
    });
    validationState.currentState = validationStateAsked;
    validationState.lastUpdateDate = now;

    TargetCollection.update({_id: task._id}, {$set: {[validationType]: validationState}});
  }

  static isUpdateAllowed(state) {
    if (state === ValidationState.OPEN || state === ValidationState.REFUSED)
      return true;
    return false
  }

}