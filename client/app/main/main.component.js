import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($scope, $http, Auth, $state) {
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.isLoggedInAsync = Auth.isLoggedIn;
    if(this.$state.params.searchText != undefined)
      this.search = this.$state.params.searchText;

    Auth.getCurrentUser().then( x => this.user = x.email);
  }

  $onInit(){
    if(this.search != '') this.searchYelp();

    document.getElementById('searchInput').addEventListener('keypress',(evt) =>{
      if (evt['keyCode'] == 13) {
        this.searchYelp();
      }
    });
  }

  accordionClick(index){
    var collection = document.getElementsByClassName('in');
    if(collection.length > 0 && collection[0].id == "collapse" + index) {
      collection[0].className = 'panel-collapse collapse'
    
    }
    else if(collection.length > 0){
      collection[0].className = 'panel-collapse collapse'
      document.getElementById('collapse' + index).className = 'panel-collapse collapse in';
    }
    else{
      document.getElementById('collapse' + index).className = 'panel-collapse collapse in';
    }
  }

  searchYelp() {

    if(this.$state.params.searchText != this.search)
    {
      this.$state.go('main', {searchText: this.search});
    }
    this.$http.get('/api/yelps/' + this.search).then(response => {
      this.searchResults = response.data.jsonBody.businesses;
      this.$http.get('/api/UserLocations').then(locations =>{
        _.each(this.searchResults, (sr, i) =>{
          sr.attending = locations.data.filter(x => x.locationId == sr.id && x.date == moment().format('MM/DD/YY')).length;
          sr.iamgoing = (locations.data.filter(x => x.locationId == sr.id && x.date == moment().format('MM/DD/YY') && x.userName == this.user).length > 0 )
        })
      })
    }).catch(error => console.log(error));
  }
  
  addUserToLocation(location){
    this.isLoggedInAsync(user => {
      if(user != "" && !location.iamgoing ){
        this.$http.post('/api/UserLocations',{
          userName: this.user,
          locationId: location.id,
          date: moment().format('MM/DD/YY')
        }).then(x => {
          location.attending++;
          location.iamgoing = true;
        });
      }
      else if(user != "" && location.iamgoing){
        this.$http.get('/api/UserLocations').then(results =>{
          var userLocation = results.data.filter(x => x.locationId == location.id && x.date == moment().format('MM/DD/YY') && x.userName == this.user)[0]
          this.$http.delete('/api/UserLocations/' + userLocation._id).then(x => {
            location.attending--;
            location.iamgoing = false;
          });
  
        });
      }
      else{
        this.$state.go('login-param', {searchText: this.search});

      }
    });
  }
}

export default angular.module('myNightlifeAppJsApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
