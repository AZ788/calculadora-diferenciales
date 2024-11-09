// src/components/CalculadoraPrimerOrden.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CalculadoraPrimerOrden() {
  const [useRandom, setUseRandom] = useState(false); // Alternar entre ingreso manual y valor aleatorio
  const [coeficientes, setCoeficientes] = useState({ tau: '', L: '', R: '', input: '' });
  const [resultado, setResultado] = useState('');
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate(); // Hook para navegar entre páginas

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoeficientes({ ...coeficientes, [name]: value });
  };

  const handleSwitch = () => {
    setUseRandom(!useRandom);
    setCoeficientes({ tau: '', L: '', R: '', input: '' }); // Reiniciar valores al cambiar método
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si se ingresa tau
    const tau = parseFloat(coeficientes.tau);
    const input = parseFloat(coeficientes.input);

    if (isNaN(tau) || tau <= 0) {
      setResultado('Por favor ingresa un valor válido para el tiempo constante τ (mayor que 0).');
      return;
    }

    if (isNaN(input) || input <= 0) {
      setResultado('Por favor ingresa un valor válido para el voltaje o corriente de entrada (mayor que 0).');
      return;
    }

    let L, R;
    let resultadoTexto = '';

    if (useRandom) {
      // Si se usa el modo aleatorio, asumimos un valor aleatorio para R
      R = (Math.random() * 10 + 1).toFixed(4); // Valor aleatorio para R entre 1 y 10
      L = (R * tau).toFixed(4);
      resultadoTexto = `Valor aleatorio para Resistencia (R): ${R} Ω\nValor calculado de Inductancia (L): ${L} H\nTiempo constante τ: ${tau} s\nValor de entrada: ${input}`;
    } else {
      // Si el usuario ingresa valores manualmente
      L = parseFloat(coeficientes.L);
      R = parseFloat(coeficientes.R);

      if (!isNaN(L) && isNaN(R)) {
        // Si se ingresa L, calculamos R
        R = (L / tau).toFixed(4);
        resultadoTexto = `Valor de Resistencia (R): ${R} Ω\nValor de Inductancia (L): ${L} H\nTiempo constante τ: ${tau} s\nValor de entrada: ${input}`;
      } else if (!isNaN(R) && isNaN(L)) {
        // Si se ingresa R, calculamos L
        L = (R * tau).toFixed(4);
        resultadoTexto = `Valor de Resistencia (R): ${R} Ω\nValor de Inductancia (L): ${L} H\nTiempo constante τ: ${tau} s\nValor de entrada: ${input}`;
      } else if (!isNaN(R) && !isNaN(L)) {
        // Si se ingresan ambos, verificar si cumplen con la relación
        const tau_calc = (L / R).toFixed(4);
        if (Math.abs(tau - tau_calc) < 0.01) {
          resultadoTexto = `Valores ingresados cumplen la relación:\nValor de Resistencia (R): ${R} Ω\nValor de Inductancia (L): ${L} H\nTiempo constante τ: ${tau} s\nValor de entrada: ${input}`;
        } else {
          setResultado('Los valores ingresados de R y L no cumplen con la relación τ = L/R.');
          return;
        }
      } else {
        setResultado('Por favor ingresa un valor válido para L o R.');
        return;
      }
    }

    // Definir la función de transferencia
    const funcionTransferencia = `
      H(s) = \\frac{1}{τs + 1} = \\frac{1}{${tau.toFixed(4)}s + 1}
    `;

    // Generar datos para la gráfica de respuesta al escalón
    const time = [];
    const response = [];
    for (let t = 0; t <= 10; t += 0.1) {
      const stepResponse = input * (1 - Math.exp(-t / tau));
      time.push(t.toFixed(2));
      response.push(stepResponse);
    }

    setChartData({
      labels: time,
      datasets: [
        {
          label: 'Respuesta al Escalón',
          data: response,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    });

    setResultado({ texto: resultadoTexto, funcionTransferencia });
  };

  return (
    <MathJaxContext>
      <div className="calculadora">
        <h2>Calculadora de Ecuación Diferencial de Primer Orden</h2>
        <label>
          <input type="checkbox" checked={useRandom} onChange={handleSwitch} />
          Usar valor aleatorio para R
        </label>
        <form onSubmit={handleSubmit} className="formulario">
          <label>Tiempo constante (τ):<input type="number" step="0.01" name="tau" value={coeficientes.tau} onChange={handleChange} /></label>
          {!useRandom && (
            <>
              <label>Inductancia (L):<input type="number" step="0.01" name="L" value={coeficientes.L} onChange={handleChange} /></label>
              <label>Resistencia (R):<input type="number" step="0.01" name="R" value={coeficientes.R} onChange={handleChange} /></label>
            </>
          )}
          <label>Voltaje o Corriente de Entrada:<input type="number" step="0.01" name="input" value={coeficientes.input} onChange={handleChange} /></label>
          <button type="submit" className="btn-calculate">Calcular</button>
        </form>
        <div className="resultado">
          {resultado && (
            <>
              <pre>{resultado.texto}</pre>
              <div className="funcion-transferencia" style={{ border: '1px solid black', padding: '10px', margin: '20px 0' }}>
                <MathJax dynamic inline>{`\\[${resultado.funcionTransferencia}\\]`}</MathJax>
              </div>
            </>
          )}
        </div>
        {chartData && (
          <div className="grafica">
            <h3>Gráfica de Respuesta al Escalón</h3>
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        )}
        <button className="btn-back" onClick={() => navigate('/')}>Volver al Menú Principal</button>
      </div>
    </MathJaxContext>
  );
}

export default CalculadoraPrimerOrden;
