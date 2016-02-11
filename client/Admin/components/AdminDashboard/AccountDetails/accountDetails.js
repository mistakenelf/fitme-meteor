Template.accountDetails.onCreated(function () {
  //Subscribe all the trainers current clients
  this.autorun(() => {
    const trainerId = FlowRouter.getParam('_id');
    this.subscribe("trainersAccount", trainerId);
    this.subscribe("trainersClients", trainerId);
  });
});

Template.accountDetails.helpers({
  //Get all the account details
  accountSetting() {
    const trainerId = FlowRouter.getParam('_id');
    return Meteor.users.findOne({
      _id: trainerId
    });
  },
  
  //Format the date they last logged in
  formatDate(loginDate) {
    return loginDate.toDateString();
  },
  
  //Get total number of clients for the trainer
  totalClients() {
    const trainerId = FlowRouter.getParam('_id');
    let totalClients =  Meteor.users.find({
      createdBy: trainerId
    }).count();
    
    return totalClients;
  }
});

Template.accountDetails.events({
  //Start the one month plan
  'click .monthlyPlan' (event) {
    const trainerId = FlowRouter.getParam('_id');
    Meteor.call("monthlyPlan", trainerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("Monthly Plan Started", 'success', 'growl-top-right');
      }
    });
  },
  
  //Start the six month plan
  'click .sixMonthPlan' (event) {
    const trainerId = FlowRouter.getParam('_id');
    Meteor.call("sixMonthPlan", trainerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("Six Month Plan Started", 'success', 'growl-top-right');
      }
    });
  },
  
  //Start the yearly plan
  'click .yearlyPlan' (event) {
    const trainerId = FlowRouter.getParam('_id');
    Meteor.call("yearlyPlan", trainerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("Yearly Plan Started", 'success', 'growl-top-right');
      }
    });
  },
  
  //Add five additional clients to trainer
  'click .fiveAdditionalClients' (event) {
    const trainerId = FlowRouter.getParam('_id');
    Meteor.call("fiveAdditionalClients", trainerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("5 Additional Clients Added", 'success', 'growl-top-right');
      }
    });
  },
  
  //Add ten additional clients to trainer
  'click .tenAdditionalClients' (event) {
    const trainerId = FlowRouter.getParam('_id');
    Meteor.call("tenAdditionalClients", trainerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("10 Additional Clients Added", 'success', 'growl-top-right');
      }
    });
  },
  
  //Add twenty additional clients to trainer
  'click .twentyAdditionalClients' (event) {
    const trainerId = FlowRouter.getParam('_id');
    Meteor.call("twentyAdditionalClients", trainerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("20 Additional Clients Added", 'success', 'growl-top-right');
      }
    });
  },
  
  //Reset the trainers acccount back to a free account
  'click .resetAccount' (event) {
    const trainerId = FlowRouter.getParam('_id');

    //Needed for sweet alerts
    let previousWindowKeyDown = window.onkeydown;

    //Sweet alert to confirm deletion of client
    swal({
      title: "Are you sure?",
      text: "All Clients WILL Be Deleted!!!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, reset account!",
      closeOnConfirm: false
    }, (isConfirm) => {
      window.onkeydown = previousWindowKeyDown;
      if (isConfirm) {
        swal('Reset!', 'Account has been reset.', 'success');
        //Call server function to delete the client clicked on
        Meteor.call("resetAccount", trainerId);
      } else {
        swal('Cancelled', 'Account is safe now :)', 'error');
      }
    });

  },
  
  //Send email to trainer if they have not loggged in for a while
  'click .emailInactive' (event) {
    const trainerId = FlowRouter.getParam('_id');
    Meteor.call("sendInactiveEmail", trainerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert("Warning Email Sent", 'success', 'growl-top-right');
      }
    });
  }
});