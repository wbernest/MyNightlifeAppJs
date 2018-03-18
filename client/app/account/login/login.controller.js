'use strict';

export default class LoginController {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
    this.redirect = this.$state.params.searchText;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          if(this.redirect == undefined)
            this.$state.go('main');
          else
            this.$state.go('main', {searchText: this.redirect});
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
