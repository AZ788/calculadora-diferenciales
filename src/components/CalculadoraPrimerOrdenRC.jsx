import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CalculadoraPrimerOrden() {
  const [useRandom, setUseRandom] = useState(false); 
  const [coeficientes, setCoeficientes] = useState({ tau: '', C: '', R: '', input: '' });
  const [resultado, setResultado] = useState('');
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoeficientes({ ...coeficientes, [name]: value });
  };

  const handleSwitch = () => {
    setUseRandom(!useRandom);
    setCoeficientes({ tau: '', C: '', R: '', input: '' }); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    let C, R;
    let resultadoTexto = '';

    if (useRandom) {
      R = (Math.random() * 10 + 1).toFixed(4);
      C = (tau / R).toFixed(4);
      resultadoTexto = `Valor aleatorio para Resistencia (R): ${R} Ω\nValor calculado de Capacitancia (C): ${C} F\nTiempo constante τ: ${tau} s\nValor de entrada: ${input}`;
    } else {
      C = parseFloat(coeficientes.C);
      R = parseFloat(coeficientes.R);

      if (!isNaN(C) && isNaN(R)) {
        R = (tau / C).toFixed(4);
        resultadoTexto = `Valor de Resistencia (R): ${R} Ω\nValor de Capacitancia (C): ${C} F\nTiempo constante τ: ${tau} s\nValor de entrada: ${input}`;
      } else if (!isNaN(R) && isNaN(C)) {
        C = (tau / R).toFixed(4);
        resultadoTexto = `Valor de Resistencia (R): ${R} Ω\nValor de Capacitancia (C): ${C} F\nTiempo constante τ: ${tau} s\nValor de entrada: ${input}`;
      } else if (!isNaN(R) && !isNaN(C)) {
        const tau_calc = (R * C).toFixed(4);
        if (Math.abs(tau - tau_calc) < 0.01) {
          resultadoTexto = `Valores ingresados cumplen la relación:\nValor de Resistencia (R): ${R} Ω\nValor de Capacitancia (C): ${C} F\nTiempo constante τ: ${tau} s\nValor de entrada: ${input}`;
        } else {
          setResultado('Los valores ingresados de R y C no cumplen con la relación τ = R * C.');
          return;
        }
      } else {
        setResultado('Por favor ingresa un valor válido para C o R.');
        return;
      }
    }

    const rc = (1 / (R * C)).toFixed(4);
    const funcionTransferencia = `
      F(s) = \\frac{1}{τs + 1} =\\frac{${rc}}{s + ${rc}}
    `;

    const time = [];
    const response = [];
    for (let t = 0; t <= 100; t += 0.1) {
      const stepResponse = input * (1 - Math.exp(-t / tau));
      time.push(t.toFixed(2));
      response.push(stepResponse);
    }

    setChartData({
      labels: time,
      datasets: [
        {
          label: 'Señal de salida',
          data: response,
          borderColor: '#420B5C',
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
        <h2>Calculadora de Ecuación Diferencial de Primer Orden (Circuito RC)</h2>
        <label>
          <input type="checkbox" checked={useRandom} onChange={handleSwitch} />
          Usar valor aleatorio para R
        </label>
        <form onSubmit={handleSubmit} className="formulario">
          <label>Tiempo constante (τ):<input type="number" step="0.01" name="tau" value={coeficientes.tau} onChange={handleChange} /></label>
          {!useRandom && (
            <>
              <label>Capacitancia (C):<input type="number" step="0.01" name="C" value={coeficientes.C} onChange={handleChange} /></label>
              <label>Resistencia (R):<input type="number" step="0.01" name="R" value={coeficientes.R} onChange={handleChange} /></label>
            </>
          )}
          <label>Voltaje de Entrada:<input type="number" step="0.01" name="input" value={coeficientes.input} onChange={handleChange} /></label>
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
            <h3>Gráfica de Respuesta a la Señal de Entrada</h3>
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        )}
        <button className="btn-back" onClick={() => navigate('/')}>Volver al Menú Principal</button>
      </div>
    </MathJaxContext>
  );
}

export default CalculadoraPrimerOrden;
