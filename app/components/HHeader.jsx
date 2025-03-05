import React from 'react';
import Toolbar from './Toolbar';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

const HHeader = () => {
  return (
    <header className="theme__header" data-header-height="">
      <div className="header__inner header__inner--bar">
        <div className="wrapper--full" data-toolbar-height="">
          <Toolbar />
        </div>
      </div>

      <div className="header__inner" data-header-cart-full="false">
        <div className="wrapper--full">
          <MobileHeader />
          <DesktopHeader />
        </div>
      </div>
    </header>
  );
};

export default HHeader;