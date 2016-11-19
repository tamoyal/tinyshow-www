var TinyShowUser = function(json) {
  this.tinyShowID = json.id;
  this.facebookId = json.facebook_id;
  this.firstName = json.first_name;
  this.lastName = json.last_name;
  this.email = json.email;
  this.phone = json.phone;
  this.confirmedAt = json.confirmed_at;
  this.get_events_from_user_fb_account = json.get_events_from_user_fb_account;
  this.pictureUrl = 'http://graph.facebook.com/' + json.facebook_id + '/picture?type=square';
  this.facebook_pages = json.facebook_pages;
  this.auth_token = json.facebook_access_token;
}

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

