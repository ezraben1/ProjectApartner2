// src/pages/SearcherPage.tsx
import React from "react";
import {Link, Outlet} from "react-router-dom";
import {Button} from "react-bootstrap";

const SearcherPage: React.FC = () => {
  return (
      <div className="d-flex flex-column align-items-center justify-content-center">
          <h1 className="mb-5">Welcome to the Searcher Page</h1>
          <div className="d-flex justify-content-center mb-5">
              <Link to="/login">
                  <Button className="mx-2" variant="primary">
                      Login
                  </Button>
              </Link>
              <Link to="/me">
                  <Button className="mx-2" variant="primary">
                      Profile
                  </Button>
              </Link>
              <Link to="/searcher/search">
                  <Button className="mx-2" variant="primary">
                      Search
                  </Button>
              </Link>
          </div>
          <Outlet />
      </div>
  );
};

export default SearcherPage;
