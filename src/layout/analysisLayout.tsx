import { routes } from "../routes";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";

export function AnalysisLayout() {
  return (
    <div className="h-screen flex flex-col ">
      <Layout>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "analysis" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))
          )}
        </Routes>
      </Layout>
    </div>
  );
}
