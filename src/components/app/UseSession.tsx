import React from 'react';

import { Session } from 'libs/thankshell';
import { SignIn } from 'libs/auth';

import PrimaryButton from 'components/atoms/PrimaryButton';
import { useSession } from 'libs/userHooks';


const UseSession = ({callbackPath, render}: {callbackPath: string, render: (params: {session: Session, onSignOut: ()=>void})=>JSX.Element}) => {
  const [session, signIn] = useSession();
  if (!session) {
    return (
      <div>
        <h2>サインインされていません</h2>
        <PrimaryButton text='Sign In' onClick={()=>signIn(callbackPath)} />
      </div>
    );
  }

  return render({session, onSignOut: session.close});
};

export default UseSession;
