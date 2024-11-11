import { Routes, Route } from "react-router-dom";
import { PlayLayout } from "./layout/playLayout";
import { ProfileLayout } from "./layout/profileLayout";
import { AuthLayout } from "./layout/authLayout";
import { HomeLayout } from "./layout/homeLayout";
import { AnalysisLayout } from "./layout";


function App() {
  return (
    <Routes>
    <Route path="/play/*" element={<PlayLayout/>} />
    <Route path="/profile/*" element={<ProfileLayout/>} />
    <Route path="/auth/*" element={<AuthLayout/>} />
    <Route path="/analysis/*" element={<AnalysisLayout/>} />
    <Route path="/*" element={<HomeLayout/>} />
  </Routes>
  );
}

export default App;
