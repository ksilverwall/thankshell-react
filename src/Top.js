import React from 'react';
import { Button } from 'react-bootstrap';
import { SignIn } from './auth'
import './Top.css';

const SignInButton = () => (
  <Button variant="primary" onClick={SignIn}>Sign In</Button>
)

export default function Top() {
  return (
    <article>
      <section className="hero">
        <div>
          <h1>感謝の気持ちを伝え合おう</h1>
          <SignInButton />
        </div>
      </section>
    </article>
  )
}
