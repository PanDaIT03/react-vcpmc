import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './App.css';
import { RootState } from './state';
import { protectedRoutes, publicRoutes } from './routes';
import { DefaultLayout } from './layout/DefaultLayout';
import { HeaderOnly } from './layout/HeaderOnly';

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
  const userState = useSelector((state: RootState) => state.user);
  const { currentUser } = userState;
  const isExisted = Object.keys(currentUser).length > 0;

  return isExisted ? children : <Navigate to="/login" state={{ from: path }} />;
};

export default App;