'use strict';


export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('main', {
      url: '/:searchText',
      template: '<main></main>'
    });
};
