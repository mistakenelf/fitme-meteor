//Set plan type and dollar amount based on what
//plan they click
let planType = "";
let dollarAmount = 0;

Template.myAccount.onCreated(function () {
  //Subscribe all the trainers current clients
  this.autorun(() => {
    this.subscribe("myProfile");
    this.subscribe("currentClients");
  });
});

Template.myAccount.helpers({
  //Find trainers account
  myAccount() {
      return Meteor.users.findOne({
        _id: Meteor.userId()
      });
    },

    //Format the last login date
    formatDate(loginDate) {
      return loginDate.toDateString();
    },

    //Check if the user is currently logging in
    isLoggingIn() {
      return Meteor.loggingIn();
    },

    //Get count of total clients this trainer has
    totalClients() {
      return Meteor.users.find({
        createdBy: Meteor.userId()
      }).count();
    },

    //Does the trainer have a paid account
    paidAccount() {
      const thisTrainer = Meteor.users.findOne({
        _id: Meteor.userId()
      });
      if (thisTrainer.hasPaid) {
        return true;
      } else {
        return false;
      }
    },

    //Is the trainer suspended?
    isSuspended() {
      const thisTrainer = Meteor.users.findOne({
        _id: Meteor.userId()
      });
      if (thisTrainer.userStatus == "suspended") {
        return true;
      } else {
        return false;
      }
    }
});

Template.myAccount.events({
  //Delete the trainers account
  "click .deleteAccount" (event) {
    //Needed for sweet alerts
    let previousWindowKeyDown = window.onkeydown;

    //Sweet alert to confirm deletion of client
    swal({
      title: "Are you sure?",
      text: "Your account will be completely removed, all clients, workouts and related data will be removed from FitMe",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete account!",
      closeOnConfirm: false
    }, (isConfirm) => {
      window.onkeydown = previousWindowKeyDown;
      if (isConfirm) {
        swal('Deleted!', 'Your account has been removed.', 'success');
        //Call server function to delete the client clicked on
        Meteor.call("deleteAccount");
        FlowRouter.go("/");

        //Log user out
        Meteor.logout();
      } else {
        swal('Cancelled', 'Account is safe now.', 'error');
      }
    });
  },

  //Buy the one month plan
  'click .oneMonth' (event, template) {
    const currentTrainer = Meteor.users.findOne({
      _id: Meteor.userId()
    });

    //Needed for sweet alerts
    let previousWindowKeyDown = window.onkeydown;

    //Sweet alert to confirm deletion of client
    swal({
      title: "Terms and Conditions",
      text: "You will be prompted for payment provided by Stripe. All payments are securely stored and handled through the Stripe website.  <br><br> By clicking Accept, you will agree to these <a href='/termsAndConditions' target='_blank'>Terms and Conditions</a> and will proceed to make your payment with FitMe.",
      type: "warning",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Accept",
      closeOnConfirm: true
    }, (isConfirm) => {
      window.onkeydown = previousWindowKeyDown;
      if (isConfirm) {
        //Find the current trainer
        const currentTrainer = Meteor.users.findOne({
          _id: Meteor.userId()
        });

        let email = currentTrainer.emails[0].address;

        //Charge the trainer with stripe
        let checkout = StripeCheckout.configure({
          key: Meteor.settings.public.stripe,
          image: "https://www.gofitme.com/navigation/fitMeSidebarLogo.png",
          locale: 'auto',
          token(token) {
            charge = {
              amount: token.amount || dollarAmount,
              currency: token.currenty || 'usd',
              source: token.id,
              description: planType,
              receipt_email: email
            };

            //Process their payment
            Meteor.call('processPayment', charge, (error, response) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                //One month plan
                if (planType == "One Month") {
                  Bert.alert('Thank You For Choosing FitMe', 'success');
                  Meteor.call('oneMonthPlanTrainer');
                }
              }
            });
          },
          closed() {

          }
        });

        //Open the checkout for one month
        checkout.open({
          email: currentTrainer.emails[0].address,
          name: 'One Month',
          description: "1 Month Of Access",
          amount: 1065,
          bitcoin: true
        });

        //Set the plan types for the
        planType = "One Month";
        dollarAmount = 1065;

      } else {
        swal('Cancelled', 'You Will Not Be Charged.', 'error');
      }
    });
  },

  //Buy the six month plan
  'click .sixMonth' (event, template) {
    const currentTrainer = Meteor.users.findOne({
      _id: Meteor.userId()
    });

    //Needed for sweet alerts
    let previousWindowKeyDown = window.onkeydown;

    //Sweet alert to confirm deletion of client
    swal({
      title: "Terms and Conditions",
      text: "You will be prompted for payment provided by Stripe. All payments are securely stored and handled through the Stripe website.  <br><br> By clicking Accept, you will agree to these <a href='/termsAndConditions' target='_blank'>Terms and Conditions</a> and will proceed to make your payment with FitMe.",
      type: "warning",
      showCancelButton: true,
      html: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Accept",
      closeOnConfirm: true
    }, (isConfirm) => {
      window.onkeydown = previousWindowKeyDown;
      if (isConfirm) {
        //Find the current trainer
        const currentTrainer = Meteor.users.findOne({
          _id: Meteor.userId()
        });

        let email = currentTrainer.emails[0].address;

        //Charge the trainer with stripe
        let checkout = StripeCheckout.configure({
          key: Meteor.settings.public.stripe,
          image: "https://www.gofitme.com/navigation/fitMeSidebarLogo.png",
          locale: 'auto',
          token(token) {
            charge = {
              amount: token.amount || dollarAmount,
              currency: token.currenty || 'usd',
              source: token.id,
              description: planType,
              receipt_email: email
            };

            //Process their payment
            Meteor.call('processPayment', charge, (error, response) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                //Six month plan
                if (planType == "Six Month") {
                  Bert.alert('Thank You For Choosing FitMe', 'success');
                  Meteor.call("sixMonthPlanTrainer");
                }
              }
            });
          },
          closed() {

          }
        });

        //Open checkout for the 6 month plan
        checkout.open({
          email: currentTrainer.emails[0].address,
          name: 'Six Month',
          description: "Six Months Of Access",
          amount: 4260,
          bitcoin: true
        });

        //Set the plan type and dollar amount for 6 month
        planType = "Six Month";
        dollarAmount = 4260;

      } else {
        swal('Cancelled', 'You Will Not Be Charged.', 'error');
      }
    });
  },

  //Buy the one year plan
  'click .oneYear' (event, template) {
    const currentTrainer = Meteor.users.findOne({
      _id: Meteor.userId()
    });

    //Needed for sweet alerts
    let previousWindowKeyDown = window.onkeydown;

    //Sweet alert to confirm deletion of client
    swal({
      title: "Terms and Conditions",
      text: "You will be prompted for payment provided by Stripe. All payments are securely stored and handled through the Stripe website.  <br><br> By clicking Accept, you will agree to these <a href='/termsAndConditions' target='_blank'>Terms and Conditions</a> and will proceed to make your payment with FitMe.",
      type: "warning",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Accept",
      closeOnConfirm: true
    }, (isConfirm) => {
      window.onkeydown = previousWindowKeyDown;
      if (isConfirm) {
        //Find the current trainer
        const currentTrainer = Meteor.users.findOne({
          _id: Meteor.userId()
        });

        let email = currentTrainer.emails[0].address;

        //Charge the trainer with stripe
        let checkout = StripeCheckout.configure({
          key: Meteor.settings.public.stripe,
          image: "https://www.gofitme.com/navigation/fitMeSidebarLogo.png",
          locale: 'auto',
          token(token) {
            charge = {
              amount: token.amount || dollarAmount,
              currency: token.currenty || 'usd',
              source: token.id,
              description: planType,
              receipt_email: email
            };

            //Process their payment
            Meteor.call('processPayment', charge, (error, response) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                //One year plan
                if (planType == "One Year") {
                  Bert.alert('Thank You For Choosing FitMe', 'success');
                  Meteor.call("oneYearPlanTrainer");
                }
              }
            });
          },
          closed() {

          }
        });

        //Open checkout for the one year plan
        checkout.open({
          email: currentTrainer.emails[0].address,
          name: 'One Year',
          description: "1 Year Of Access",
          amount: 7029,
          bitcoin: true
        });

        //Set the plan type and dollar amount for one year
        planType = "One Year";
        dollarAmount = 7029;

      } else {
        swal('Cancelled', 'You Will Not Be Charged.', 'error');
      }
    });
  },

  //Switch to the free account
  'click .free' (event) {
    const currentTrainer = Meteor.users.findOne({
      _id: Meteor.userId()
    });

    //Check if the trainer is already in a paid plan and let
    //them know they are already in a plan
    if (currentTrainer.hasPaid == true) {
      //Needed for sweet alerts
      let previousWindowKeyDown = window.onkeydown;

      //Sweet alert to confirm deletion of client
      swal({
        title: "Are You Sure?",
        text: "You are currently enrolled in a plan. By switching back to a Free plan, you will lose all your current clients and your client limit will be set back to 1.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
      }, (isConfirm) => {
        window.onkeydown = previousWindowKeyDown;
        if (isConfirm) {
          Meteor.call("freeAccountTrainer");
          Bert.alert('Thank You For Choosing FitMe', 'success');
        } else {
          swal('Cancelled', 'Your account will not be reset.', 'error');
        }
      });
    } else {
      //Needed for sweet alerts
      let previousWindowKeyDown = window.onkeydown;

      //Sweet alert to confirm deletion of client
      swal({
        title: "Reset Your Account To Free?",
        text: "You will lose all your current clients and your client limit will be dropped to 1",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, continue!",
        closeOnConfirm: true
      }, (isConfirm) => {
        window.onkeydown = previousWindowKeyDown;
        if (isConfirm) {
          Meteor.call("freeAccountTrainer");
          Bert.alert('Thank You For Choosing FitMe', 'success');
        } else {
          swal('Cancelled', 'Your account will not be reset.', 'error');
        }
      });
    }
  },

  //Purchase 5 additional clients
  'click .fiveAdditionalClients' (event, template) {
    const currentTrainer = Meteor.users.findOne({
      _id: Meteor.userId()
    });

    //Needed for sweet alerts
    let previousWindowKeyDown = window.onkeydown;

    //Sweet alert to confirm deletion of client
    swal({
      title: "Terms and Conditions",
      text: "You will be prompted for payment provided by Stripe. All payments are securely stored and handled through the Stripe website.  By clicking Accept, you will agree to these <a href='/termsAndConditions' target='_blank'>Terms and Conditions</a> and will proceed to make your payment with FitMe.",
      type: "warning",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Accept",
      closeOnConfirm: true
    }, (isConfirm) => {
      window.onkeydown = previousWindowKeyDown;
      if (isConfirm) {
        //Find the current trainer
        const currentTrainer = Meteor.users.findOne({
          _id: Meteor.userId()
        });

        let email = currentTrainer.emails[0].address;

        //Charge the trainer with stripe
        let checkout = StripeCheckout.configure({
          key: Meteor.settings.public.stripe,
          image: "https://www.gofitme.com/navigation/fitMeSidebarLogo.png",
          locale: 'auto',
          token(token) {
            charge = {
              amount: token.amount || dollarAmount,
              currency: token.currenty || 'usd',
              source: token.id,
              description: planType,
              receipt_email: email
            };

            //Process their payment
            Meteor.call('processPayment', charge, (error, response) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                if (planType == "Five Additional Clients") {
                  Bert.alert("Thank You For Choosing FitMe", "success");
                  Meteor.call("fiveAdditionalClientsTrainer");
                }
              }
            });
          },
          closed() {

          }
        });

        //Open checkout for 5 additional clients
        checkout.open({
          email: currentTrainer.emails[0].address,
          name: '5 Additional Clients',
          description: "Add five additional clients to your client limit",
          amount: 200,
          bitcoin: true
        });

        //Set the plan type and dollar amount for 5 clients
        planType = "Five Additional Clients";
        dollarAmount = 200;

      } else {
        swal('Cancelled', 'You Will Not Be Charged.', 'error');
      }
    });
  },

  //Purchase 10 additional clients
  'click .tenAdditionalClients' (event, template) {
    const currentTrainer = Meteor.users.findOne({
      _id: Meteor.userId()
    });

    //Needed for sweet alerts
    let previousWindowKeyDown = window.onkeydown;

    //Sweet alert to confirm deletion of client
    swal({
      title: "Terms and Conditions",
      text: "You will be prompted for payment provided by Stripe. All payments are securely stored and handled through the Stripe website.  By clicking Accept, you will agree to these <a href='/termsAndConditions' target='_blank'>Terms and Conditions</a> and will proceed to make your payment with FitMe.",
      type: "warning",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Accept",
      closeOnConfirm: true
    }, (isConfirm) => {
      window.onkeydown = previousWindowKeyDown;
      if (isConfirm) {
        //Find the current trainer
        const currentTrainer = Meteor.users.findOne({
          _id: Meteor.userId()
        });

        let email = currentTrainer.emails[0].address;

        //Charge the trainer with stripe
        let checkout = StripeCheckout.configure({
          key: Meteor.settings.public.stripe,
          image: "https://www.gofitme.com/navigation/fitMeSidebarLogo.png",
          locale: 'auto',
          token(token) {
            charge = {
              amount: token.amount || dollarAmount,
              currency: token.currenty || 'usd',
              source: token.id,
              description: planType,
              receipt_email: email
            };

            //Process their payment
            Meteor.call('processPayment', charge, (error, response) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                if (planType == "Ten Additional Clients") {
                  Bert.alert("Thank You For Choosing FitMe", "success");
                  Meteor.call("tenAdditionalClientsTrainer");
                }
              }
            });
          },
          closed() {

          }
        });

        //Open checkout for 10 clients
        checkout.open({
          email: currentTrainer.emails[0].address,
          name: '10 Additional Clients',
          description: "Add ten additional clients to your client limit",
          amount: 500,
          bitcoin: true
        });

        //Set plan type for 10 clients and dollar amount
        planType = "Ten Additional Clients";
        dollarAmount = 500;

      } else {
        swal('Cancelled', 'You Will Not Be Charged.', 'error');
      }
    });
  },

  //Purchase 20 additional clients
  'click .twentyAdditionalClients' (event, template) {
    const currentTrainer = Meteor.users.findOne({
      _id: Meteor.userId()
    });

    //Needed for sweet alerts
    let previousWindowKeyDown = window.onkeydown;

    //Sweet alert to confirm deletion of client
    swal({
      title: "Terms and Conditions",
      text: "You will be prompted for payment provided by Stripe. All payments are securely stored and handled through the Stripe website.  By clicking Accept, you will agree to these <a href='/termsAndConditions' target='_blank'>Terms and Conditions</a> and will proceed to make your payment with FitMe.",
      type: "warning",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Accept",
      closeOnConfirm: true
    }, (isConfirm) => {
      window.onkeydown = previousWindowKeyDown;
      if (isConfirm) {
        //Find the current trainer
        const currentTrainer = Meteor.users.findOne({
          _id: Meteor.userId()
        });

        let email = currentTrainer.emails[0].address;

        //Charge the trainer with stripe
        let checkout = StripeCheckout.configure({
          key: Meteor.settings.public.stripe,
          image: "https://www.gofitme.com/navigation/fitMeSidebarLogo.png",
          locale: 'auto',
          token(token) {
            charge = {
              amount: token.amount || dollarAmount,
              currency: token.currenty || 'usd',
              source: token.id,
              description: planType,
              receipt_email: email
            };

            //Process their payment
            Meteor.call('processPayment', charge, (error, response) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                if (planType == "Twenty Additional Clients") {
                  Bert.alert("Thank You For Choosing FitMe", "success");
                  Meteor.call("twentyAdditionalClientsTrainer");
                }
              }
            });
          },
          closed() {

          }
        });

        //Open checkout for 20 additional clients
        checkout.open({
          email: currentTrainer.emails[0].address,
          name: '20 Additional Clients',
          description: "Add twenty additional clients to your client limit",
          amount: 1200,
          bitcoin: true
        });

        //Set plan type and dollar amount for 20 additional clients
        planType = "Twenty Additional Clients";
        dollarAmount = 1200;

      } else {
        swal('Cancelled', 'You Will Not Be Charged.', 'error');
      }
    });
  },
});