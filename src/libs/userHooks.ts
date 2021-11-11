import { CognitoAuth } from 'amazon-cognito-auth-js';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { parseSearchParameters } from '../components/pages/GroupIndexPage';
import { GetCognitoAuth, SignIn } from './auth';
import { Session } from './thankshell';

export type EnvironmentVariables = {
  apiUrl: string,
  version?: string,
}

/**
 * Use useSearchParams of react-router-dom v6 instead
 */
export const useSearchParams = (): { [key: string]: string; } => {
  const location = useLocation();

  return parseSearchParameters(location.search);
};


export const useEnvironmentVariable = (): EnvironmentVariables => {
  if (!process.env.REACT_APP_THANKSHELL_API_URL) {
    throw new Error("Application Error: process.env.REACT_APP_THANKSHELL_API_URL is not set");
  }

  return useMemo<EnvironmentVariables>(()=>({
    apiUrl: process.env.REACT_APP_THANKSHELL_API_URL||'',
    version: process.env.REACT_APP_VERSION,
  }), []);
};

const useAuth = (): CognitoAuth|null => {
  const [auth, setAuth] = useState<CognitoAuth|null>(null);

  if (auth && auth.isUserSignedIn()) {
    return auth;
  }

  const newAuth = GetCognitoAuth(null, null);
  if (!newAuth.isUserSignedIn()) {
    return null
  }

  setAuth(newAuth);

  return newAuth;
}

export const useSession = (): [Session|null, (callbackPath: string)=>void] => {
  const auth = useAuth();
  const session = useMemo(()=> auth ? new Session(auth) : null, [auth]);

  return [session, SignIn];
}
