import React, {Component} from 'react';

class TSFacebookLoginButton extends React.Component {
  render() {
    return (
      <a {...this.props} className="btn btn-block btn-social btn-facebook">
        <span className="fa fa-facebook"></span>
        Sign in with Facebook to connect your events
      </a>
    )
  }
}

class TSFacebookLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false};
    this.checkLoginState = this.checkLoginState.bind(this);
    this.statusChangeCallback = this.statusChangeCallback.bind(this);
    this.login = this.login.bind(this);
    this.loadFacebookSDK = this.loadFacebookSDK.bind(this);
    this.isFacebookSDKLoaded = this.isFacebookSDKLoaded.bind(this);
  }
  checkLoginState() {
    FB.getLoginStatus(this.statusChangeCallback);
  }
  statusChangeCallback(response) {
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      this.props.facebookConnected();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      this.setState({loaded: true});
      this.props.facebookNotConnected();
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      this.props.facebookNotConnected();
      this.setState({loaded: true});
    }
  }
  login() {
    FB.login(this.checkLoginState);
  }
  loadFacebookSDK() {
    window.fbAsyncInit = () => {
      FB.init({
        appId      : '847945558672954',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use graph api version 2.5
      });

      // Now that we've initialized the JavaScript SDK, we call 
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.

      this.checkLoginState();
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
  isFacebookSDKLoaded() {
    return typeof FB !== 'undefined';
  }
  componentDidMount() {
    if (this.isFacebookSDKLoaded()) {
      this.checkLoginState();
    } else {
      this.loadFacebookSDK();
    }
  }
  render() {
    return (
      <div style={this.props.style}>
        {this.state.loaded &&
          <TSFacebookLoginButton onClick={this.login} />
        }
      </div>
    )
  }
};

module.exports = TSFacebookLogin;
