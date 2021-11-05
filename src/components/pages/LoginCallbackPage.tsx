import React from 'react';
import { useEffect, useState } from 'react';
import { GetCognitoAuth } from '../../libs/auth'

import FooterPanel from 'components/organisms/FooterPanel';
import { useHistory, useLocation } from 'react-router-dom';


const LoginCallbackPage = () => {
  const location = useLocation();
  const history = useHistory();
  const [message, setMessage] = useState<string>('ログイン中...');

  useEffect(()=>{
    const responseToken = location.search
    try {
      const auth = GetCognitoAuth(null, null);
      auth.userhandler = {
        onSuccess: () => {
          history.push(localStorage.getItem('callbackPath') || '/')
        },
        onFailure: (err: any) => {
          setMessage(`ERROR: ${err}`);
        },
      }
      auth.parseCognitoWebResponse(responseToken);
    } catch(err) {
      setMessage(`ERROR on parse ${responseToken}: ${err}`);
    }
  }, []);

  return (
    <main>
      <h1>{message}</h1>
      <footer>
        <FooterPanel/>
      </footer>
    </main>
  );
}

export default LoginCallbackPage
