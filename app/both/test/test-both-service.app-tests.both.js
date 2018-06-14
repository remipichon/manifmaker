import {assert} from 'meteor/practicalmeteor:chai';

import "../collection/model/enum/ValidationState.js"
import {ValidationService} from "/both/service/ValidationService"

describe("B : ValidationService", () => {
  it("isUpdateAllowed for OPEN and REFUSE only", () => {
    assert.isTrue(ValidationService.isUpdateAllowed(ValidationState.OPEN), "OPEN");
    assert.isTrue(ValidationService.isUpdateAllowed(ValidationState.REFUSED, "REFUSE"));
    assert.isFalse(ValidationService.isUpdateAllowed(ValidationState.READY, "READY"));
    assert.isFalse(ValidationService.isUpdateAllowed(ValidationState.TOBEVALIDATED, "TOBEVALIDATED"));
  })
});
