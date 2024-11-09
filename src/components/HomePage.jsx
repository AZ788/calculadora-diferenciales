import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const redirectTo = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage">
      <h1>Calculadora y Graficadora de Circuitos </h1>
      <p>
        Selecciona el tipo de circuito que deseas analizar.
      </p>
      <div className="gallery">
        <div className="image-container" onClick={() => redirectTo('/primer-orden')}>
          <img src="/images/primer.png" alt="Circuito Primer Orden" />
          <div className="description">Circuito RL</div>
        </div>
        <div className="image-container" onClick={() => redirectTo('/primer-orden-rc')}>
          <img src="/images/RC.png" alt="Circuito RC" />
          <div className="description">Circuito RC</div>
        </div>
        <div className="image-container" onClick={() => redirectTo('/segundo-orden')}>
          <img src="/images/RCL.png" alt="Circuito RCL" />
          <div className="description">Circuito RCL</div>
        </div>
        <div className="image-container" onClick={() => redirectTo('/segundo-orden-rlc')}>
          <img src="/images/RLC.png" alt="Circuito RLC" />
          <div className="description">Circuito RLC</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
