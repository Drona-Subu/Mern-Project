import React, {Suspense} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";


// import NewPlace from "./Routes/NewPlace";
// import MainNavigation from "./Components/Navigation/MainNavigation";
// import UserPlaces from "./Routes/UserPlaces";
// import UpdatePlace from "./Routes/UpdatePlace";
// import Auth from "./Routes/Auth";

import Users from "./Routes/Users";
import { AuthenticationContext } from "./Context/authContext";
import { useAuth } from "./hooks/auth-hook";
import LoadingSpinner from "./UIElements/LoadingSpinner";
const NewPlace = React.lazy(() => import('./Routes/NewPlace'));
const MainNavigation = React.lazy(() => import('./Components/Navigation/MainNavigation'));
const UserPlaces = React.lazy(() => import('./Routes/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./Routes/UpdatePlace'));
const Auth = React.lazy(() => import('./Routes/Auth'));

const App = () => {
  const {token, login, logout, userId} = useAuth();
  
  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route exact path="/" Component={Users} />
        <Route exact path="/:userId/places" Component={UserPlaces} />
        <Route exact path="/places/new" Component={NewPlace} />

        {/* This is supposed to come only after "/places/new" or else  
it will match anything after /places/ as :placeId . */}
        <Route exact path="/places/:placeId" Component={UpdatePlace} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route exact path="/" Component={Users} />
        <Route exact path="/:userId/places" Component={UserPlaces} />
        <Route exact path="/auth" Component={Auth} />
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <AuthenticationContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
        <Suspense fallback={<div className="center">
          <LoadingSpinner />
        </div>}>
        {routes}
        </Suspense>
        </main>
      </Router>
    </AuthenticationContext.Provider>
  );
};

export default App;

