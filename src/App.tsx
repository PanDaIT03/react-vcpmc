import { useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import './App.css';
import { DefaultLayout } from './layouts/DefaultLayout';
import { HeaderOnly } from './layouts/HeaderOnly';
import { protectedRoutes, publicRoutes } from './routes';
import { RootState } from './state';

interface ProtectedRouteProps {
  path: string
  children: React.ReactElement
};

function App() {
  let Layout = DefaultLayout;

  return (
    <div className="App">
      <Router>
        <Routes>
          {publicRoutes.map((route, index) => {
            const { path, component, layout } = route;
            const Page = component;

            if (layout)
              Layout = layout;
            else if (layout == null)
              Layout = HeaderOnly;

            return <Route key={index} path={path} element={
              <Layout>
                <Page />
              </Layout>
            } />
          })}
          {protectedRoutes.map((route, index) => {
            const { path, component, layout } = route;
            const Page = component;

            if (layout)
              Layout = layout;
            else if (layout == null)
              Layout = HeaderOnly;

            return <Route key={index} path={path} element={
              <ProtectedRoute path={path}>
                <Layout>
                  <Page />
                </Layout>
              </ProtectedRoute>
            } />
          })}
        </Routes>
      </Router>
    </div>
  );
};

function ProtectedRoute({ path, children }: ProtectedRouteProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isExisted = Object.keys(currentUser).length > 0;

  return isExisted ? children : <Navigate to="/" state={{ from: path }} />;
};

export default App;