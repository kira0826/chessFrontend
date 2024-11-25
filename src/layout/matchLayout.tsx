import { routes } from "../routes";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";

export function MatchLayout() {

    return (
      <Layout>
        <div className="w-full h-screen">
          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "match" &&
                pages.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))
            )}
          </Routes>
        </div>
      </Layout>
      );



}