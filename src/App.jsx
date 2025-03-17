import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Home,
   Login,
   Signup,
   Profile,
  } from "./pages";

import{ Layout} from "./components";

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* ✅ Wrap protected and public routes in Layout */}
        <Route element={<Layout />}>
          {/* Protected routes */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
  
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </>
    )
  );


const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
