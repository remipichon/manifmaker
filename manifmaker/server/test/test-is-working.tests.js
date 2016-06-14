/* eslint-env mocha */

import {Meteor} from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';

/**
 * Test mode
 */

describe('Test on server', () => {
    describe('is working', () => {
        it('test is working', () => {
            assert.equal(true,true);
        });
    });
});
