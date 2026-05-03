import React, { useState } from 'react';

const ArqueoCaja = () => {
  const [fondoAutorizado] = useState(20000);
  
  const [billetes, setBilletes] = useState({
    b500: 0, b200: 0, b100: 0, b50: 0, b20: 0, m10: 0, m5: 0, m2: 0, m1: 0, m50c: 0
  });

  const [gastos, setGastos] = useState([]);
  const [nuevoGasto, setNuevoGasto] = useState({ concepto: '', monto: '' });
  const [errorGasto, setErrorGasto] = useState('');

  const calcularEfectivo = () => {
    return (
      (billetes.b500 * 500) + (billetes.b200 * 200) + (billetes.b100 * 100) +
      (billetes.b50 * 50) + (billetes.b20 * 20) + (billetes.m10 * 10) +
      (billetes.m5 * 5) + (billetes.m2 * 2) + (billetes.m1 * 1) + (billetes.m50c * 0.5)
    );
  };

  const calcularGastos = () => gastos.reduce((acc, g) => acc + g.monto, 0);

  const totalEfectivo = calcularEfectivo();
  const totalGastos = calcularGastos();
  const sumaTotal = totalEfectivo + totalGastos;
  const diferencia = sumaTotal - fondoAutorizado;

  const handleAddGasto = (e) => {
    e.preventDefault();
    if (!nuevoGasto.concepto.trim()) {
      setErrorGasto("El concepto no puede estar vacío.");
      return;
    }
    if (nuevoGasto.monto <= 0 || isNaN(nuevoGasto.monto)) {
      setErrorGasto("El monto debe ser un número mayor a cero.");
      return;
    }
    setGastos([...gastos, { ...nuevoGasto, monto: parseFloat(nuevoGasto.monto) }]);
    setNuevoGasto({ concepto: '', monto: '' });
    setErrorGasto('');
  };

  const handleChangeBilletes = (denom, value) => {
    const num = parseInt(value) || 0;
    if (num >= 0) setBilletes({ ...billetes, [denom]: num });
  };

  return (
    <section className="arqueo-section" style={{ marginTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent)', margin: 0 }}>MÓDULO DE ARQUEO DE CAJA CHICA</h2>
        <div className="badge-fintech">INTERFAZ DE CONTROL INTERNO V1.0</div>
        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Fondo Autorizado: ${fondoAutorizado.toLocaleString()}</p>
      </div>

      <div className="grid-balance" style={{ gap: '2rem' }}>
        {/* COLUMNA 1: CONTEO FÍSICO */}
        <div className="col data-entry" style={{ background: 'transparent', padding: 0 }}>
          <h4 className="section-h">1. CONTEO FÍSICO (Efectivo)</h4>
          
          {Object.keys(billetes).map((key) => {
            const valor = parseFloat(key.replace('b', '').replace('m', '').replace('c', '')) / (key.includes('c') ? 100 : 1);
            return (
              <div className="r" key={key} style={{ alignItems: 'center' }}>
                <span>{key.includes('b') ? 'Billete' : 'Moneda'} ${valor}</span>
                <input 
                  type="number" 
                  min="0"
                  value={billetes[key] || ''} 
                  onChange={(e) => handleChangeBilletes(key, e.target.value)}
                  style={{ width: '70px', marginBottom: 0, padding: '4px' }}
                  placeholder="Cant."
                />
                <span>${(billetes[key] * valor).toLocaleString()}</span>
              </div>
            );
          })}
          <div className="total-bar">
            <span>TOTAL EFECTIVO</span>
            <span>${totalEfectivo.toLocaleString()}</span>
          </div>
        </div>

        {/* COLUMNA 2: COMPROBANTES Y RESULTADO */}
        <div className="col">
          <h4 className="section-h">2. COMPROBANTES DE GASTOS</h4>
          
          <form onSubmit={handleAddGasto} className="data-entry" style={{ marginBottom: '1rem', padding: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Concepto" 
                value={nuevoGasto.concepto}
                onChange={(e) => setNuevoGasto({...nuevoGasto, concepto: e.target.value})}
                style={{ flex: 2, marginBottom: 0 }}
              />
              <input 
                type="number" 
                step="0.01"
                placeholder="$ Monto" 
                value={nuevoGasto.monto}
                onChange={(e) => setNuevoGasto({...nuevoGasto, monto: e.target.value})}
                style={{ flex: 1, marginBottom: 0 }}
              />
              <button type="submit" className="btn-save" style={{ width: '40px', padding: 0 }}>+</button>
            </div>
            {errorGasto && <p style={{ color: '#EF4444', fontSize: '0.7rem', marginTop: '5px', marginBottom: 0 }}>⚠️ {errorGasto}</p>}
          </form>

          <div className="gastos-list" style={{ minHeight: '120px' }}>
            {gastos.map((g, i) => (
              <div className="r" key={i}>
                <span>{g.concepto}</span>
                <span>${g.monto.toLocaleString()}</span>
              </div>
            ))}
            {gastos.length === 0 && <p style={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center', marginTop: '20px' }}>No hay gastos registrados.</p>}
          </div>

          <div className="total-bar">
            <span>TOTAL GASTOS</span>
            <span>${totalGastos.toLocaleString()}</span>
          </div>

          {/* SECCIÓN 3: RESULTADO VISUAL */}
          <h4 className="section-h" style={{ marginTop: '2rem' }}>3. RESULTADO DEL ARQUEO</h4>
          <div className="r"><span>Efectivo + Gastos:</span> <span>${sumaTotal.toLocaleString()}</span></div>
          
          <div className="total-bar" style={{ 
            marginTop: '1rem', 
            borderLeftColor: diferencia === 0 ? '#10B981' : '#EF4444',
            backgroundColor: diferencia === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}>
            <span>ESTATUS: {diferencia === 0 ? "CUADRADO" : diferencia > 0 ? "SOBRANTE" : "FALTANTE"}</span>
            <span style={{ color: diferencia === 0 ? '#10B981' : '#EF4444' }}>
              ${Math.abs(diferencia).toLocaleString()}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ArqueoCaja;