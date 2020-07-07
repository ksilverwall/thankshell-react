import React from 'react';
import './Top.css';
import SignInButton from '../SignInButton'


export default function Top({location}) {
  return (
    <article>
      <section className="hero">
        <div>
          <h1>感謝の気持ちを伝え合おう</h1>
          <SignInButton callbackPath={'/groups/sla'}/>
        </div>
      </section>
    </article>
  )
}
