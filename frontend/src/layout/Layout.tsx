import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";

interface LayoutProps {
  children: React.ReactNode;
  currentUser?: any;
  onLoginSuccess: (token?: string | undefined) => Promise<void>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentUser,
  onLoginSuccess,
}) => {
  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Header currentUser={currentUser} onLoginSuccess={onLoginSuccess} />
      <Flex flex="1" flexDirection="column">
        <Main>{children}</Main>
      </Flex>
      {children && <Footer />}
    </Box>
  );
};

export default Layout;
