var FacebookUser = function(json) {
  this.id = json.id;
  this.fullName = json.name;
  this.firstName = json.first_name;
  this.lastName = json.last_name;
  this.email = json.email;
  this.pages = [];
  this.pictureUrl = "http://graph.facebook.com/" + json.id + "/picture?type=square";
}

var FacebookPage = function(json) {
  this.id = json.id;
  this.name = json.name;
  this.access_token = json.access_token;
  this.perms = json.perms;
  this.pictureUrl = "http://graph.facebook.com/" + json.id + "/picture?type=square";
};
