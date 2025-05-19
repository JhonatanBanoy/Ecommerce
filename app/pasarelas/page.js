"use client"
import {useState, useEffect} from "react"
import Script from "next/script"


export default function PasarelasPago() {
  const [isClient, setIsclient] = useState(false);
  const [showPaypal, setSowPaypal] = useState(false);
  const [showPayU, setShowPayU] = useState(false);
  const [payUMessage, setPayUMessage] = useState("");
  const [payUMethod, setPayUMethod] = useState("");

  // Métodos y bancos simulados
  const bancosColombia = [
    "Bancolombia",
    "Banco de Bogotá",
    "Davivienda",
    "Banco Popular",
    "Banco de Occidente",
    "Banco AV Villas",
    "Banco Caja Social",
    "Banco Agrario",
    "Banco Falabella",
    "Banco Itaú"
  ];

  useEffect(()=>{
    // indicancion que el ocmponente se esta ejecuntando
    setIsclient(true);
  }, []);
  // La llaves vacias indidca que solo se ejecuta una vez al cargar el componente

  // Renderizar el script de Paypal solo si el cliente es verdadero
  useEffect(()=>{
    if(showPaypal && typeof window !== "undefine" && window.paypal){
      // Renderizar ñps botones de Paypal
      window.paypal.Buttons({
        createOrder: function(data, actions){
          //Crear la orden de Paypal
          return actions.order.create({
            purchase_units: [
              {
                // Monto por pagar/defecto
                amount: {
                  value: "10.00", // Precio
                },
              },
            ],
          });
        },

        onApprove: function(data, actions){
          // Manejar la aprobacin de la orden
          return actions.order.capture().then(function(details){
            const message = `¡Pago aprobado! Gracias ${details.payer.name.given_name} por su compra. `
            document.getElementById("result-message").innerText = message;
            alert(message)
          });
        },
        // Manejar el error
        onError: function(err){
          console.error("Error en Paypal:", err);
          alert("Error en Paypal");
        },






      }).render("#paypal-button-container");
    }
  }, [showPaypal]); // Se ejecuta cada vez que cambia el estado de showPaypal
  if(!isClient){
    // Evita renderizar el componente en el servidor
    return null;
  }
  // Estructura del componente HTML
  return(
    <div>
      <Script 
      src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD"
      strategy="afterInteractive"
      />
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        {!showPaypal && !showPayU && (
          <>
            <button onClick={() => setSowPaypal(true)} style={{ background: "#0070ba", color: "#fff", padding: 8, borderRadius: 4, border: "none" }}>
              Pagar con Paypal
            </button>
            <button onClick={() => setShowPayU(true)} style={{ background: "#6cc24a", color: "#fff", padding: 8, borderRadius: 4, border: "none" }}>
              Pagar con PayU
            </button>
          </>
        )}
      </div>

      {showPaypal && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <div id="paypal-button-container" />
          <p id="result-message" style={{ marginTop: 16, color: "green" }}></p>
          <button onClick={() => setSowPaypal(false)} style={{ marginTop: 16, color: "#0070ba", background: "none", border: "none" }}>
            Volver a las pasarelas
          </button>
        </div>
      )}
      {showPayU && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <div>
            <select value={payUMethod} onChange={e => { setPayUMethod(e.target.value); setPayUMessage(""); }}>
              <option value="">-- Selecciona método --</option>
              <option value="pse">Débito bancario (PSE)</option>
              <option value="bancos">Pago en bancos de Colombia</option>
              <option value="tarjeta">Tarjeta de crédito/débito</option>
              <option value="factura">Pago con factura PayU América</option>
            </select>
          </div>
          {/* Formulario según método */}
          {!payUMessage && payUMethod === 'pse' && (
            <form onSubmit={e => {e.preventDefault(); setPayUMessage('¡Pago aprobado! Gracias por su compra con PayU usando Débito bancario (PSE).')}}>
              <input required placeholder="Nombre completo" style={{ margin: 8 }} />
              <select className="border rounded p-2 text-sm" required defaultValue="">
                <option value="" disabled>Selecciona tu banco</option>
                {bancosColombia.map(b => <option key={b}>{b}</option>)}
              </select>
              <input className="border rounded p-2 text-sm" required placeholder="Cédula" />
              <button type="submit" style={{ background: "#6cc24a", color: "#fff", padding: 8, borderRadius: 4, border: "none" }}>
                Pagar ahora
              </button>
            </form>
          )}
          {!payUMessage && payUMethod === 'tarjeta' && (
            <form onSubmit={e => {e.preventDefault(); setPayUMessage('¡Pago aprobado! Gracias por su compra con PayU usando Tarjeta de crédito/débito.')}}>
              <input required placeholder="Nombre en la tarjeta" style={{ margin: 8 }} />
              <input required placeholder="Número de tarjeta" maxLength={16} style={{ margin: 8 }} />
              <div className="flex gap-2 w-full">
                <input className="border rounded p-2 text-sm w-1/2" required placeholder="MM/AA" maxLength={5} style={{ margin: 8 }} />
                <input className="border rounded p-2 text-sm w-1/2" required placeholder="CVV" maxLength={4} style={{ margin: 8 }} />
              </div>
              <button type="submit" style={{ background: "#6cc24a", color: "#fff", padding: 8, borderRadius: 4, border: "none" }}>
                Pagar ahora
              </button>
            </form>
          )}
          {!payUMessage && payUMethod === 'bancos' && (
            <form onSubmit={e => {e.preventDefault(); setPayUMessage('¡Pago aprobado! Gracias por su compra con PayU usando Pago en bancos de Colombia.')}}>
              <input required placeholder="Nombre completo" style={{ margin: 8 }} />
              <select className="border rounded p-2 text-sm" required defaultValue="">
                <option value="" disabled>Selecciona tu banco</option>
                {bancosColombia.map(b => <option key={b}>{b}</option>)}
              </select>
              <button type="submit" style={{ background: "#6cc24a", color: "#fff", padding: 8, borderRadius: 4, border: "none" }}>
                Pagar ahora
              </button>
            </form>
          )}
          {!payUMessage && payUMethod === 'factura' && (
            <form onSubmit={e => {e.preventDefault(); setPayUMessage('¡Pago aprobado! Gracias por su compra con PayU usando Factura PayU América.')}}>
              <input required placeholder="Nombre completo" style={{ margin: 8 }} />
              <input required placeholder="Número de factura" style={{ margin: 8 }} />
              <button type="submit" style={{ background: "#6cc24a", color: "#fff", padding: 8, borderRadius: 4, border: "none" }}>
                Pagar ahora
              </button>
            </form>
          )}
          {payUMessage && (
            <div style={{ color: "green", marginTop: 16 }}>{payUMessage}</div>
          )}
          <button onClick={() => { setShowPayU(false); setPayUMessage(""); setPayUMethod(""); }} style={{ marginTop: 16, color: "#6cc24a", background: "none", border: "none" }}>
            Volver a las pasarelas
          </button>
        </div>
      )}
    </div>
  );
}