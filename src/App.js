import React, { useState } from 'react';
import { catalogoInicial } from './data/cuentas';
import './styles/global.css';

function App() {
  const [bal, setBal] = useState(catalogoInicial);
  const [f, setF] = useState("13 de marzo de 2026");
  const [input, setInput] = useState({ cuenta: 'bancos', monto: '', tipo: 'cargo' });

  // LÓGICA ACTUALIZADA CON FECHAS DE MARZO Y NUEVAS ACTIVIDADES
  const ver = (actividad) => {
    let n = JSON.parse(JSON.stringify(catalogoInicial));
    
    if (actividad === 'apertura') {
      setF("23 de enero de 2026");
      // Cuentas iniciales
    } else if (actividad === 'ajustes_feb') {
      setF("04 de febrero de 2026");
      n.activo.bancos = 6160; n.pasivo.anticipoClientes = 4000;
    } else if (actividad === 'marzo_inv') {
      setF("10 de marzo de 2026");
      // Ajuste de inventario de la subcompetencia anterior
      n.activo.bancos = 15912; n.activo.inventarios = 4036; n.activo.ivaAcred = 14440;
    } else if (actividad === 'cierre_marzo') {
      setF("13 de marzo de 2026");
      // Cierre con estados financieros finales
      n.activo.bancos = 15912; n.activo.edificios = 796666.67; 
      n.pasivo.acreedores = 16340; n.pasivo.ivaTrasladado = 2458.97;
    }
    setBal(n);
  };

  const procesarEntrada = (e) => {
    e.preventDefault();
    let n = JSON.parse(JSON.stringify(bal));
    const valor = Number(input.monto);
    if (input.tipo === 'cargo') {
      if (n.activo[input.cuenta] !== undefined) n.activo[input.cuenta] += valor;
      else if (n.pasivo[input.cuenta] !== undefined) n.pasivo[input.cuenta] -= valor;
    } else {
      if (n.activo[input.cuenta] !== undefined) n.activo[input.cuenta] -= valor;
      else if (n.pasivo[input.cuenta] !== undefined) n.pasivo[input.cuenta] += valor;
    }
    setBal(n);
    setInput({ ...input, monto: '' });
  };

  // DATOS PARA ESTADO DE RESULTADOS (Lo nuevo que pide la maestra)
  const ingresos = 11300;
  const costos = 5000;
  const gastos = 2611.55; 
  const utilidadNeta = ingresos - costos - gastos;

  const tA = Object.values(bal.activo).reduce((a, b) => a + (Number(b) || 0), 0);
  const tPC = Object.values(bal.pasivo).reduce((a, b) => a + (Number(b) || 0), 0) + (Number(bal.capital) || 0) + utilidadNeta;

  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <h2 className="brand">SISTEMA MAYI 2026</h2>
        
        <div className="menu-group">
          <p className="entry-title">LÍNEA DE TIEMPO (ACTIVIDADES)</p>
          <button onClick={() => ver('apertura')}>1. Apertura (Ene)</button>
          <button onClick={() => ver('ajustes_feb')}>2. Ajustes (Feb)</button>
          <button onClick={() => ver('marzo_inv')}>3. Ajuste Inv. (Mar)</button>
          <button onClick={() => ver('cierre_marzo')}>4. Cierre Final (13 Mar)</button>
        </div>

        <form className="data-entry" onSubmit={procesarEntrada}>
          <p className="entry-title">NUEVO ASIENTO DE AJUSTE</p>
          <select value={input.cuenta} onChange={(e) => setInput({...input, cuenta: e.target.value})}>
            <option value="bancos">Bancos</option>
            <option value="inventarios">Inventarios</option>
            <option value="acreedores">Acreedores</option>
          </select>
          <input type="number" placeholder="Monto $" value={input.monto} onChange={(e) => setInput({...input, monto: e.target.value})} />
          <div className="btn-group">
            <button type="button" onClick={() => setInput({...input, tipo: 'cargo'})} className={input.tipo === 'cargo' ? 'active' : ''}>Cargo</button>
            <button type="button" onClick={() => setInput({...input, tipo: 'abono'})} className={input.tipo === 'abono' ? 'active' : ''}>Abono</button>
          </div>
          <button type="submit" className="btn-save">Registrar en Libros</button>
        </form>

        <button className="btn-pdf" onClick={() => window.print()}>GENERAR ESTADOS FINANCIEROS</button>
      </aside>

      <main className="main-content">
        <div className="paper">
          <header className="header-report">
            <h1>COCINA ECONÓMICA MAYI</h1>
            <div className="badge-fintech">ESTADOS FINANCIEROS COMPLETO</div>
            <p className="date-display">Corte al: {f}</p>
          </header>

          <section className="results-box">
            <h4 className="section-h">1. ESTADO DE RESULTADOS (Subcompetencia Actual)</h4>
            <div className="r"><span>Ventas de Mercancía</span><span>${ingresos.toLocaleString()}</span></div>
            <div className="r"><span>(-) Costo de lo Vendido</span><span>(${costos.toLocaleString()})</span></div>
            <div className="r highlight"><span>Utilidad Bruta</span><span>${(ingresos - costos).toLocaleString()}</span></div>
            <div className="r"><span>(-) Gastos de Administración</span><span>(${gastos.toLocaleString()})</span></div>
            <div className="total-bar" style={{borderColor: 'var(--success)'}}>
              <span>UTILIDAD NETA</span>
              <span>${utilidadNeta.toLocaleString()}</span>
            </div>
          </section>

          <div className="divider"></div>

          <section className="balance-section">
            <h4 className="section-h">2. BALANCE GENERAL (Ajustado)</h4>
            <div className="grid-balance">
              <div className="col">
                <p className="cat-t">ACTIVO CIRCULANTE</p>
                <div className="r"><span>Bancos</span><span>${bal.activo.bancos.toLocaleString()}</span></div>
                <div className="r"><span>Inventarios</span><span>${bal.activo.inventarios.toLocaleString()}</span></div>
                <p className="cat-t">ACTIVO NO CIRCULANTE</p>
                <div className="r"><span>Edificios (Neto)</span><span>${bal.activo.edificios.toLocaleString()}</span></div>
                <div className="total-bar"><span>TOTAL ACTIVO</span><span>${tA.toLocaleString()}</span></div>
              </div>

              <div className="col">
                <p className="cat-t">PASIVO CORTO PLAZO</p>
                <div className="r"><span>Acreedores Diversos</span><span>${bal.pasivo.acreedores.toLocaleString()}</span></div>
                <p className="cat-t">CAPITAL CONTABLE</p>
                <div className="r"><span>Capital Social</span><span>${bal.capital.toLocaleString()}</span></div>
                <div className="r highlight"><span>Utilidad del Ejercicio</span><span>${utilidadNeta.toLocaleString()}</span></div>
                <div className="total-bar"><span>TOTAL P + C</span><span>${tPC.toLocaleString()}</span></div>
              </div>
            </div>
          </section>

          <footer className="sigs">
             <div><div className="line"></div><strong>Mauricio Alexander G. D.</strong><br/>ELABORÓ</div>
             <div><div className="line"></div><strong>Profa. Gonzalez Zuñiga Nuria</strong><br/>AUTORIZÓ</div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;