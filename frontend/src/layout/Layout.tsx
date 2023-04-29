import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';

interface LayoutProps {
  children: React.ReactNode;
  currentUser?: any;
  onLoginSuccess: (token?: string) => void;
}


const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLoginSuccess }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header currentUser={currentUser} onLoginSuccess={onLoginSuccess} />
      <div className="content flex-grow-1">
        <Main>{children}</Main>
      </div>
      {children && <Footer />}
    </div>
  );
};

export default Layout;
