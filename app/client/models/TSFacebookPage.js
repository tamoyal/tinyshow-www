class TSFacebookPage {
  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.access_token = json.access_token;
    this.perms = json.perms;
    this.pictureUrl = 'http://graph.facebook.com/' + json.id + '/picture?type=square';
    this.originalPayload = json;
    this.originalPayloadJSON = () => {
      return JSON.stringify(this.originalPayload);
    }
  }
};

module.exports = TSFacebookPage;
