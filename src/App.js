// import logo from './logo.svg';
// import './App.css';
import Router from './AppRouter';
import { AuthProvider } from './Contexts/AuthContext';
import { AlertsProvider } from './Contexts/AlertsContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AlertsProvider>
          <Router />
        </AlertsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
