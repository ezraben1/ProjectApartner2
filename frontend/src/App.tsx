import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home/HomePage";
import Profile from "./pages/Profile";
import OwnerPage from "./pages/Owner/OwnerPage";
import MyApartments from "./components/Apartment/MyApartments";
import MyRooms from "./components/Room/MyRooms";
import Layout from "./layout/Layout";
import MyContracts from "./components/Contract/MyContracts";
import OwnerSingleApartment from "./components/Apartment/OwnerSingleApartment";
import RenterSingleApartment from "./components/Apartment/RenterSingleApartment";
import SignUp from "./pages/SignUp";
import { ChakraProvider } from "@chakra-ui/react";
import PublicSingleRoom from "./components/Room/PublicSingleRoom";
import OwnerSingleContract from "./components/Contract/OwnerSingleContract";
import OwnerSingleRoom from "./components/Room/OwnerSingleRoom";
import ApartmentContracts from "./components/Contract/ApartmentContracts";
import { UserProvider } from "./utils/UserContext";
import SingleInquiry from "./components/Inquiry/SingleInquiry";
import RenterBillList from "./components/Bill/RenterBillList";
import RenterSingleBill from "./components/Bill/RetnerSingleBill";
import SearcherPage from "./pages/Searcher/SearcherPage";
import SearcherRoutes from "./pages/Searcher/SearcherRoutes";
import SearcherSearch from "./components/Search/SearcherSearch";
import OwnerBillsList from "./components/Bill/OwnerBillsList";
import OwnerSingleBill from "./components/Bill/OwnerSingleBill";
import SearcherSingleRoom from "./components/Room/SearcherSingleRoom";
import InquirySearch from "./components/Inquiry/InquirySearch";
import SearcherSingleContract from "./components/Contract/SearcherSingleContract";
import RenterSingleRoom from "./components/Room/RetnerSingleRoom";
import RenterSingleContract from "./components/Contract/RenterSingleContract";

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLoginSuccess = async (): Promise<void> => {
    setCurrentUser(null);
  };

  return (
    <UserProvider>
      <ChakraProvider>
        <Router>
          <Layout currentUser={currentUser} onLoginSuccess={handleLoginSuccess}>
            <Routes>
              <Route path="/" element={<Home currentUser={currentUser} />} />
              <Route
                path="/login"
                element={<Login onLoginSuccess={handleLoginSuccess} />}
              />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/me" element={<Profile />} />

              <Route path="/inquiries" element={<InquirySearch />} />
              <Route path="/inquiries/:id" element={<SingleInquiry />} />

              <Route path="/home/:id" element={<PublicSingleRoom />} />

              <Route path="/owner" element={<OwnerPage />} />
              <Route path="/owner/my-apartments" element={<MyApartments />} />
              <Route
                path="/owner/my-apartments/:id"
                element={<OwnerSingleApartment />}
              />
              <Route
                path="/owner/my-apartments/:id/room/:id"
                element={<OwnerSingleRoom />}
              />
              <Route
                path="/owner/my-apartments/:id/contracts/"
                element={<ApartmentContracts />}
              />
              <Route
                path="/owner/my-apartments/:apartmentId/room/:roomId/contracts/:contractId"
                element={<OwnerSingleContract />}
              />
              <Route
                path="/owner/my-apartments/:apartmentId/bills/"
                element={<OwnerBillsList />}
              />
              <Route
                path="/owner/my-apartments/:apartmentId/bills/:billId"
                element={<OwnerSingleBill />}
              />
              <Route path="/owner/my-rooms" element={<MyRooms />} />
              <Route path="/owner/my-contracts" element={<MyContracts />} />

              <Route
                path="/renter/my-apartment/"
                element={<RenterSingleApartment />}
              />
              <Route path="/renter/my-bills/" element={<RenterBillList />} />
              <Route
                path="/renter/my-bills/:billId"
                element={<RenterSingleBill />}
              />
              <Route path="/renter/my-room/" element={<RenterSingleRoom />} />
              <Route
                path="/renter/my-room/:roomId/contracts/:contractId"
                element={<RenterSingleContract />}
              />

              <Route path="/searcher" element={<SearcherPage />} />
              <Route path="/searcher/*" element={<SearcherRoutes />} />
              <Route path="/searcher/search" element={<SearcherSearch />} />
              <Route
                path="/searcher/searcher-search/:roomId"
                element={<SearcherSingleRoom />}
              />
              <Route
                path="/searcher/searcher-search/:roomId/contracts/:contractId"
                element={<SearcherSingleContract />}
              />
            </Routes>
          </Layout>
        </Router>
      </ChakraProvider>
    </UserProvider>
  );
}

export default App;
