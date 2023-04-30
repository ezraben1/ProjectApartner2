import { Route, Routes } from "react-router-dom";
import MyApartments from "../../components/Apartment/MyApartments";
import MyRooms from "../../components/Room/MyRooms";
import useFetchRooms from "../../components/Room/useFetchRooms";
import SingleContract from "../../components/Contract/SingleContract";
import MyContracts from "../../components/Contract/MyContracts";
import SingleApartment from "../../components/Apartment/SingleApartment";
import OwnerSingleRoom from "../../components/Room/OwnerSingleRoom";
import BillsList from "../../components/Bill/BillsList";
import SingleBill from "../../components/Bill/SingleBill";
import OwnerSingleContract from "../../components/Contract/OwnerSingleContract";

//import /* Import all your owner-related components here */;

const OwnerRoutes = () => {
  const { loading, error } = useFetchRooms('/owner/owner-rooms/');
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>; 

  return (
    <Routes>
      <Route path="/owner/my-apartments" element={<MyApartments />} />
      <Route path="/owner/my-apartments/:id" element={<SingleApartment />} />
      <Route path="/owner/my-apartments/:id/room/:id" element={<OwnerSingleRoom />} />
      <Route path="/owner/my-apartments/:apartmentId/bills/" element={<BillsList/>} />
      <Route path="/owner/my-apartments/:apartmentId/bills/:billId" element={<SingleBill />} />
      <Route path="/owner/owner-apartments/:apartmentId/room/:roomId/contracts/:contractId/" element={<OwnerSingleContract />} />

      {/* 
      <Route path="/owner/apartments/:apartmentId/contracts/:contractId" element={<OwnerContractDetail />} />
      <Route path="/owner/apartments/:apartmentId/rooms/:roomId/contracts/:contractId" element={<OwnerRoomContractDetail />} />
      <Route path="/owner/rooms/:roomId/create-contract" element={<OwnerCreateContract />} />
      <Route path="/owner/rooms/:roomId/contracts/:contractId" element={<OwnerRoomContractDetail />} /> */}
      <Route path="/owner/my-rooms" element={<MyRooms />} />
      <Route path="/owner/my-rooms/id" element={<OwnerSingleRoom />} />

      <Route path="/owner/contracts" element={<MyContracts />} />
      <Route path="/owner/contracts/:id" element={<SingleContract />} />



    </Routes>
  );
};

export default OwnerRoutes;
