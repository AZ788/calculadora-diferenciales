// src/components/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <h1>Calculadora de Ecuaciones Diferenciales</h1>
      <p>
        Bienvenido a nuestra calculadora avanzada de ecuaciones diferenciales.
        Selecciona el tipo de sistema que deseas analizar.
      </p>
      <div className="buttons">
        <Link to="/primer-orden">
          <button className="btn">Calculadora de Primer Orden</button>
        </Link>
        <Link to="/segundo-orden">
          <button className="btn">Calculadora de Segundo Orden</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
