import { Route, Routes } from "react-router-dom";
import RenterSingleApartment from "../../components/Apartment/RenterSingleApartment";
import RenterBillList from "../../components/Bill/RenterBillList";
import RenterSingleBill from "../../components/Bill/RetnerSingleBill";
import RenterSingleContract from "../../components/Contract/RenterSingleContract";
//import /* Import all your renter-related components here */;

const RenterRoutes = () => {
  return (
    <Routes>
      <Route path="/renter/my-apartment/" element={<RenterSingleApartment />} />
      <Route path="/renter/my-bills/" element={<RenterBillList />} />
      <Route path="/renter/my-bills/:billId" element={<RenterSingleBill />} />
      <Route
        path="/renter/my-room/:roomId/contracts/:contractId"
        element={<RenterSingleContract />}
      />
    </Routes>
  );
};

export default RenterRoutes;
