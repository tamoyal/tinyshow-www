var TinyShowUser = function(json) {
  this.tinyShowID = json.id;
  this.firstName = json.first_name;
  this.lastName = json.last_name;
  this.email = json.email;
  this.phone = json.phone;
  this.get_events_from_user_fb_account = json.get_events_from_user_fb_account;
  this.pictureUrl = 'http://graph.facebook.com/' + json.facebook_id + '/picture?type=square';
  this.facebook_pages = json.facebook_pages;
}

var FacebookUser = function(json, accessToken) {
  this.id = json.id;
  this.fullName = json.name;
  this.firstName = json.first_name;
  this.lastName = json.last_name;
  this.email = json.email;
  this.phone = '';
  this.pages = [];
  this.pictureUrl = 'http://graph.facebook.com/' + json.id + '/picture?type=square';
  this.accessToken = accessToken;
  this.originalPayload = json;
  this.originalPayloadJSON = function() {
    return JSON.stringify(this.originalPayload);
  }
};

var FacebookPage = function(json) {
  this.id = json.id;
  this.name = json.name;
  this.access_token = json.access_token;
  this.perms = json.perms;
  this.pictureUrl = 'http://graph.facebook.com/' + json.id + '/picture?type=square';
  this.originalPayload = json;
  this.originalPayloadJSON = function() {
    return JSON.stringify(this.originalPayload);
  }
};

var TinyShowApi = {
  getExistingUser: function(onSuccess) {
    var auth = FB.getAuthResponse();
    $.ajax({
      url: '/existing_user',
      data: {facebookId: auth['userID'], accessToken: auth['accessToken']},
      type: 'GET',
      dataType: 'json',
      success: function(user) {
        onSuccess(user);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  }
}
