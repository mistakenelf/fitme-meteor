Template.accountDetails.onCreated(function () {
  var self = this;

  //Subscribe all the trainers current clients
  self.autorun(function () {
    var trainerId = FlowRouter.getParam('_id');
    self.subscribe("trainersAccount", trainerId);
  });
});

Template.accountDetails.helpers({
  accountSetting: function () {
    var trainerId = FlowRouter.getParam('_id');
    return Meteor.users.findOne({
      _id: trainerId
    });
  },

  formatDate: function (loginDate) {
    return loginDate.toDateString();
  }
});

Template.accountDetails.events({
  'click .monthlyPlan': function (event) {
    var trainerId = FlowRouter.getParam('_id');
    Meteor.call("monthlyPlan", trainerId, function (error) {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("Monthly Plan Started", 'success', 'growl-top-right');
      }
    });
  },

  'click .sixMonthPlan': function (event) {
    var trainerId = FlowRouter.getParam('_id');
    Meteor.call("sixMonthPlan", trainerId, function (error) {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("Six Month Plan Started", 'success', 'growl-top-right');
      }
    });
  },
  
  'click .yearlyPlan': function (event) {
    var trainerId = FlowRouter.getParam('_id');
    Meteor.call("yearlyPlan", trainerId, function (error) {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("Yearly Plan Started", 'success', 'growl-top-right');
      }
    });
  },
  
  'click .fiveAdditionalClients': function (event) {
    var trainerId = FlowRouter.getParam('_id');
    Meteor.call("fiveAdditionalClients", trainerId, function (error) {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("5 Additional Clients Added", 'success', 'growl-top-right');
      }
    });
  },
  
  'click .tenAdditionalClients': function (event) {
    var trainerId = FlowRouter.getParam('_id');
    Meteor.call("tenAdditionalClients", trainerId, function (error) {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("10 Additional Clients Added", 'success', 'growl-top-right');
      }
    });
  },
  
  'click .twentyAdditionalClients': function (event) {
    var trainerId = FlowRouter.getParam('_id');
    Meteor.call("twentyAdditionalClients", trainerId, function (error) {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("20 Additional Clients Added", 'success', 'growl-top-right');
      }
    });
  },
});