import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

export const AuthConfig = {
  ClientId           : process.env.REACT_APP_COGNITO_AUTH_CLIENT_ID,
  AppWebDomain       : 'auth2.thankshell.com',
  TokenScopesArray   : ['openid'],
  RedirectUriSignIn  : window.location.origin + '/login/callback',
  RedirectUriSignOut : window.location.origin + '/',
  IdentityProvider   : ''
}

export const GetCognitoAuth = (onSuccess, onFailure) => {
  let auth = new CognitoAuth(AuthConfig)

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

export const GetRedirectUri = () => {
  const params = {
    'redirect_uri': encodeURIComponent(AuthConfig.RedirectUriSignIn),
    'response_type': 'code',
    'client_id':  AuthConfig.ClientId,
    'scope': AuthConfig.TokenScopesArray.join(' '),
  }

  const payload = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

  return `https://${AuthConfig.AppWebDomain}/oauth2/authorize?${payload}`
}

export const SignIn = () => {
  const auth = new CognitoAuth(AuthConfig)
  auth.useCodeGrantFlow();
  auth.launchUri(GetRedirectUri())
}
