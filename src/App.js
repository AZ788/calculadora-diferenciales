
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import CalculadoraPrimerOrden from './components/CalculadoraPrimerOrdenRL';
import CalculadoraSegundoOrden from './components/CalculadoraSegundoOrdenRCL';
import CalculadoraPrimerOrdenRC from'./components/CalculadoraPrimerOrdenRC';
import CalculadoraSegundoOrdenRLC from'./components/CalculadoraSegundoOrdenRLC'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/primer-orden" element={<CalculadoraPrimerOrden />} />
          <Route path="/segundo-orden" element={<CalculadoraSegundoOrden />} />
          <Route path="/primer-orden-rc" element={<CalculadoraPrimerOrdenRC />}/>
          <Route path="/segundo-orden-rlc" element={<CalculadoraSegundoOrdenRLC  />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
