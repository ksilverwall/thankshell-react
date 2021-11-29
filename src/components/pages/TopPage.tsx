import './TopPage.css';

import SignInButton from 'components/SignInButton';
import FooterPanel from 'components/organisms/FooterPanel';
import { SignIn } from 'libs/auth';


const TopPage = () => {
  const onSignIn = () => SignIn('/groups/sla');

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

export default TopPage;
