import { CognitoAuth, CognitoAuthOptions, CognitoAuthSession } from 'amazon-cognito-auth-js';

export const AuthConfig: CognitoAuthOptions = {
  ClientId           : process.env.REACT_APP_COGNITO_AUTH_CLIENT_ID || '',
  AppWebDomain       : process.env.REACT_APP_COGNITO_AUTH_APP_WEB_DOMAIN || '',
  TokenScopesArray   : ['openid'],
  RedirectUriSignIn  : window.location.origin + '/login/callback',
  RedirectUriSignOut : window.location.origin + '/',
  IdentityProvider   : undefined,
}

export const GetCognitoAuth = (onSuccess: ((session: CognitoAuthSession)=>void)|null, onFailure: ((err: any)=>void)|null) => {
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

const getPayload = ({redirectUri, responseType, clientId, scope}: {
  redirectUri: string,
  responseType: string,
  clientId: string,
  scope: string,
}) => {
  const params = {
    'redirect_uri': redirectUri,
    'response_type': responseType,
    'client_id': clientId,
    'scope': scope,
  } as const;

  return (Object.keys(params) as (keyof typeof params)[]).map(key=>`${key}=${params[key]}`).join('&')
};

export const SignIn = (callbackPath: string) => {
  localStorage.setItem('callbackPath', callbackPath)
  const auth = new CognitoAuth(AuthConfig)
  auth.useCodeGrantFlow();

  const payload = getPayload({
    redirectUri: encodeURIComponent(AuthConfig.RedirectUriSignIn),
    responseType: 'code',
    clientId:  AuthConfig.ClientId,
    scope: (AuthConfig.TokenScopesArray||[]).join(' '),
  });

  auth.launchUri(`https://${AuthConfig.AppWebDomain}/login?${payload}`);
}
