import { Route, Routes } from "react-router-dom";
import RenterSingleApartment from "../../components/Apartment/RenterSingleApartment";
//import /* Import all your renter-related components here */;

const RenterRoutes = () => {
  return (
    <Routes>
      <Route path="/renter/my-apartment/" element={<RenterSingleApartment />} />
      {/* <Route path="/renter/me" element={<RenterMe />} />
      <Route path="/renter/my-apartment/" element={<RenterSingleApartment />} />
      <Route path="/renter/my-bills" element={<RenterMyBills />} />
      <Route path="/renter/my-room" element={<RenterMyRoom />} />
      <Route path="/renter/my-room/:roomId/bills" element={<RenterRoomBills />} />
      <Route path="/renter/my-room/:roomId/contracts/:contractId" element={<RenterRoomContractDetail />} /> */}
    </Routes>
  );
};

export default RenterRoutes;
