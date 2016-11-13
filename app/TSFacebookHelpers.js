var FACEBOOK_USER_FIELDS = [
  'email',
  'name',
  'first_name',
  'last_name',
  'age_range',
  'birthday',
  'gender',
  'hometown',
  'interested_in',
  'locale',
  'location',
  'relationship_status',
];

var TSFacebookHelpers = {
  getPagesList: (success) => {    
    FB.api('/me/accounts', (response) => {
      var facebookPages = response.data.map((pageJSON) => {
        return new FacebookPage(pageJSON);
      })
      success(facebookPages);
    });
  },
  getCurrentUserProfile: (success) => {
    FB.api('/me?fields='+FACEBOOK_USER_FIELDS.join(','), (response) => {
      success(new FacebookUser(response, FB.getAuthResponse()['accessToken']));
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
