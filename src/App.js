import React, { useState } from "react";

const API_BASE_URL = "http://localhost:5000"; // backend Flask

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); // 🔹 login vs registrazione
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // messaggi di successo / info
  const [loading, setLoading] = useState(false);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // manda e riceve i cookie JWT
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Errore di login");
        setLoading(false);
        return;
      }

      // cookie JWT impostato dal backend
      setIsLoggedIn(true);
      setInfo("Login eseguito con successo.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Errore di rete durante il login");
    } finally {
      setLoading(false);
    }
  };

  // REGISTRAZIONE
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Errore di registrazione");
        setLoading(false);
        return;
      }

      // Registrazione ok → torno alla schermata di login
      setInfo("Registrazione completata! Ora effettua il login.");
      setIsRegisterMode(false);
      setPassword(""); // opzionale: svuota la password
      setError("");
    } catch (err) {
      console.error(err);
      setError("Errore di rete durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        credentials: "include", // manda i cookie al backend
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Errore nel recupero dati utente");
        setMe(null);
        setLoading(false);
        return;
      }

      setMe(data);
    } catch (err) {
      console.error(err);
      setError("Errore di rete durante il caricamento dei dati");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include", // permette al backend di cancellare il cookie
      });

      await res.json(); // non indispensabile

      setIsLoggedIn(false);
      setMe(null);
      setInfo("Logout effettuato.");
    } catch (err) {
      console.error(err);
      setError("Errore durante il logout");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    // cambio vista login <-> registrazione
    setError("");
    setInfo("");
    setIsRegisterMode((prev) => !prev);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "40px 16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        justifyContent: "center",
        background: "#f5f5f7",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "24px 24px 32px",
          boxShadow: "0 20px 35px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>MyWallet Collectable</h1>
        <p style={{ marginTop: 0, marginBottom: "24px", color: "#555" }}>
          Monitora l'andamento delle tue collezioni!
        </p>

        {/* FORM LOGIN / REGISTRAZIONE */}
        {!isLoggedIn && (
          <>
            <form
              onSubmit={isRegisterMode ? handleRegister : handleLogin}
              style={{ marginBottom: "16px" }}
            >
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  autoComplete="username"
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  autoComplete={
                    isRegisterMode ? "new-password" : "current-password"
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: isRegisterMode ? "#16a34a" : "#2563eb",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? isRegisterMode
                    ? "Registrazione..."
                    : "Accesso in corso..."
                  : isRegisterMode
                  ? "Registrati"
                  : "Accedi"}
              </button>
            </form>

            {/* Switch login / registrazione */}
            <div style={{ marginBottom: "16px", fontSize: "13px" }}>
              {isRegisterMode ? (
                <span>
                  Hai già un account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "13px",
                    }}
                  >
                    Vai al login
                  </button>
                </span>
              ) : (
                <span>
                  Non hai un account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#16a34a",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "13px",
                    }}
                  >
                    Registrati
                  </button>
                </span>
              )}
            </div>
          </>
        )}

        {/* SE LOGGATO */}
        {isLoggedIn && (
          <div
            style={{
              padding: "12px 12px 16px",
              borderRadius: "10px",
              border: "1px solid #e5e5e5",
              marginBottom: "16px",
              background: "#f9fafb",
            }}
          >
            <p style={{ margin: "0 0 8px", fontSize: "14px" }}>
              ✅ Cookie JWT impostato. Sei loggato.
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button
                onClick={handleGetMe}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#22c55e",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                Carica dati utente
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* MESSAGGI INFO */}
        {info && (
          <div
            style={{
              marginTop: "8px",
              marginBottom: "4px",
              padding: "8px 10px",
              borderRadius: "8px",
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: "13px",
            }}
          >
            {info}
          </div>
        )}

        {/* ERRORI */}
        {error && (
          <div
            style={{
              marginTop: "4px",
              marginBottom: "8px",
              padding: "8px 10px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#b91c1c",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* DATI UTENTE */}
        {me && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "white",
            }}
          >
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "16px",
              }}
            >
              Dati utente
            </h2>
            <p style={{ margin: "0 0 4px", fontSize: "14px" }}>
              <strong>ID:</strong> {me.id}
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              <strong>Username:</strong> {me.username}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
