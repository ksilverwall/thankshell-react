import React from 'react';
import FooterPanel from 'components/organisms/FooterPanel';

const GroupVisitorPage = () => {
  return (
    <main>
      <p>このグループの閲覧権限がありません。グループの作成及びメンバ追加はマニュアルで行っておりますのでお問い合わせください。</p>
      <footer>
        <FooterPanel />
      </footer>
    </main>
  );
};

export default GroupVisitorPage;
