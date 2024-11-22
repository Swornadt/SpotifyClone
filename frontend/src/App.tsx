import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/Auth-CallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import Chatpage from "./pages/chat/Chatpage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import Page404 from "./pages/404/Page404";
function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />}/>

        <Route element={<MainLayout/>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<Chatpage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
      <Toaster/>
    </>
  );
}

export default App;
