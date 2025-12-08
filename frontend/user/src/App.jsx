
import { Route, Routes } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import { ServiceProgress } from "./components/ServiceProgress";
import { UsageHistory } from "./components/UsageHistory";
import { ProfileEdit } from "./components/ProfileEdit";


function App() {
  return (
<>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/main" element={<MainMenu />} />
        <Route path="/service" element={<ServiceProgress />}/>
        <Route path="/history" element={<UsageHistory />}/>
        <Route path="/profile" element={<ProfileEdit />}/>
      </Routes>
</>
  );
}

export default App;
