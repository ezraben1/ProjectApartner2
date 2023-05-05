import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home/HomePage';
import Profile from './pages/Profile';
import OwnerPage from './pages/Owner/OwnerPage';
import MyApartments from './components/Apartment/MyApartments';
import OwnerRoutes from './pages/Owner/OwnerRoutes';
import MyRooms from './components/Room/MyRooms';
import Layout from './layout/Layout';
import MinimalExample from './pages/MinimalExample';
import MyContracts from './components/Contract/MyContracts';
import SingleContract from './components/Contract/SingleContract';
import OwnerSingleApartment from './components/Apartment/OwnerSingleApartment';
import RenterSingleApartment from './components/Apartment/RenterSingleApartment';

import SingleRoom from './components/Room/OwnerSingleRoom';
import SignUp from './pages/SignUp';
import { ChakraProvider } from '@chakra-ui/react';
import PublicSingleRoom from './components/Room/PublicSingleRoom';
import BillsList from './components/Bill/BillsList';
import SingleBill from './components/Bill/SingleBill';
import OwnerSingleContract from './components/Contract/OwnerSingleContract';
import OwnerSingleRoom from './components/Room/OwnerSingleRoom';
import SearcherPage from './pages/Searcher/SearcherPage';
import SearcherRoutes from './pages/Searcher/SearcherRoutes';
import SearcherSearch from './components/Search/SearcherSearch';
import SearcherResults from './components/Search/SearcherResults';
import ApartmentContracts from './components/Contract/ApartmentContracts';
import { UserProvider } from './utils/UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLoginSuccess = async (token: string | undefined): Promise<void> => {
    setCurrentUser(null);
  };



  return (
    <UserProvider>
      <ChakraProvider>
        <Router>
          <Layout currentUser={currentUser} onLoginSuccess={handleLoginSuccess}>
            <Routes>
              <Route path="/" element={<Home currentUser={currentUser} />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home/:id" element={<PublicSingleRoom />} />

              <Route path="/me" element={<Profile />} />
              <Route path="/owner" element={<OwnerPage />} />
              <Route path="/owner/*" element={<OwnerRoutes />} />
              <Route path="/owner/my-apartments" element={<MyApartments />} />
              <Route path="/owner/my-apartments/:id" element={<OwnerSingleApartment />} />
              <Route path="/owner/my-apartments/:id/room/:id" element={<OwnerSingleRoom />} />
              <Route path="/owner/my-apartments/:id/contracts/" element={<ApartmentContracts />} />

              <Route path="/owner/my-apartments/:apartmentId/room/:roomId/contracts/:contractId" element={<OwnerSingleContract />} />

              <Route path="/owner/my-apartments/:apartmentId/bills/" element={<BillsList />} />
              <Route path="/owner/my-apartments/:apartmentId/bills/:billId" element={<SingleBill />} />
              <Route path="/owner/my-rooms" element={<MyRooms />} />
              <Route path="/owner/my-rooms/:id" element={<SingleRoom />} />
              <Route path="/owner/my-contracts" element={<MyContracts />} />
              <Route path="/owner/contracts/:id" element={<SingleContract />} />

              <Route path="/renter/my-apartment/" element={<RenterSingleApartment />} />

              <Route path="/test" element={<MinimalExample />} />

              <Route path="/searcher" element={<SearcherPage />} />
              <Route path="/searcher/*" element={<SearcherRoutes />} />
              <Route path="/searcher/search" element={<SearcherSearch />} />
              <Route path="/searcher/searcherResults" element={<SearcherResults />} />

            </Routes>
          </Layout>
        </Router>
      </ChakraProvider>
    </UserProvider>
  );
}


export default App;