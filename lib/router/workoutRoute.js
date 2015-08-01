Router.route('/workouts', {
  name: 'workouts',
  template: 'workouts',
  data: function() {
    
  },

  onBeforeAction: function() {
    var currentUser = Meteor.userId();

    if(currentUser) {
      this.next();
    }

    else {
      this.render('login');
    }
  }
});