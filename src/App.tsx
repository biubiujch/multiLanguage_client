import { BrowserRouter as Router, Routes } from "react-router-dom";
import router from "src/route";

const { renderPage, routes } = router;

function App() {
  return (
    <Router>
      <Routes>{routes.map((r) => renderPage(r))}</Routes>
    </Router>
  );
}

export default App;
