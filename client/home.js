Meteor.subscribe('players');

Template.home.helpers({
  'player': function() {
    var currentUserId = Meteor.userId();
    return Players.find(currentUserId);
  }
});

Template.home.events({
  // todo add events
});
