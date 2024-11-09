
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import CalculadoraPrimerOrden from './components/CalculadoraPrimerOrden';
import CalculadoraSegundoOrden from './components/CalculadoraSegundoOrden';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/primer-orden" element={<CalculadoraPrimerOrden />} />
          <Route path="/segundo-orden" element={<CalculadoraSegundoOrden />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
