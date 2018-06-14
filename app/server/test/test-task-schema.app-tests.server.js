import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';
import {resetDatabase} from 'meteor/xolvio:cleaner';


describe("TaskSchema", () => {
  describe("equipmentStorageId", () => {
    beforeEach(function () {
      resetDatabase();
    });
    it("works", () => {

      var team1Id = Teams.insert({name: "team1"});
      assert.equal(Teams.findOne().name, "team1");

      var equipmentStorage1 = EquipmentStorages.insert({name: "equipmentStorage1"});
      assert.equal(EquipmentStorages.findOne(equipmentStorage1).name, "equipmentStorage1");

      var place1Id = Places.insert({name: "place1"});
      assert.equal(Places.findOne(place1Id).name, "place1");

      var user1Id = UsersCustom.insert({name: "user1"}, {filter: false});
      assert.equal(UsersCustom.findOne(user1Id).name, "user1");

      var task1d = Tasks.insert({
        name: "task 1",
        teamId: team1Id,
        placeId: place1Id,
        liveEventMasterId: user1Id,
        masterId: user1Id,
      });

      Tasks.update(task1d, {
        $set: {
          equipmentStorageId: equipmentStorage1
        }
      });

      assert.equal(Tasks.findOne(task1d).equipmentStorageId, equipmentStorage1);

    });
    it("throw error if not existing", () => {

      var equipmentStorage1 = EquipmentStorages.insert({name: "equipmentStorage1"});
      var team1Id = Teams.insert({name: "team1"});
      var place1Id = Places.insert({name: "place1"});
      var user1Id = Meteor.users.insert({name: "user1"});
      var task1d = Tasks.insert({
        name: "task 1",
        teamId: team1Id,
        placeId: place1Id,
        liveEventMasterId: user1Id,
        masterId: user1Id,
      });

      expect(function () {
        Tasks.update(task1d, {
          $set: {
            equipmentStorageId: "65461654"
          }
        });
      }).to.throw(/Task equipment storage could not be find in database/);

    })
  })
});
