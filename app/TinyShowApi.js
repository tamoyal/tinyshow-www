var TinyShowApi = {
  login: (onSuccess, onError) => {
    var auth = FB.getAuthResponse();
    var now = new Date();
    now.setSeconds(now.getSeconds() + auth['expiresIn']);
    $.ajax({
      url: '/login',
      data: {
        facebook_id: auth['userID'],
        facebook_access_token: auth['accessToken'],
        facebook_access_token_expiration: now,
      },
      type: 'POST',
      dataType: 'json',
      success: (user) => {
        onSuccess(user);
      },
      error: (xhr, textStatus, errorThrown) => {
        onError(xhr);
      }
    });
  },
  updateUser: (attrs, onSuccess, onError) => {
    $.ajax({
      url: '/users',
      data: attrs,
      type: 'PUT',
      dataType: 'json',
      success: response => {
        onSuccess(response);
      },
      error: (xhr, textStatus, errorThrown) => {
        onError(xhr);
      }
    });
  },
};

module.exports = TinyShowApi;
