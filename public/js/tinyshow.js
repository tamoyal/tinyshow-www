var FacebookUser = function(json) {
  this.id = json.id;
  this.fullName = json.name;
  this.firstName = json.first_name;
  this.lastName = json.last_name;
  this.email = json.email;
  this.pages = [];
  this.pictureUrl = "http://graph.facebook.com/" + json.id + "/picture?type=square";
  this.originalPayload = json;
};

var FacebookPage = function(json) {
  this.id = json.id;
  this.name = json.name;
  this.access_token = json.access_token;
  this.perms = json.perms;
  this.pictureUrl = "http://graph.facebook.com/" + json.id + "/picture?type=square";
  this.originalPayload = json;
};

var FACEBOOK_USER_FIELDS = [
  "email",
  "name",
  "first_name",
  "last_name",
  "age_range",
  "birthday",
  "gender",
  "hometown",
  "interested_in",
  "locale",
  "location",
  "relationship_status",
];

var TinyShowFacebookApi = {
  getPagesList: function(success) {    
    FB.api('/me/accounts', function(response) {
      var facebookPages = [];
      var pages = response.data;
      for (var i=0; i<pages.length; i++) {
        var pageJSON = pages[i];
        facebookPages.push(new FacebookPage(pageJSON));
      }
      success(facebookPages);
    });
  },
  getCurrentUserProfile: function(success) {
    FB.api('/me?fields='+FACEBOOK_USER_FIELDS.join(","), function(response) {
      success(FacebookUser(response));
    });
  }
}
