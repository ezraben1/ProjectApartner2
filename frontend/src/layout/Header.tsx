import {
  Container,
  Flex,
  Spacer,
  Link,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
} from "@chakra-ui/react";
import { Text as ChakraText } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import auth from "../utils/auth";

interface HeaderProps {
  currentUser: any;
  onLoginSuccess: (token?: string) => Promise<void>; // Updated type
}

const Header: React.FC<HeaderProps> = ({ onLoginSuccess }) => {
  const [isSmallerThanLg] = useMediaQuery("(max-width: 991px)");
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const response = await api.get("/core/me/");
      const users = await response.json();
      if (users.length > 0) {
        setUsername(users[0].username);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    await auth.logout();
    onLoginSuccess(); // This will be called without token to clear the logged-in state
    navigate("/");
  };

  return (
    <Flex as="header" bg="blue.600" w="100%" justifyContent="center">
      <Container maxW="container.xl">
        <Flex justify="space-between" alignItems="center" py="2">
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
            <Heading size="lg" color="white">
              A-Partner
            </Heading>
          </Link>
          <Spacer />
          {isSmallerThanLg ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
              >
                Menu
              </MenuButton>

              <MenuList>
                <MenuItem as={RouterLink} to="/inquiries">
                  Inquiries
                </MenuItem>
                <MenuItem as={RouterLink} to="/me">
                  Me
                </MenuItem>
                <MenuItem as={RouterLink} to="/owner">
                  Owner
                </MenuItem>
                <MenuItem as={RouterLink} to="/searcher">
                  Searcher
                </MenuItem>
                <MenuItem as={RouterLink} to="/renter">
                  Renter
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Flex alignItems="center">
              <NavLinks />
              {username ? (
                <>
                  <ChakraText color="white" fontWeight="medium" mr="4">
                    {username}
                  </ChakraText>
                  <Button colorScheme="blue" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    colorScheme="blue"
                    ml="30"
                    as={RouterLink}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    colorScheme="blue"
                    ml="40"
                    as={RouterLink}
                    to="/signup"
                  >
                    Sign Up!
                  </Button>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Container>
    </Flex>
  );
};

const NavLinks = () => (
  <Flex as="nav" alignItems="center" justifyContent="space-between" w="100%">
    <NavLink to="/inquiries">My Inquiries</NavLink>
    <NavLink to="/me">Me</NavLink>

    <Menu>
      <MenuButton
        as={Button}
        color="black"
        fontWeight="medium"
        mr="4"
        _hover={{ textDecoration: "none" }}
      >
        <Flex alignItems="center">
          <RouterLink
            to="/owner"
            style={{ textDecoration: "none", color: "black" }}
          >
            Owner
          </RouterLink>
          <ChevronRightIcon ml="1" />
        </Flex>
      </MenuButton>
      <MenuList bg="black">
        <MenuItem as={RouterLink} to="/owner/">
          Owner
        </MenuItem>
        <MenuItem as={RouterLink} to="/owner/my-apartments">
          My Apartments
        </MenuItem>
        <MenuItem as={RouterLink} to="/owner/my-rooms">
          My Rooms
        </MenuItem>
        <MenuItem as={RouterLink} to="/owner/my-contracts">
          My Contracts
        </MenuItem>
      </MenuList>
    </Menu>
    <Menu>
      <MenuButton
        as={Button}
        color="black"
        fontWeight="medium"
        mr="4"
        _hover={{ textDecoration: "none" }}
      >
        <Flex alignItems="center">
          <RouterLink
            to="/Searcher"
            style={{ textDecoration: "none", color: "black" }}
          >
            Searcher
          </RouterLink>
          <ChevronRightIcon ml="1" />
        </Flex>
      </MenuButton>
      <MenuList bg="black">
        <MenuItem as={RouterLink} to="/searcher/">
          Searcher
        </MenuItem>
        <MenuItem as={RouterLink} to="/searcher/search">
          Search
        </MenuItem>
      </MenuList>
    </Menu>
    <Menu>
      <MenuButton
        as={Button}
        color="black"
        fontWeight="medium"
        mr="4"
        _hover={{ textDecoration: "none" }}
      >
        <Flex alignItems="center">
          <RouterLink
            to="/Renter"
            style={{ textDecoration: "none", color: "black" }}
          >
            Renter
          </RouterLink>
          <ChevronRightIcon ml="1" />
        </Flex>
      </MenuButton>
      <MenuList bg="black">
        <MenuItem as={RouterLink} to="/renter/">
          Renter
        </MenuItem>
        <MenuItem as={RouterLink} to="/renter/my-apartment">
          My Apartment
        </MenuItem>
        <MenuItem as={RouterLink} to="/renter/my-bills">
          My Bills
        </MenuItem>
        <MenuItem as={RouterLink} to="/renter/my-room">
          My Room
        </MenuItem>
      </MenuList>
    </Menu>
  </Flex>
);

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    as={RouterLink}
    to={to}
    color="white"
    fontWeight="medium"
    _hover={{ textDecoration: "none" }}
  >
    {children}
  </Link>
);

export default Header;
