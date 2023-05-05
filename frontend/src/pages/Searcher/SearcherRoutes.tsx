import { Route, Routes } from "react-router-dom";
import SearcherSearch from "../../components/Search/SearcherSearch";
import SearcherResults from "../../components/Search/SearcherResults";

//import /* Import all your searcher-related components here */;

const SearcherRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/searcher/me" element={<SearcherMe />} />*/}
      <Route path="/searcher/search" element={<SearcherSearch />} />
      <Route path="/searcher/searcherResults" element={<SearcherResults />} />
      {/*<Route path="/searcher/search/:apartmentId/rooms/:roomId" element={<SearcherRoomDetail />} />
      <Route path="/searcher/search/:apartmentId/rooms/:roomId/contracts" element={<SearcherRoomContracts />} />
      <Route path="/searcher/search/:apartmentId/rooms/:roomId/sign-contract" element={<SearcherRoomSignContract />} />
      <Route path="/searcher/search/:apartmentId/rooms/:roomId/contracts/:contractId" element={<SearcherContractDetail />} /> */}
    </Routes>
  );
};

export default SearcherRoutes;
