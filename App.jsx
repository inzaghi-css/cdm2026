import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// ─── FIREBASE CONFIG ──────────────────────────────────────────────────────────
const firebaseConfig = {
  databaseURL: "https://cdm2026-81be4-default-rtdb.firebaseio.com",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ─── HELPERS DB ───────────────────────────────────────────────────────────────
const dbGet = async (path) => {
  const snap = await get(ref(db, path));
  return snap.exists() ? snap.val() : null;
};
const dbSet = async (path, val) => {
  await set(ref(db, path), val);
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const GROUPS = {
  A: ["Qatar", "Ecuador", "Sénégal", "Pays-Bas"],
  B: ["Angleterre", "Iran", "USA", "Pays de Galles"],
  C: ["Argentine", "Arabie Saoudite", "Mexique", "Pologne"],
  D: ["France", "Australie", "Danemark", "Tunisie"],
  E: ["Espagne", "Costa Rica", "Allemagne", "Japon"],
  F: ["Belgique", "Canada", "Maroc", "Croatie"],
  G: ["Brésil", "Serbie", "Suisse", "Cameroun"],
  H: ["Portugal", "Ghana", "Uruguay", "Corée du Sud"],
};

const FLAGS = {
  Qatar: "🇶🇦", Ecuador: "🇪🇨", Sénégal: "🇸🇳", "Pays-Bas": "🇳🇱",
  Angleterre: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Iran: "🇮🇷", USA: "🇺🇸", "Pays de Galles": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  Argentine: "🇦🇷", "Arabie Saoudite": "🇸🇦", Mexique: "🇲🇽", Pologne: "🇵🇱",
  France: "🇫🇷", Australie: "🇦🇺", Danemark: "🇩🇰", Tunisie: "🇹🇳",
  Espagne: "🇪🇸", "Costa Rica": "🇨🇷", Allemagne: "🇩🇪", Japon: "🇯🇵",
  Belgique: "🇧🇪", Canada: "🇨🇦", Maroc: "🇲🇦", Croatie: "🇭🇷",
  Brésil: "🇧🇷", Serbie: "🇷🇸", Suisse: "🇨🇭", Cameroun: "🇨🇲",
  Portugal: "🇵🇹", Ghana: "🇬🇭", Uruguay: "🇺🇾", "Corée du Sud": "🇰🇷",
};

const MATCHES = [
  { id: 1, group: "A", home: "Qatar", away: "Ecuador", date: "Nov 20" },
  { id: 2, group: "A", home: "Sénégal", away: "Pays-Bas", date: "Nov 21" },
  { id: 3, group: "B", home: "Angleterre", away: "Iran", date: "Nov 21" },
  { id: 4, group: "B", home: "USA", away: "Pays de Galles", date: "Nov 21" },
  { id: 5, group: "C", home: "Argentine", away: "Arabie Saoudite", date: "Nov 22" },
  { id: 6, group: "C", home: "Mexique", away: "Pologne", date: "Nov 22" },
  { id: 7, group: "D", home: "France", away: "Australie", date: "Nov 22" },
  { id: 8, group: "D", home: "Danemark", away: "Tunisie", date: "Nov 22" },
  { id: 9, group: "E", home: "Espagne", away: "Costa Rica", date: "Nov 23" },
  { id: 10, group: "E", home: "Allemagne", away: "Japon", date: "Nov 23" },
  { id: 11, group: "F", home: "Belgique", away: "Canada", date: "Nov 23" },
  { id: 12, group: "F", home: "Maroc", away: "Croatie", date: "Nov 23" },
  { id: 13, group: "G", home: "Brésil", away: "Serbie", date: "Nov 24" },
  { id: 14, group: "G", home: "Suisse", away: "Cameroun", date: "Nov 24" },
  { id: 15, group: "H", home: "Portugal", away: "Ghana", date: "Nov 24" },
  { id: 16, group: "H", home: "Uruguay", away: "Corée du Sud", date: "Nov 24" },
  { id: 17, group: "A", home: "Qatar", away: "Sénégal", date: "Nov 25" },
  { id: 18, group: "A", home: "Pays-Bas", away: "Ecuador", date: "Nov 25" },
  { id: 19, group: "B", home: "Pays de Galles", away: "Iran", date: "Nov 25" },
  { id: 20, group: "B", home: "Angleterre", away: "USA", date: "Nov 25" },
  { id: 21, group: "C", home: "Pologne", away: "Arabie Saoudite", date: "Nov 26" },
  { id: 22, group: "C", home: "Argentine", away: "Mexique", date: "Nov 26" },
  { id: 23, group: "D", home: "Tunisie", away: "Australie", date: "Nov 26" },
  { id: 24, group: "D", home: "France", away: "Danemark", date: "Nov 26" },
  { id: 25, group: "E", home: "Japon", away: "Costa Rica", date: "Nov 27" },
  { id: 26, group: "E", home: "Espagne", away: "Allemagne", date: "Nov 27" },
  { id: 27, group: "F", home: "Croatie", away: "Canada", date: "Nov 27" },
  { id: 28, group: "F", home: "Belgique", away: "Maroc", date: "Nov 27" },
  { id: 29, group: "G", home: "Cameroun", away: "Serbie", date: "Nov 28" },
  { id: 30, group: "G", home: "Brésil", away: "Suisse", date: "Nov 28" },
  { id: 31, group: "H", home: "Corée du Sud", away: "Ghana", date: "Nov 28" },
  { id: 32, group: "H", home: "Portugal", away: "Uruguay", date: "Nov 28" },
];

// ─── SCORING ──────────────────────────────────────────────────────────────────
function calcPoints(pred, result) {
  if (!pred || !result) return 0;
  const ph = Number(pred.home), pa = Number(pred.away);
  const rh = Number(result.home), ra = Number(result.away);
  if (isNaN(ph) || isNaN(pa) || isNaN(rh) || isNaN(ra)) return 0;
  if (ph === rh && pa === ra) return 3;
  const pr = ph > pa ? "H" : ph < pa ? "A" : "D";
  const rr = rh > ra ? "H" : rh < ra ? "A" : "D";
  return pr === rr ? 1 : 0;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0b1c12", card: "#122218", border: "rgba(255,255,255,0.07)",
  gold: "#f0c040", green: "#22c55e", red: "#ef4444",
  muted: "#4a6355", text: "#e8f5e9", sub: "#7a9c82", accent: "#34d399",
};

const globalCss = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  input { outline: none; }
  input::placeholder { color: #4a6355; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  .fade { animation: fadeIn 0.25s ease; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #1e3a28; border-radius: 4px; }
`;

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
      <div style={{ width: 34, height: 34, border: `3px solid rgba(52,211,153,0.12)`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );
}

function Badge({ children, color = C.accent }) {
  return (
    <span style={{ background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700, color, letterSpacing: 0.4, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function PrimaryBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: "100%", padding: "13px", background: disabled ? "#1e3a28" : "linear-gradient(135deg,#1a6b3a,#0d4f2a)", border: "none", borderRadius: 10, color: disabled ? C.muted : C.text, fontSize: 14, fontWeight: 700, cursor: disabled ? "default" : "pointer", fontFamily: "inherit", boxShadow: disabled ? "none" : "0 4px 18px rgba(34,197,94,0.18)", ...style }}>
      {children}
    </button>
  );
}

function GoldBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: "100%", padding: "14px", background: disabled ? "#1e3a28" : "linear-gradient(135deg,#b8860b,#f0c040)", border: "none", borderRadius: 10, color: disabled ? C.muted : "#0b1c12", fontSize: 14, fontWeight: 800, cursor: disabled ? "default" : "pointer", fontFamily: "inherit" }}>
      {children}
    </button>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError(""); setLoading(true);
    try {
      const users = (await dbGet("users")) || {};
      const key = pseudo.trim().toLowerCase();
      if (!key || !password.trim()) { setError("Remplis tous les champs."); setLoading(false); return; }

      if (mode === "register") {
        if (key.length < 2) { setError("Pseudo trop court (min 2 caractères)."); setLoading(false); return; }
        if (users[key]) { setError("Ce pseudo est déjà pris !"); setLoading(false); return; }
        await dbSet(`users/${key}`, { pseudo: pseudo.trim(), password, createdAt: Date.now() });
        onLogin({ pseudo: pseudo.trim() });
      } else {
        const u = users[key];
        if (!u || u.password !== password) { setError("Pseudo ou mot de passe incorrect."); setLoading(false); return; }
        onLogin({ pseudo: u.pseudo });
      }
    } catch (e) {
      setError("Erreur de connexion. Vérifie ta connexion internet.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui,sans-serif" }}>
      <style>{globalCss}</style>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 60, marginBottom: 6 }}>🏆</div>
        <div style={{ fontSize: 10, letterSpacing: 5, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>FIFA</div>
        <h1 style={{ color: C.text, fontSize: 30, fontWeight: 900, letterSpacing: -1, marginBottom: 2 }}>Coupe du Monde</h1>
        <div style={{ color: C.gold, fontSize: 20, fontWeight: 800, letterSpacing: 3 }}>2026</div>
        <p style={{ color: C.sub, fontSize: 13, marginTop: 10 }}>Pronostique · Compare · Gagne avec tes amis</p>
      </div>

      <div style={{ width: "100%", maxWidth: 380, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 3, marginBottom: 22 }}>
          {[["login", "Connexion"], ["register", "Créer un compte"]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, padding: "9px 4px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", transition: "all 0.2s", background: mode === m ? C.card : "transparent", color: mode === m ? C.accent : C.muted, boxShadow: mode === m ? "0 1px 6px rgba(0,0,0,0.4)" : "none" }}>
              {label}
            </button>
          ))}
        </div>

        {[["Pseudo", "Ton pseudo unique", pseudo, setPseudo, "text"], ["Mot de passe", "••••••••", password, setPassword, "password"]].map(([label, ph, val, set, type]) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", color: C.sub, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{label}</label>
            <input type={type} value={val} placeholder={ph} onChange={e => set(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()}
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", color: C.text, fontSize: 14, fontFamily: "inherit" }} />
          </div>
        ))}

        {error && (
          <div style={{ color: "#fca5a5", fontSize: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>{error}</div>
        )}

        <PrimaryBtn onClick={handle} disabled={loading}>
          {loading ? "Connexion..." : mode === "login" ? "Se connecter →" : "Créer mon compte →"}
        </PrimaryBtn>

        <p style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
          🔗 Partage l'URL de cette page à tes amis pour jouer ensemble !
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function AppMain({ user, onLogout }) {
  const [tab, setTab] = useState("pronostics");
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("all");

  const isAdmin = user.pseudo.toLowerCase() === "admin";

  useEffect(() => {
    const unsubs = [];
    const listen = (path, setter) => {
      const r = ref(db, path);
      const unsub = onValue(r, snap => setter(snap.exists() ? snap.val() : {}));
      unsubs.push(unsub);
    };
    listen("predictions", setPredictions);
    listen("results", setResults);
    listen("users", setUsers);
    setLoading(false);
    return () => unsubs.forEach(u
