// import logo from './logo.svg';
// import './App.css';
import MainApp from './MainApp';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </div>
  );
}

export default App;
