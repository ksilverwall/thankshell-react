import React from 'react';
import SignInButton from 'components/SignInButton';
import { GetCognitoAuth } from 'libs/auth';
import { Session } from 'libs/thankshell';


const UseSession = ({callbackPath, render}: {callbackPath: string, render: (params: {session: Session, onSignOut: ()=>void})=>JSX.Element}) => {
  const auth = GetCognitoAuth(null, null);

  if (!auth.isUserSignedIn()) {
    return (
      <div>
        <h2>サインインされていません</h2>
        <SignInButton callbackPath={callbackPath} />
      </div>
    );
  }
  const session = new Session(auth);

  return render({session, onSignOut: session.close});
};

export default UseSession;
