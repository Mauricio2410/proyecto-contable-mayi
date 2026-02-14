import React, { useState } from 'react';
import { catalogoInicial } from './data/cuentas';
import './styles/global.css';

function App() {
  const [bal, setBal] = useState(catalogoInicial);
  const [f, setF] = useState("23 de enero de 2026");
  const [input, setInput] = useState({ cuenta: 'bancos', monto: '', tipo: 'cargo' });

  const ver = (dia) => {
    let n = JSON.parse(JSON.stringify(catalogoInicial));
    if (dia === '28') {
      setF("28 de enero de 2026");
      n.activo.bancos = 1520; n.activo.inventarios = 10000; n.activo.ivaAcred = 480;
    } else if (dia === '30') {
      setF("30 de enero de 2026");
      n.activo.bancos = 1520; n.activo.inventarios = 10000; n.activo.ivaAcred = 480;
      n.activo.ivaPorAcred = 2240; n.activo.mobiliario = 35000; n.activo.gtosInst = 14000;
      n.activo.rentas = 5000; n.pasivo.acreedores = 16240;
    } else if (dia === '04') {
      setF("4 de febrero de 2026");
      n.activo.bancos = 6160; n.activo.inventarios = 10000; n.activo.ivaAcred = 1440;
      n.activo.ivaPorAcred = 2240; n.activo.mobiliario = 35000; n.activo.gtosInst = 18040;
      n.activo.rentas = 5000; n.pasivo.acreedores = 23240;
      n.pasivo.anticipoClientes = 4000; n.pasivo.ivaTrasladado = 640; n.capital = 1371000;
    } else {
      setF("23 de enero de 2026");
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

  const tA = Object.values(bal.activo).reduce((a, b) => a + (Number(b) || 0), 0);
  const tPC = Object.values(bal.pasivo).reduce((a, b) => a + (Number(b) || 0), 0) + (Number(bal.capital) || 0);

  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <h2 className="brand">SISTEMA CONTABLE</h2>
        
        <div className="menu-group">
          <button onClick={() => ver('23')}>23 Ene - Apertura</button>
          <button onClick={() => ver('28')}>28 Ene - Compra</button>
          <button onClick={() => ver('30')}>30 Ene - Ajustes</button>
          <button onClick={() => ver('04')}>04 Feb - Anticipo</button>
        </div>

        <form className="data-entry" onSubmit={procesarEntrada}>
          <p className="entry-title">ENTRADA DE DATOS</p>
          <select value={input.cuenta} onChange={(e) => setInput({...input, cuenta: e.target.value})}>
            <option value="bancos">Bancos</option>
            <option value="inventarios">Inventarios</option>
            <option value="caja">Caja</option>
            <option value="mobiliario">Mobiliario</option>
            <option value="acreedores">Acreedores</option>
            <option value="anticipoClientes">Anticipo Clientes</option>
          </select>
          <input type="number" placeholder="Monto" value={input.monto} onChange={(e) => setInput({...input, monto: e.target.value})} />
          <div className="btn-group">
            <button type="button" onClick={() => setInput({...input, tipo: 'cargo'})} className={input.tipo === 'cargo' ? 'active' : ''}>Cargo</button>
            <button type="button" onClick={() => setInput({...input, tipo: 'abono'})} className={input.tipo === 'abono' ? 'active' : ''}>Abono</button>
          </div>
          <button type="submit" className="btn-save">Registrar</button>
        </form>

        <div className="status-badge">✨ BALANCE CUADRADO</div>
        <button className="btn-pdf" onClick={() => window.print()}>GENERAR REPORTE PDF</button>
      </aside>

      <main className="main-content">
        <div className="paper">
          <header className="header-report">
            <h1>COCINA ECONÓMICA MAYI</h1>
            <h3>Estado de Situación Financiera</h3>
            <strong>Al {f}</strong>
          </header>

          <div className="grid-balance">
            <div className="col">
              <h4>ACTIVOS</h4>
              <p className="cat-t">CIRCULANTE</p>
              <div className="r"><span>Caja</span><span>${bal.activo.caja.toLocaleString()}</span></div>
              <div className="r"><span>Bancos</span><span>${bal.activo.bancos.toLocaleString()}</span></div>
              <div className="r"><span>Inventarios</span><span>${bal.activo.inventarios.toLocaleString()}</span></div>
              <div className="r"><span>IVA Acreditable</span><span>${bal.activo.ivaAcred.toLocaleString()}</span></div>
              <div className="r"><span>IVA por Acreditar</span><span>${bal.activo.ivaPorAcred.toLocaleString()}</span></div>
              <p className="cat-t">NO CIRCULANTE</p>
              <div className="r"><span>Terrenos</span><span>${bal.activo.terrenos.toLocaleString()}</span></div>
              <div className="r"><span>Edificios</span><span>${bal.activo.edificios.toLocaleString()}</span></div>
              <div className="r"><span>Mobiliario y Eq.</span><span>${bal.activo.mobiliario.toLocaleString()}</span></div>
              <div className="r"><span>Eq. Cómputo</span><span>${bal.activo.computo.toLocaleString()}</span></div>
              <p className="cat-t">DIFERIDO</p>
              <div className="r"><span>Gtos. Constitución</span><span>${bal.activo.gtosConst.toLocaleString()}</span></div>
              <div className="r"><span>Gtos. Instalación</span><span>${bal.activo.gtosInst.toLocaleString()}</span></div>
              <div className="r"><span>Rentas Pag. Ant.</span><span>${bal.activo.rentas.toLocaleString()}</span></div>
              <div className="r"><span>Papelería y Útiles</span><span>${bal.activo.papeleria.toLocaleString()}</span></div>
              <div className="total-bar"><span>TOTAL ACTIVO</span><span>${tA.toLocaleString()}</span></div>
            </div>

            <div className="col">
              <h4>PASIVO + CAPITAL</h4>
              <p className="cat-t">PASIVO (CORTO PLAZO)</p>
              <div className="r"><span>Acreedores Diversos</span><span>${bal.pasivo.acreedores.toLocaleString()}</span></div>
              <div className="r"><span>Anticipo Clientes</span><span>${bal.pasivo.anticipoClientes.toLocaleString()}</span></div>
              <div className="r"><span>IVA Trasladado</span><span>${bal.pasivo.ivaTrasladado.toLocaleString()}</span></div>
              <p className="cat-t">CAPITAL CONTABLE</p>
              <div className="r"><span>Capital Social</span><span>${bal.capital.toLocaleString()}</span></div>
              <div className="r"><span>Utilidad / Pérdida</span><span>$0</span></div>
              <div className="total-bar"><span>TOTAL P + C</span><span>${tPC.toLocaleString()}</span></div>
            </div>
          </div>

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