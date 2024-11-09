
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './HomePage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CalculadoraSegundoOrden() {
  const [useKiWn, setUseKiWn] = useState(false); // Alternar entre RLC y Ki/Wn
  const [coeficientes, setCoeficientes] = useState({ R: '', L: '', C: '', Ki: '', wn: '' });
  const [resultado, setResultado] = useState('');
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoeficientes({ ...coeficientes, [name]: value });
  };

  const handleSwitch = () => {
    setUseKiWn(!useKiWn);
    setCoeficientes({ R: '', L: '', C: '', Ki: '', wn: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let aValue, bValue, cValue, zeta, omega_n;

    if (useKiWn) {
      const Ki = parseFloat(coeficientes.Ki);
      omega_n = parseFloat(coeficientes.wn);

      if (isNaN(Ki) || isNaN(omega_n) || Ki <= 0 || omega_n <= 0) {
        setResultado('Por favor ingresa valores válidos para Ki y ωn (mayores que 0).');
        return;
      }
      const wn = parseFloat(coeficientes.wn);
      const ki = parseFloat(coeficientes.Ki);
      aValue = wn**2;
      bValue = 2*ki * wn ;
      cValue = wn**2;
      zeta = Ki;

    } else {
      const R = parseFloat(coeficientes.R);
      const L = parseFloat(coeficientes.L);
      const C = parseFloat(coeficientes.C);

      if (isNaN(R) || isNaN(L) || isNaN(C) || R <= 0 || L <= 0 || C <= 0) {
        setResultado('Por favor ingresa valores válidos para R, L y C (mayores que 0).');
        return;
      }

      const Ki = (1 / (2 * R)) * Math.sqrt(L / C);
      omega_n = 1 / Math.sqrt(L * C);

      aValue = 1 / (L * C);
      bValue = 2*Ki * omega_n ;
      cValue = 1 / (L * C);

      zeta = Ki;
    }


    let tipoAmortiguamiento = '';
    if (zeta > 1) {
      tipoAmortiguamiento = 'Sobreamortiguado';
    } else if (Math.abs(zeta - 1) < 0.001) {
      tipoAmortiguamiento = 'Críticamente amortiguado';
    } else if (Math.abs(zeta) < 0.001) {
      tipoAmortiguamiento = 'No amortiguado'; // Cercano a cero
    } else if (zeta > 0 && zeta < 1) {
      tipoAmortiguamiento = 'Subamortiguado';
    }


    const funcionTransferencia = `
      F(s) = \\frac{${aValue.toFixed(4)}}{s^2 + ${bValue.toFixed(4)}s + ${cValue.toFixed(4)}}
    `;


    let resultadoTexto = `Tipo de amortiguamiento: ${tipoAmortiguamiento}\n` +
      `Frecuencia natural ωn: ${omega_n.toFixed(4)}\n` +
      `Factor de amortiguamiento ζ: ${zeta.toFixed(7)}\n\n` +
      `Función de transferencia del sistema:\n`;

    if (zeta > 0.001 && zeta < 1) {
      let wd=omega_n*(Math.sqrt(1-(zeta**2)));
      let B = (Math.atan(Math.sqrt(1-(zeta**2))))*0.0174533;
      let tr = (((Math.PI)-B)/wd).toFixed(2);
      let tp = (Math.PI / wd).toFixed(2);
      let Mp = (Math.exp(-Math.PI * zeta / Math.sqrt(1 - zeta ** 2)) * 100).toFixed(2);
      let ts5 = (3 / (zeta * omega_n)).toFixed(4);
      let ts2 = (4 / (zeta * omega_n)).toFixed(4);

      resultadoTexto += `\nMétricas del sistema (solo para subamortiguado):\n` +
        `Tiempo de crecimiento (t_r): ${tr} s\n` +
        `Tiempo pico (t_p): ${tp} s\n` +
        `Máximo sobreimpulso (M_p): ${Mp} %\n` +
        `Tiempo de establecimiento (t_s) 5%: ${ts5} s\n` +
        `Tiempo de establecimiento (t_s) 2%: ${ts2} s`;
    }

    setResultado({ texto: resultadoTexto, funcionTransferencia });

    
    const time = [];
    const response = [];
    for (let t = 0; t <= 10; t += 0.1) {
      let stepResponse;
      if (zeta < 1) {
        stepResponse = 1 - Math.exp(-zeta * omega_n * t) * (Math.cos(omega_n * Math.sqrt(1 - zeta ** 2) * t) +
          (zeta / Math.sqrt(1 - zeta ** 2)) * Math.sin(omega_n * Math.sqrt(1 - zeta ** 2) * t));
      } else {
        stepResponse = 1 - (1 + zeta * omega_n * t) * Math.exp(-zeta * omega_n * t);
      }
      time.push(t.toFixed(2));
      response.push(stepResponse);
    }

    setChartData({
      labels: time,
      datasets: [
        {
          label: 'Señal de salida',
          data: response,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
          background:true//#region ,
        },
      ],
    });
  };

  return (
    <MathJaxContext>
      <div className="calculadora">
        <h2>Calculadora de Ecuación Diferencial de Segundo Orden (Sistemas Eléctricos)</h2>
        <label>
          <input type="checkbox" checked={useKiWn} onChange={handleSwitch} />
          Tengo \(K_i\) y \(\omega_n\) 
        </label>
        <form onSubmit={handleSubmit} className="formulario">
          {useKiWn ? (
            <>
              <label>Factor de amortiguamiento (Ki):<input type="number" step="0.01" name="Ki" value={coeficientes.Ki} onChange={handleChange} /></label>
              <label>Frecuencia natural (ωn):<input type="number" step="0.01" name="wn" value={coeficientes.wn} onChange={handleChange} /></label>
            </>
          ) : (
            <>
              <label>Resistencia (Ω):<input type="number" step="0.01" name="R" value={coeficientes.R} onChange={handleChange} /></label>
              <label>Inductancia (H):<input type="number" step="0.01" name="L" value={coeficientes.L} onChange={handleChange} /></label>
              <label>Capacitancia (F):<input type="number" step="0.01" name="C" value={coeficientes.C} onChange={handleChange} /></label>
            </>
          )}
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
            <h3>Gráfica de Señal de Salida</h3>
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        )}
        <button className="btn-back" onClick={() => navigate('/')}>Volver al Menú Principal</button>
      </div>
    </MathJaxContext>
  );
}

export default CalculadoraSegundoOrden;
