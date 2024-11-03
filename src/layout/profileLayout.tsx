import { routes } from "../routes";
import { Routes, Route } from "react-router-dom";

export function ProfileLayout() {

    return (
        <div className="w-full h-screen">
          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "profile" &&
                pages.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))
            )}
          </Routes>
        </div>
      );



}