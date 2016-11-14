var TSFacebookHelpers = {
  getPagesList: (success) => {    
    FB.api('/me/accounts', (response) => {
      var facebookPages = response.data.map((pageJSON) => {
        return new FacebookPage(pageJSON);
      })
      success(facebookPages);
    });
  },
  getGrantedPermissions: (success) => {
    FB.api('/me/permissions', (response) => {
      var gantedPermissions = [];
      response.data.forEach((permission) => {
        if (permission['status'] == 'granted')
          gantedPermissions.push(permission['permission']);
      });
      success(gantedPermissions);
    });
  },
};

module.exports = TSFacebookHelpers;
