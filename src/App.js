import React, { useState } from 'react';
import { catalogoInicial } from './data/cuentas';
import ArqueoCaja from './components/ArqueoCaja';
import './styles/global.css';

const ChatNIF = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy MayiBot, tu consultor NIF. ¿Quieres saber qué son las NIF o alguna en específico?", type: 'bot' }
  ]);
  const [input, setInput] = useState("");

  const baseConocimiento = {
    "nif": "Las **NIF (Normas de Información Financiera)** son el conjunto de lineamientos que regulan la elaboración de los estados financieros. \n\nSu objetivo es que la información sea:\n✅ Transparente\n✅ Comparable\n✅ Confiable\n\n📌 Ejemplo: Sin las NIF, cada contador registraría como quisiera. Las NIF nos obligan a usar el mismo método en la Cocina Mayi.",
    "que es una nif": "Es una regla técnica que nos dice cómo 'traducir' los eventos de tu negocio a números claros en el Balance General y Estado de Resultados.",
    "nif c-1": "La **NIF C-1 (Efectivo y Equivalentes)** regula cómo registramos el dinero disponible. \n\n📖 Relación con tu proyecto: Es la norma que justifica las cuentas de 'Bancos' y 'Caja Chica'. Establece que el Arqueo es vital para el control interno.",
    "nif a-3": "La **NIF A-3 (Necesidades de los usuarios)** explica que los estados financieros deben ser útiles para quienes los leen.",
    "nif b-3": "La **NIF B-3 (Estado de Resultado Integral)** es la que da la estructura para tu reporte: Ingresos, menos Costos, menos Gastos, igual a Utilidad Neta.",
    "arqueo": "El arqueo es una técnica de control basada en la **NIF C-1**. Consiste en contar el efectivo físico para asegurar que coincida con lo registrado en libros.",
    "importancia": "Las NIF dan validez legal y profesional. Un estado financiero que no sigue las NIF no es válido para el SAT ni para los bancos."
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { text: input, type: 'user' };
    setMessages([...messages, userMsg]);
    
    const query = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let botResponse = "No tengo esa NIF exacta, pero puedo explicarte la NIF C-1 (Efectivo) o la NIF A-3 (Objetivos).";
    
    Object.keys(baseConocimiento).forEach(key => {
      if (query.includes(key)) botResponse = baseConocimiento[key];
    });

    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, type: 'bot' }]);
    }, 600);
    setInput("");
  };

  return (
    <>
      <button className={`chat-trigger no-print ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕ Cerrar" : "💡 Consultar NIF"}
      </button>
      
      <div className={`side-panel ${isOpen ? 'open' : ''} no-print`}>
        <div className="panel-header">
          <h3>MayiBot <span className="ai-tag">NIF Expert</span></h3>
          <span>Consultor Contable v2.0</span>
        </div>
        <div className="panel-body">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.type}`} style={{whiteSpace: 'pre-wrap'}}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="panel-footer">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ej: ¿Qué es la NIF?..."
          />
          <button onClick={handleSend}>➤</button>
        </div>
      </div>
    </>
  );
};

function App() {
  const [bal, setBal] = useState(catalogoInicial);
  const [f, setF] = useState("13 de marzo de 2026");
  const [input, setInput] = useState({ cuenta: 'bancos', monto: '', tipo: 'cargo' });

  const ver = (actividad) => {
    let n = JSON.parse(JSON.stringify(catalogoInicial));
    if (actividad === 'apertura') {
      setF("23 de enero de 2026");
    } else if (actividad === 'ajustes_feb') {
      setF("04 de febrero de 2026");
      n.activo.bancos = 6160; n.pasivo.anticipoClientes = 4000;
    } else if (actividad === 'marzo_inv') {
      setF("10 de marzo de 2026");
      n.activo.bancos = 15912; n.activo.inventarios = 4036; n.activo.ivaAcred = 14440;
    } else if (actividad === 'cierre_marzo') {
      setF("13 de marzo de 2026");
      n.activo.bancos = 15912; n.activo.edificios = 796666.67; 
      n.pasivo.acreedores = 16340; n.pasivo.ivaTrasladado = 2458.97;
    } else if (actividad === 'caja_chica') {
      setF("17 de abril de 2026");
      n.activo.cajaChica = 20000;
      n.activo.bancos = 15912 - 20000 - 4060; 
      n.activo.ivaAcred = 14440 + 560;
      n.activo.edificios = 796666.67;
      n.pasivo.acreedores = 16340;
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

  const ingresos = 11300;
  const costos = 5000;
  const gastos = f.includes("abril") ? 2611.55 + 3500 : 2611.55; 
  const utilidadNeta = ingresos - costos - gastos;

  const tA = Object.values(bal.activo).reduce((a, b) => a + (Number(b) || 0), 0);
  const tPC = Object.values(bal.pasivo).reduce((a, b) => a + (Number(b) || 0), 0) + (Number(bal.capital) || 0) + utilidadNeta;

  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <h2 className="brand">SISTEMA MAYI 2026</h2>
        <div className="menu-group">
          <p className="entry-title">LÍNEA DE TIEMPO</p>
          <button onClick={() => ver('apertura')}>1. Apertura (Ene)</button>
          <button onClick={() => ver('ajustes_feb')}>2. Ajustes (Feb)</button>
          <button onClick={() => ver('marzo_inv')}>3. Ajuste Inv. (Mar)</button>
          <button onClick={() => ver('cierre_marzo')}>4. Cierre Final (13 Mar)</button>
          <button onClick={() => ver('caja_chica')} style={{background: '#3B82F6'}}>5. Caja Chica (17 Abr)</button>
        </div>

        <form className="data-entry" onSubmit={procesarEntrada}>
          <p className="entry-title">NUEVO MOVIMIENTO</p>
          <select value={input.cuenta} onChange={(e) => setInput({...input, cuenta: e.target.value})}>
            <option value="bancos">Bancos</option>
            <option value="cajaChica">Caja Chica</option>
            <option value="inventarios">Inventarios</option>
          </select>
          <input type="number" placeholder="Monto $" value={input.monto} onChange={(e) => setInput({...input, monto: e.target.value})} />
          <div className="btn-group">
            <button type="button" onClick={() => setInput({...input, tipo: 'cargo'})} className={input.tipo === 'cargo' ? 'active' : ''}>Cargo</button>
            <button type="button" onClick={() => setInput({...input, tipo: 'abono'})} className={input.tipo === 'abono' ? 'active' : ''}>Abono</button>
          </div>
          <button type="submit" className="btn-save">Registrar</button>
        </form>
        <button className="btn-pdf" onClick={() => window.print()}>GENERAR REPORTE</button>
      </aside>

      <main className="main-content">
        <div className="paper">
          <header className="header-report">
            <h1>COCINA ECONÓMICA MAYI</h1>
            <div className="badge-fintech">SISTEMA DE INTELIGENCIA CONTABLE</div>
            <p className="date-display">Periodo: {f}</p>
          </header>

          <section className="results-box">
            <h4 className="section-h">ESTADO DE RESULTADOS</h4>
            <div className="r"><span>Ventas</span><span>${ingresos.toLocaleString()}</span></div>
            <div className="r"><span>(-) Costo de Ventas</span><span>(${costos.toLocaleString()})</span></div>
            <div className="r highlight"><span>Utilidad Bruta</span><span>${(ingresos - costos).toLocaleString()}</span></div>
            <div className="r"><span>(-) Gastos Operativos</span><span>(${gastos.toLocaleString()})</span></div>
            <div className="total-bar" style={{borderLeftColor: 'var(--success)'}}><span>UTILIDAD NETA</span><span>${utilidadNeta.toLocaleString()}</span></div>
          </section>

          <div className="divider"></div>

          <section className="balance-section">
            <h4 className="section-h">BALANCE GENERAL</h4>
            <div className="grid-balance">
              <div className="col">
                <p className="cat-t">ACTIVO</p>
                <div className="r"><span>Bancos</span><span>${bal.activo.bancos.toLocaleString()}</span></div>
                {bal.activo.cajaChica > 0 && <div className="r"><span>Caja Chica</span><span>${bal.activo.cajaChica.toLocaleString()}</span></div>}
                <div className="r"><span>Inventarios</span><span>${bal.activo.inventarios.toLocaleString()}</span></div>
                <div className="r"><span>IVA Acreditable</span><span>${bal.activo.ivaAcred.toLocaleString()}</span></div>
                <div className="r"><span>Edificios</span><span>${bal.activo.edificios.toLocaleString()}</span></div>
                <div className="total-bar"><span>TOTAL ACTIVO</span><span>${tA.toLocaleString()}</span></div>
              </div>
              <div className="col">
                <p className="cat-t">PASIVO Y CAPITAL</p>
                <div className="r"><span>Acreedores</span><span>${bal.pasivo.acreedores.toLocaleString()}</span></div>
                <div className="r"><span>Capital Social</span><span>${bal.capital.toLocaleString()}</span></div>
                <div className="r highlight"><span>Utilidad</span><span>${utilidadNeta.toLocaleString()}</span></div>
                <div className="total-bar"><span>TOTAL P+C</span><span>${tPC.toLocaleString()}</span></div>
              </div>
            </div>
          </section>

          <div className="divider" style={{ borderTop: '2px solid #334155', margin: '4rem 0' }}></div>

          {/* AQUÍ SE INYECTA TU NUEVO COMPONENTE DE ARQUEO */}
          <ArqueoCaja />

          <footer className="sigs">
              <div><div className="line"></div><strong>Mauricio Alexander G. D.</strong><br/>ELABORÓ</div>
              <div><div className="line"></div><strong>Profa. Gonzalez Zuñiga Nuria</strong><br/>AUTORIZÓ</div>
          </footer>
        </div>
      </main>
      <ChatNIF />
    </div>
  );
}

export default App;