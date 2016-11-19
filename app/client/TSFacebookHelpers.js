var TSFacebookPage = require('./models/TSFacebookPage.js');

var TSFacebookHelpers = {
  getPagesList: (facebookId, onSuccess, onError) => {
    FB.api('/' + facebookId + '/accounts', (response) => {
      if (response.error) {
        TSFacebookHelpers.handleError(response, onError);
      } else {
        var facebookPages = response.data.map((pageJSON) => {
          return new TSFacebookPage(pageJSON);
        });
        onSuccess(facebookPages);
      }
    });
  },
  getGrantedPermissions: (facebookId, onSuccess, onError) => {
    FB.api('/' + facebookId + '/permissions', (response) => {
      if (response.error) {
        TSFacebookHelpers.handleError(response, onError);
      } else {
        var gantedPermissions = [];
        response.data.forEach((permission) => {
          if (permission['status'] == 'granted')
            gantedPermissions.push(permission['permission']);
        });
        onSuccess(gantedPermissions);
      }
    });
  },
  handleError: (response, onError) => {
    if (onError) {
      onError(response.error);
    } else {
      console.log(response.error);
    }
  }
};

module.exports = TSFacebookHelpers;
