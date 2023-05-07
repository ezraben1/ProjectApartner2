import { Route, Routes } from "react-router-dom";
import SearcherSearch from "../../components/Search/SearcherSearch";
import SearcherSingleRoom from "../../components/Room/SearcherSingleRoom";
import SearcherSingleContract from "../../components/Contract/SearcherSingleContract";

//import /* Import all your searcher-related components here */;

const SearcherRoutes = () => {
  return (
    <Routes>
      <Route path="/searcher/search" element={<SearcherSearch />} />
      <Route
        path="/searcher/searcher-search/:roomId"
        element={<SearcherSingleRoom />}
      />
      <Route
        path="/searcher/searcher-search/:roomId/contracts"
        element={<SearcherSingleContract />}
      />
    </Routes>
  );
};

export default SearcherRoutes;
