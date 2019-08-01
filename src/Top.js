import React from 'react';
import './Top.css';
import { Button } from 'react-bootstrap';

const Top = () => (
  <article>
    <section className="hero">
      <div>
        <h1>感謝の気持ちを伝え合おう</h1>
        <Button variant="primary">Sign In</Button>
      </div>
    </section>
  </article>
)

export default Top;
