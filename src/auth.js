import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

export const GetCognitoAuth = (onSuccess, onFailure) => {
  let auth = new CognitoAuth({
    ClientId           : process.env.REACT_APP_COGNITO_AUTH_CLIENT_ID,
    AppWebDomain       : 'auth2.thankshell.com',
    TokenScopesArray   : ['openid'],
    RedirectUriSignIn  : window.location.origin + '/login/callback',
    RedirectUriSignOut : window.location.origin,
    IdentityProvider   : ''
  })

  auth.userhandler = {
    onSuccess: function(result) {
      if (onSuccess){onSuccess(result)}
      console.log(result);
    },
    onFailure: function(err) {
      console.log(err);
      if (onFailure){onFailure(err)}
    }
  }

  auth.useCodeGrantFlow();

  return auth
}
