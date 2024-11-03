import { routes } from "../routes";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";

export function PlayLayout() {

    return (
      <Layout>
        <div className="w-full h-screen">
          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "play" &&
                pages.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))
            )}
          </Routes>
        </div>
      </Layout>
      );



}