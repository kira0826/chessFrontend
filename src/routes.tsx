import { SignIn } from "./pages/auth/sign-in";
import { Home } from "./pages/home/home";
import { Play } from "./pages/play/play";
import { Profile } from "./pages/profile/Profile";

export const routes = [
  {
    layout: "home",
    pages: [
      {
        name: "home main",
        path: "/",
        element: <Home />,
      },
    ],
  },

  {
    layout: "play",
    pages: [
      {
        name: "play main",
        path: "/",
        element: <Play />,
      },
    ],
  },

  {
    layout: "profile",
    pages: [
      {
        name: "profile main",
        path: "/",
        element: <Profile />,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];
