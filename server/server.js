// Server-side data publish for client access
Meteor.publish('players', function() {
	var currentUserId = this.userId;
	return Players.find(currentUserId);
});

// Server-side methods for data
Meteor.methods({
	'insertPlayerData': function() {
		var currentUserId = Meteor.userId();
		//Players.insert({});
	},
	'removePlayerData': function() {
		var currentUserId = Meteor.userId();
		//Players.remove();
	},
	'modifyPlayerData': function(player, playerData) {
		//Players.update(player, playerData);
	}
});