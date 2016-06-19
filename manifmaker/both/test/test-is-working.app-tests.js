/* eslint-env mocha */

import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';

/**
 * Test mode
 */

describe('Test on client and server', () => {
    describe('is working', () => {
        it('test is working', () => {
            assert.equal(true, true);
        });
    });
});

if(Meteor.isServer){
    describe('Test on  server !!', () => {
        describe('is working', () => {
            it('test is working', () => {
                assert.equal(true, true);
            });
        });
    });
}
if(Meteor.isClient){
    describe('Test on clidnt !!', () => {
        describe('is working', () => {
            it('test is working', () => {
                assert.equal(true, true);
            });
        });
    });
}

