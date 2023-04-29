import { Link, Outlet } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const OwnerPage: React.FC = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <h1 className="mb-5">Welcome to the Owner Page</h1>
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
        <Link to="/owner/my-apartments">
          <Button className="mx-2" variant="primary">
            My Apartments
          </Button>
        </Link>
        <Link to="/owner/my-rooms">
          <Button className="mx-2" variant="primary">
            My Rooms
          </Button>
        </Link>
        <Link to="/owner/my-contracts">
          <Button className="mx-2" variant="primary">
            My Contracts
          </Button>
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default OwnerPage;
