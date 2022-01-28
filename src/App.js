// import logo from './logo.svg';
// import './App.css';
import Container from '@mui/material/Container';
import Router from './AppRouter';
import { AuthProvider } from './Contexts/AuthContext';
import { AlertsProvider } from './Contexts/AlertsContext';

function App() {
  return (
    <Container className="App">
      <AuthProvider>
        <AlertsProvider>
          <Router />
        </AlertsProvider>
      </AuthProvider>
    </Container>
  );
}

export default App;
