import { useState, useEffect, useRef } from "react";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg:        "#0A0D14",
  surface:   "#111520",
  card:      "#161B2A",
  border:    "#1E2640",
  accent:    "#E8A045",
  accentSoft:"#E8A04520",
  teal:      "#2DD4BF",
  tealSoft:  "#2DD4BF15",
  red:       "#F25C5C",
  green:     "#4ADE80",
  muted:     "#4A5270",
  text:      "#DDE2F0",
  textDim:   "#7A82A0",
};

const SEED_PROPERTIES = [
  { id: 1, name: "Gulberg III – Studio", type: "Studio", city: "Lahore", platform: ["Airbnb","Booking.com"] },
  { id: 2, name: "DHA Phase 5 – 1BHK",  type: "1BHK",   city: "Lahore", platform: ["Airbnb"] },
  { id: 3, name: "Johar Town – 2BHK",   type: "2BHK",   city: "Lahore", platform: ["Booking.com"] },
];

const SEED_BOOKINGS = [
  { id: 1, propId:1, guest:"Ahmed Raza",     phone:"+923001234567", email:"ahmed@gmail.com",    checkIn:"2026-05-01", checkOut:"2026-05-05", platform:"Airbnb",      revenue:18500, status:"checked-out", notes:"Repeat guest" },
  { id: 2, propId:2, guest:"Sara Khan",      phone:"+923215678901", email:"sara@hotmail.com",   checkIn:"2026-05-10", checkOut:"2026-05-14", platform:"Airbnb",      revenue:22000, status:"checked-out", notes:"" },
  { id: 3, propId:3, guest:"James Lim",      phone:"+60112345678",  email:"james@yahoo.com",    checkIn:"2026-05-18", checkOut:"2026-05-22", platform:"Booking.com", revenue:27000, status:"checked-out", notes:"International guest" },
  { id: 4, propId:1, guest:"Usman Tariq",    phone:"+923331122334", email:"usman@gmail.com",    checkIn:"2026-05-24", checkOut:"2026-05-27", platform:"Airbnb",      revenue:14500, status:"active",      notes:"Late checkout requested" },
  { id: 5, propId:2, guest:"Nadia Siddiqui", phone:"+923459876543", email:"nadia@gmail.com",    checkIn:"2026-06-01", checkOut:"2026-06-05", platform:"Booking.com", revenue:21000, status:"upcoming",    notes:"" },
  { id: 6, propId:3, guest:"Michael Brown",  phone:"+12125550100",  email:"mbrown@icloud.com",  checkIn:"2026-06-08", checkOut:"2026-06-12", platform:"Airbnb",      revenue:29000, status:"upcoming",    notes:"Corporate traveller" },
];

const SEED_EXPENSES = [
  { id: 1, propId:1, category:"Utilities",    desc:"LESCO electricity",   date:"2026-05-01", amount:4200 },
  { id: 2, propId:1, category:"Maintenance",  desc:"AC service",          date:"2026-05-08", amount:3500 },
  { id: 3, propId:2, category:"Utilities",    desc:"SNGPL gas bill",      date:"2026-05-03", amount:1800 },
  { id: 4, propId:2, category:"Supplies",     desc:"Toiletries & towels", date:"2026-05-12", amount:2600 },
  { id: 5, propId:3, category:"Maintenance",  desc:"Plumbing repair",     date:"2026-05-15", amount:5000 },
  { id: 6, propId:3, category:"Cleaning",     desc:"Deep clean",          date:"2026-05-20", amount:3000 },
  { id: 7, propId:1, category:"Platform Fee", desc:"Airbnb host fee 3%",  date:"2026-05-27", amount:435  },
  { id: 8, propId:2, category:"Internet",     desc:"PTCL broadband",      date:"2026-05-05", amount:2500 },
];

const fmt  = n => "PKR " + Number(n).toLocaleString("en-PK");
const today = new Date().toISOString().split("T")[0];
const statusColor = s => s==="active" ? C.green : s==="upcoming" ? C.accent : C.muted;
const statusBg    = s => s==="active" ? "#4ADE8018" : s==="upcoming" ? C.accentSoft : "#FFFFFF08";
const glassCard   = { background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20 };

// ─── localStorage persistence ─────────────────────────────────────────────────
function usePersist(key, seed) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : seed; }
    catch { return seed; }
  });
  const set = v => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab]           = useState("dashboard");
  const [bookings, setBookings] = usePersist("pos_bookings", SEED_BOOKINGS);
  const [expenses, setExpenses] = usePersist("pos_expenses", SEED_EXPENSES);
  const [properties]            = usePersist("pos_props",    SEED_PROPERTIES);

  const totalRevenue  = bookings.reduce((s,b) => s+b.revenue, 0);
  const totalExpenses = expenses.reduce((s,e) => s+e.amount, 0);
  const netProfit     = totalRevenue - totalExpenses;
  const activeCount   = bookings.filter(b => b.status==="active").length;
  const upcomingCount = bookings.filter(b => b.status==="upcoming").length;

  const tabs = [
    { id:"dashboard", icon:"◈", label:"Home"    },
    { id:"bookings",  icon:"⊞", label:"Bookings"},
    { id:"expenses",  icon:"◎", label:"Expenses"},
    { id:"guests",    icon:"◉", label:"Guests"  },
    { id:"ai",        icon:"⬡", label:"AI"      },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.text, overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overscroll-behavior: none; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        input, select, textarea { outline: none; font-family: inherit; -webkit-appearance: none; }
        button { -webkit-tap-highlight-color: transparent; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
        .fade-up { animation: fadeUp .3s ease both; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        .pulse { animation: pulse 1.8s infinite; }
        .tab-item:active { opacity: .7; }
        .card-press:active { transform: scale(0.98); }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"env(safe-area-inset-top,12px) 20px 12px", background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:3, color:C.accent, fontFamily:"'Space Mono',monospace" }}>LAHORE</div>
          <div style={{ fontSize:17, fontWeight:700, lineHeight:1.1 }}>PropertyOS</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:C.textDim }}>Net Profit</div>
          <div style={{ fontSize:15, fontWeight:700, color: netProfit>=0 ? C.green : C.red, fontFamily:"'Space Mono',monospace" }}>
            {fmt(netProfit)}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main style={{ flex:1, overflowY:"auto", overflowX:"hidden", WebkitOverflowScrolling:"touch" }}>
        <div style={{ padding:"20px 16px 100px" }}>
          {tab==="dashboard" && <Dashboard bookings={bookings} expenses={expenses} properties={properties} totalRevenue={totalRevenue} totalExpenses={totalExpenses} netProfit={netProfit} activeCount={activeCount} upcomingCount={upcomingCount} />}
          {tab==="bookings"  && <Bookings  bookings={bookings} setBookings={setBookings} properties={properties} />}
          {tab==="expenses"  && <Expenses  expenses={expenses} setExpenses={setExpenses} properties={properties} />}
          {tab==="guests"    && <GuestCRM  bookings={bookings} />}
          {tab==="ai"        && <AIAssistant bookings={bookings} expenses={expenses} properties={properties} />}
        </div>
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{ position:"fixed", bottom:0, left:0, right:0, display:"flex", background:C.surface, borderTop:`1px solid ${C.border}`, paddingBottom:"env(safe-area-inset-bottom,0px)", zIndex:100 }}>
        {tabs.map(t => (
          <button key={t.id} className="tab-item" onClick={()=>setTab(t.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 4px", background:"transparent", border:"none", color: tab===t.id ? C.accent : C.muted, cursor:"pointer", transition:"color .15s" }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            <span style={{ fontSize:9, fontWeight:600, letterSpacing:.5 }}>{t.label.toUpperCase()}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({ bookings, expenses, properties, totalRevenue, totalExpenses, netProfit, activeCount, upcomingCount }) {
  const occupancy = Math.round((bookings.filter(b=>b.status!=="upcoming").length / Math.max(properties.length * 4, 1)) * 100);
  const airbnbRev = bookings.filter(b=>b.platform==="Airbnb").reduce((s,b)=>s+b.revenue,0);
  const bcomRev   = bookings.filter(b=>b.platform==="Booking.com").reduce((s,b)=>s+b.revenue,0);

  const kpis = [
    { label:"Revenue",    value:fmt(totalRevenue),  color:C.teal  },
    { label:"Expenses",   value:fmt(totalExpenses), color:C.red   },
    { label:"Net Profit", value:fmt(netProfit),     color:C.green },
    { label:"Occupancy",  value:occupancy+"%",      color:C.accent},
    { label:"Active",     value:activeCount,        color:C.teal  },
    { label:"Upcoming",   value:upcomingCount,       color:C.accent},
  ];

  const propRevenue = properties.map(p => ({
    name: p.name.split("–")[0].trim(),
    rev: bookings.filter(b=>b.propId===p.id).reduce((s,b)=>s+b.revenue,0),
    exp: expenses.filter(e=>e.propId===p.id).reduce((s,e)=>s+e.amount,0),
  }));
  const maxRev = Math.max(...propRevenue.map(p=>p.rev), 1);

  const catMap = {};
  expenses.forEach(e=>{ catMap[e.category]=(catMap[e.category]||0)+e.amount; });
  const cats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,4);

  return (
    <div className="fade-up">
      <SectionHeader>May 2026 Overview</SectionHeader>

      {/* KPI 2-col grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {kpis.map(k=>(
          <div key={k.label} style={{ ...glassCard, padding:14 }} className="card-press">
            <div style={{ fontSize:10, color:C.textDim, letterSpacing:.8, marginBottom:5 }}>{k.label.toUpperCase()}</div>
            <div style={{ fontSize:17, fontWeight:700, color:k.color, fontFamily:"'Space Mono',monospace", wordBreak:"break-word" }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue by property */}
      <div style={{ ...glassCard, marginBottom:16 }}>
        <MicroTitle>Revenue vs Expenses · by Property</MicroTitle>
        <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:14 }}>
          {propRevenue.map(p=>(
            <div key={p.name}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                <span style={{ color:C.textDim }}>{p.name}</span>
                <span style={{ color:C.teal, fontFamily:"'Space Mono',monospace", fontSize:11 }}>{fmt(p.rev)}</span>
              </div>
              <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden", marginBottom:3 }}>
                <div style={{ height:"100%", width:(p.rev/maxRev*100)+"%", background:C.teal, borderRadius:3 }} />
              </div>
              <div style={{ height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:(p.exp/maxRev*100)+"%", background:C.red, borderRadius:2 }} />
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:16, marginTop:4 }}>
            <LegendDot color={C.teal} label="Revenue" />
            <LegendDot color={C.red}  label="Expenses" />
          </div>
        </div>
      </div>

      {/* Platform + Categories side by side */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        <div style={glassCard}>
          <MicroTitle>Platforms</MicroTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:12 }}>
            {[["Airbnb",airbnbRev,C.accent],["Booking",bcomRev,C.teal]].map(([n,r,c])=>(
              <div key={n}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                  <span style={{ color:C.textDim }}>{n}</span>
                  <span style={{ color:c, fontFamily:"'Space Mono',monospace" }}>{Math.round(r/totalRevenue*100)||0}%</span>
                </div>
                <div style={{ height:4, background:C.border, borderRadius:2 }}>
                  <div style={{ height:"100%", width:(r/totalRevenue*100)+"%", background:c, borderRadius:2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={glassCard}>
          <MicroTitle>Top Costs</MicroTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:12 }}>
            {cats.map(([cat,amt])=>(
              <div key={cat} style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                <span style={{ color:C.textDim, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"55%" }}>{cat}</span>
                <span style={{ color:C.red, fontFamily:"'Space Mono',monospace" }}>{(amt/1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div style={glassCard}>
        <MicroTitle>Recent Bookings</MicroTitle>
        <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:10 }}>
          {bookings.slice(0,4).map(b=>(
            <BookingCard key={b.id} b={b} properties={SEED_PROPERTIES} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════════════════════════════════════════════
function Bookings({ bookings, setBookings, properties }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");

  const filtered = bookings
    .filter(b => filter==="all" || b.status===filter)
    .filter(b => !search || b.guest.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <SectionHeader style={{ marginBottom:0 }}>Bookings</SectionHeader>
        <button onClick={()=>setShowAdd(true)}
          style={{ background:C.accent, color:"#000", border:"none", padding:"8px 16px", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:13 }}>
          + Add
        </button>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search guest…"
        style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:14, marginBottom:12 }} />

      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
        {["all","active","upcoming","checked-out"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:`1px solid ${filter===f?C.accent:C.border}`, background:filter===f?C.accentSoft:"transparent", color:filter===f?C.accent:C.textDim, cursor:"pointer", fontSize:12, fontWeight:500 }}>
            {f.replace("-"," ")}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(b=>(
          <BookingCard key={b.id} b={b} properties={properties} expanded />
        ))}
        {filtered.length===0 && <Empty text="No bookings found" />}
      </div>

      {showAdd && <BookingModal properties={properties} onSave={b=>{ setBookings(prev=>[...prev,{...b,id:Date.now()}]); setShowAdd(false); }} onClose={()=>setShowAdd(false)} />}
    </div>
  );
}

function BookingCard({ b, properties, expanded }) {
  const prop = properties.find(p=>p.id===b.propId);
  return (
    <div style={{ ...glassCard, padding:14 }} className="card-press">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div>
          <div style={{ fontWeight:600, fontSize:14 }}>{b.guest}</div>
          <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>{prop?.name||"—"}</div>
        </div>
        <span style={{ background:statusBg(b.status), color:statusColor(b.status), padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:500, flexShrink:0 }}>
          {b.status.replace("-"," ")}
        </span>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
        <span style={{ color:C.textDim }}>{b.checkIn} → {b.checkOut}</span>
        <span style={{ color:C.teal, fontWeight:700, fontFamily:"'Space Mono',monospace" }}>{fmt(b.revenue)}</span>
      </div>
      {expanded && (
        <div style={{ marginTop:8, paddingTop:8, borderTop:`1px solid ${C.border}30`, display:"flex", gap:8 }}>
          <PlatformBadge p={b.platform} />
          {b.phone && <span style={{ fontSize:11, color:C.textDim }}>{b.phone}</span>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPENSES
// ═══════════════════════════════════════════════════════════════════════════════
function Expenses({ expenses, setExpenses, properties }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter,  setFilter]  = useState("all");
  const cats = [...new Set(expenses.map(e=>e.category))];
  const filtered = expenses.filter(e=>filter==="all"||e.category===filter);
  const total    = filtered.reduce((s,e)=>s+e.amount,0);

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <SectionHeader style={{ marginBottom:0 }}>Expenses</SectionHeader>
        <button onClick={()=>setShowAdd(true)}
          style={{ background:C.accent, color:"#000", border:"none", padding:"8px 16px", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:13 }}>
          + Add
        </button>
      </div>

      <div style={{ ...glassCard, marginBottom:16, padding:14, display:"flex", justifyContent:"space-between" }}>
        <span style={{ color:C.textDim, fontSize:13 }}>Total ({filter})</span>
        <span style={{ color:C.red, fontWeight:700, fontFamily:"'Space Mono',monospace", fontSize:15 }}>{fmt(total)}</span>
      </div>

      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
        {["all",...cats].map(c=>(
          <button key={c} onClick={()=>setFilter(c)}
            style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:`1px solid ${filter===c?C.accent:C.border}`, background:filter===c?C.accentSoft:"transparent", color:filter===c?C.accent:C.textDim, cursor:"pointer", fontSize:12 }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(e=>{
          const prop = properties.find(p=>p.id===e.propId);
          return (
            <div key={e.id} style={{ ...glassCard, padding:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:500, fontSize:14 }}>{e.desc}</div>
                  <div style={{ fontSize:11, color:C.textDim, marginTop:3 }}>{prop?.name||"—"} · {e.date}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:C.red, fontWeight:700, fontFamily:"'Space Mono',monospace", fontSize:14 }}>{fmt(e.amount)}</div>
                  <span style={{ background:C.accentSoft, color:C.accent, padding:"2px 8px", borderRadius:10, fontSize:10, marginTop:3, display:"inline-block" }}>{e.category}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <Empty text="No expenses found" />}
      </div>

      {showAdd && <ExpenseModal properties={properties} onSave={exp=>{ setExpenses(prev=>[...prev,{...exp,id:Date.now()}]); setShowAdd(false); }} onClose={()=>setShowAdd(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GUEST CRM
// ═══════════════════════════════════════════════════════════════════════════════
function GuestCRM({ bookings }) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(null);

  const guestMap = {};
  bookings.forEach(b=>{
    if (!guestMap[b.guest]) guestMap[b.guest] = { name:b.guest, phone:b.phone, email:b.email, platform:b.platform, stays:0, spend:0 };
    guestMap[b.guest].stays++;
    guestMap[b.guest].spend += b.revenue;
  });
  const guests = Object.values(guestMap).filter(g=>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.phone.includes(search)
  );

  const copy = (text, id) => {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(id); setTimeout(()=>setCopied(null),1500);
  };

  const exportCSV = () => {
    const rows = guests.map(g=>`${g.name},${g.phone},${g.email},${g.platform},${g.stays},${g.spend}`);
    const csv  = "Name,Phone,Email,Platform,Stays,Total Spend\n"+rows.join("\n");
    const a    = document.createElement("a");
    a.href     = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "guests-lahore.csv"; a.click();
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <SectionHeader style={{ marginBottom:0 }}>Guest CRM</SectionHeader>
        <button onClick={exportCSV}
          style={{ background:"transparent", border:`1px solid ${C.border}`, color:C.textDim, padding:"7px 14px", borderRadius:10, cursor:"pointer", fontSize:12 }}>
          ↓ CSV
        </button>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or phone…"
        style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:14, marginBottom:16 }} />

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {guests.map((g,i)=>(
          <div key={g.name} style={{ ...glassCard, padding:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:C.accentSoft, border:`1px solid ${C.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:C.accent, flexShrink:0 }}>
                {g.name[0]}
              </div>
              <div>
                <div style={{ fontWeight:600 }}>{g.name}</div>
                <div style={{ fontSize:11, color:C.textDim }}>{g.platform}</div>
              </div>
              {g.stays>1 && (
                <div style={{ marginLeft:"auto", background:"#4ADE8015", border:"1px solid #4ADE8030", borderRadius:8, padding:"3px 8px", fontSize:10, color:C.green }}>⭐ Repeat</div>
              )}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {[["📞",g.phone,`p${i}`],["✉",g.email,`e${i}`]].map(([ic,val,id])=>(
                <div key={id} style={{ display:"flex", alignItems:"center", gap:8, background:C.surface, borderRadius:8, padding:"8px 10px" }}>
                  <span style={{ fontSize:13 }}>{ic}</span>
                  <span style={{ flex:1, fontSize:12, color:C.textDim, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{val}</span>
                  <button onClick={()=>copy(val,id)}
                    style={{ background:"none", border:"none", color:copied===id?C.green:C.muted, cursor:"pointer", fontSize:11, padding:"0 4px", fontFamily:"'Space Mono',monospace" }}>
                    {copied===id?"✓":"copy"}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <div style={{ flex:1, background:C.surface, borderRadius:8, padding:"8px", textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:700, color:C.accent }}>{g.stays}</div>
                <div style={{ fontSize:10, color:C.textDim }}>Stays</div>
              </div>
              <div style={{ flex:2, background:C.surface, borderRadius:8, padding:"8px", textAlign:"center" }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.teal, fontFamily:"'Space Mono',monospace" }}>{fmt(g.spend)}</div>
                <div style={{ fontSize:10, color:C.textDim }}>Total Spend</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════════
function AIAssistant({ bookings, expenses, properties }) {
  const [messages, setMessages] = useState([
    { role:"assistant", text:"Salaam! I'm your PropertyOS AI. I have full access to your bookings, expenses, and guest data. Ask me anything — pricing advice, revenue analysis, guest follow-up messages, or Lahore market tips!" }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior:"smooth" }); },[messages]);

  const systemContext = `You are PropertyOS AI, a smart assistant for a short-term rental host in Lahore, Pakistan with apartments on Airbnb and Booking.com.

PROPERTIES: ${JSON.stringify(properties)}
BOOKINGS: ${JSON.stringify(bookings)}
EXPENSES: ${JSON.stringify(expenses)}
Total Revenue: PKR ${bookings.reduce((s,b)=>s+b.revenue,0).toLocaleString()}
Total Expenses: PKR ${expenses.reduce((s,e)=>s+e.amount,0).toLocaleString()}
Net Profit: PKR ${(bookings.reduce((s,b)=>s+b.revenue,0)-expenses.reduce((s,e)=>s+e.amount,0)).toLocaleString()}

Help with: revenue analysis, Lahore market pricing, guest follow-up messages (for WhatsApp), expense tips, Airbnb/Booking.com optimisation, Pakistani rental tax basics.
Be concise, friendly, and actionable. Use PKR. Light Urdu phrases are fine.`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs = [...messages, { role:"user", text:userMsg }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: systemContext,
          messages: newMsgs.map(m=>({ role:m.role==="assistant"?"assistant":"user", content:m.text })),
        })
      });
      const data = await resp.json();
      const text = data.content?.map(c=>c.text||"").join("") || "Sorry, couldn't get a response.";
      setMessages(prev=>[...prev,{ role:"assistant", text }]);
    } catch {
      setMessages(prev=>[...prev,{ role:"assistant", text:"Connection error. Check your API key in .env file." }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "Which property is most profitable?",
    "Write a WhatsApp re-engagement message",
    "How to rank higher on Airbnb Lahore?",
    "Tips to cut electricity costs?",
    "How to price for Eid holidays?",
  ];

  return (
    <div className="fade-up" style={{ display:"flex", flexDirection:"column", height:"calc(100dvh - 200px)" }}>
      <SectionHeader>AI Assistant</SectionHeader>

      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:12, paddingBottom:12 }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{
              maxWidth:"82%", padding:"10px 14px", fontSize:14, lineHeight:1.6,
              background: m.role==="user" ? C.accent : C.card,
              color: m.role==="user" ? "#000" : C.text,
              border: m.role==="assistant" ? `1px solid ${C.border}` : "none",
              borderRadius: m.role==="user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            }}>
              {m.text.split("\n").map((line,j)=><div key={j}>{line||"\u00a0"}</div>)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex" }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"10px 16px", fontSize:13, color:C.textDim }}>
              <span className="pulse">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length < 3 && (
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8 }}>
          {suggestions.map(s=>(
            <button key={s} onClick={()=>setInput(s)}
              style={{ flexShrink:0, background:C.card, border:`1px solid ${C.border}`, color:C.textDim, padding:"7px 12px", borderRadius:20, cursor:"pointer", fontSize:12 }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ display:"flex", gap:8, background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"10px 12px" }}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder="Ask anything…"
          style={{ flex:1, background:"transparent", border:"none", color:C.text, fontSize:14 }} />
        <button onClick={send} disabled={loading||!input.trim()}
          style={{ background:C.accent, color:"#000", border:"none", padding:"8px 16px", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:13, opacity:(!input.trim()||loading)?0.5:1 }}>
          ↑
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════════════════════
function BookingModal({ properties, onSave, onClose }) {
  const [f, setF] = useState({ propId:1, guest:"", phone:"", email:"", checkIn:today, checkOut:today, platform:"Airbnb", revenue:"", status:"upcoming", notes:"" });
  const upd = k => e => setF(p=>({...p,[k]:e.target.value}));
  return (
    <Modal title="New Booking" onClose={onClose} onSave={()=>{ if(f.guest&&f.revenue) onSave({...f,propId:+f.propId,revenue:+f.revenue}); }}>
      <FRow label="Guest Name"><FInput v={f.guest} onChange={upd("guest")} /></FRow>
      <FRow label="Phone"><FInput v={f.phone} onChange={upd("phone")} /></FRow>
      <FRow label="Email"><FInput v={f.email} onChange={upd("email")} /></FRow>
      <FRow label="Property"><FSelect value={f.propId} onChange={upd("propId")} options={properties.map(p=>({v:p.id,l:p.name}))} /></FRow>
      <FRow label="Platform"><FSelect value={f.platform} onChange={upd("platform")} options={["Airbnb","Booking.com","Direct"].map(x=>({v:x,l:x}))} /></FRow>
      <FRow label="Check-in"><FInput type="date" v={f.checkIn} onChange={upd("checkIn")} /></FRow>
      <FRow label="Check-out"><FInput type="date" v={f.checkOut} onChange={upd("checkOut")} /></FRow>
      <FRow label="Revenue (PKR)"><FInput type="number" v={f.revenue} onChange={upd("revenue")} /></FRow>
      <FRow label="Status"><FSelect value={f.status} onChange={upd("status")} options={["upcoming","active","checked-out"].map(x=>({v:x,l:x}))} /></FRow>
      <FRow label="Notes"><FInput v={f.notes} onChange={upd("notes")} /></FRow>
    </Modal>
  );
}

function ExpenseModal({ properties, onSave, onClose }) {
  const [f, setF] = useState({ propId:1, category:"Utilities", desc:"", date:today, amount:"" });
  const upd = k => e => setF(p=>({...p,[k]:e.target.value}));
  return (
    <Modal title="Log Expense" onClose={onClose} onSave={()=>{ if(f.desc&&f.amount) onSave({...f,propId:+f.propId,amount:+f.amount}); }}>
      <FRow label="Property"><FSelect value={f.propId} onChange={upd("propId")} options={properties.map(p=>({v:p.id,l:p.name}))} /></FRow>
      <FRow label="Category"><FSelect value={f.category} onChange={upd("category")} options={["Utilities","Maintenance","Cleaning","Supplies","Internet","Platform Fee","Furnishing","Other"].map(x=>({v:x,l:x}))} /></FRow>
      <FRow label="Description"><FInput v={f.desc} onChange={upd("desc")} /></FRow>
      <FRow label="Date"><FInput type="date" v={f.date} onChange={upd("date")} /></FRow>
      <FRow label="Amount (PKR)"><FInput type="number" v={f.amount} onChange={upd("amount")} /></FRow>
    </Modal>
  );
}

function Modal({ title, onClose, onSave, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000BB", display:"flex", alignItems:"flex-end", zIndex:999 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxHeight:"90dvh", overflowY:"auto", paddingBottom:"calc(24px + env(safe-area-inset-bottom))" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:16 }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:22 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>{children}</div>
        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          <button onClick={onClose} style={{ flex:1, padding:12, borderRadius:12, border:`1px solid ${C.border}`, background:"transparent", color:C.textDim, cursor:"pointer", fontSize:14 }}>Cancel</button>
          <button onClick={onSave} style={{ flex:2, padding:12, borderRadius:12, background:C.accent, border:"none", color:"#000", fontWeight:700, cursor:"pointer", fontSize:14 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MICRO COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const SectionHeader = ({ children }) => <h2 style={{ fontSize:20, fontWeight:700, marginBottom:16, letterSpacing:-0.3 }}>{children}</h2>;
const MicroTitle    = ({ children }) => <div style={{ fontSize:10, letterSpacing:1.5, color:C.muted, fontWeight:600 }}>{children}</div>;
const Empty         = ({ text })     => <div style={{ textAlign:"center", padding:40, color:C.muted, fontSize:14 }}>{text}</div>;
const LegendDot     = ({ color, label }) => (
  <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.textDim }}>
    <div style={{ width:7, height:7, borderRadius:2, background:color }} />{label}
  </div>
);
const PlatformBadge = ({ p }) => {
  const ab = p==="Airbnb";
  return <span style={{ background:ab?"#FF585820":"#003B9515", color:ab?"#FF8080":"#4A9EFF", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:500 }}>{p}</span>;
};

const inputStyle = { width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14 };
const FRow = ({ label, children }) => <div><div style={{ fontSize:11, color:C.textDim, marginBottom:5 }}>{label}</div>{children}</div>;
const FInput = ({ v, onChange, type="text" }) => <input type={type} value={v} onChange={onChange} style={inputStyle} />;
const FSelect = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange} style={inputStyle}>
    {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
  </select>
);
