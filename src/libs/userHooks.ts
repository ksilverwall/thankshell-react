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

  return {
    apiUrl: process.env.REACT_APP_THANKSHELL_API_URL,
    version: process.env.REACT_APP_VERSION,
  };
};

export const useSession = (): [Session|null, (callbackPath: string)=>void] => {
  const auth = GetCognitoAuth(null, null);

  if (!auth.isUserSignedIn()) {
    return [null, SignIn];
  }

  return [new Session(auth), SignIn];
}
