import React from 'react';
import './TopPage.css';

import SignInButton from 'components/SignInButton';
import FooterPanel from 'components/organisms/FooterPanel';


export default function TopPage({onSignIn}: {onSignIn: ()=>void}) {
  return (
    <article>
      <section className="hero">
        <div>
          <h1>感謝の気持ちを伝え合おう</h1>
          <SignInButton onClick={onSignIn}/>
        </div>
      </section>
      <footer>
        <FooterPanel/>
      </footer>
    </article>
  )
}
