import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

// ── Tokens ──────────────────────────────────────────────────────────────────
const C = {
  navy:    "#0F1E3C",
  navyMid: "#162845",
  navyLt:  "#1E3560",
  emerald: "#10B981",
  emeraldDk:"#059669",
  cyan:    "#06B6D4",
  cyanLt:  "#22D3EE",
  slate:   "#64748B",
  slateLt: "#94A3B8",
  white:   "#F8FAFC",
  glass:   "rgba(255,255,255,0.05)",
  glassBorder:"rgba(255,255,255,0.10)",
  red:     "#F43F5E",
  amber:   "#F59E0B",
  purple:  "#8B5CF6",
};

// ── Mock Data ────────────────────────────────────────────────────────────────
const revenueData = [
  {m:"Jan",revenue:4.2,target:4.0,prev:3.8},{m:"Feb",revenue:4.8,target:4.5,prev:4.1},
  {m:"Mar",revenue:5.1,target:4.8,prev:4.4},{m:"Apr",revenue:4.7,target:5.0,prev:4.2},
  {m:"May",revenue:5.6,target:5.2,prev:4.9},{m:"Jun",revenue:6.1,target:5.5,prev:5.2},
  {m:"Jul",revenue:5.9,target:5.8,prev:5.0},{m:"Aug",revenue:6.4,target:6.0,prev:5.5},
  {m:"Sep",revenue:6.8,target:6.3,prev:5.8},{m:"Oct",revenue:7.2,target:6.8,prev:6.1},
  {m:"Nov",revenue:7.6,target:7.2,prev:6.5},{m:"Dec",revenue:8.1,target:7.5,prev:7.0},
];

const cashFlowData = [
  {m:"Jan",inflow:5.2,outflow:3.8,balance:1.4},{m:"Feb",inflow:5.8,outflow:4.1,balance:3.1},
  {m:"Mar",inflow:6.1,outflow:4.8,balance:4.4},{m:"Apr",inflow:5.5,outflow:5.2,balance:4.7},
  {m:"May",inflow:6.8,outflow:4.9,balance:6.6},{m:"Jun",inflow:7.2,outflow:5.3,balance:8.5},
  {m:"Jul",inflow:6.9,outflow:5.1,balance:10.3},{m:"Aug",inflow:7.5,outflow:5.6,balance:12.2},
  {m:"Sep",inflow:8.0,outflow:5.8,balance:14.4},{m:"Oct",inflow:8.4,outflow:6.0,balance:16.8},
  {m:"Nov",inflow:8.9,outflow:6.2,balance:19.5},{m:"Dec",inflow:9.3,outflow:6.5,balance:22.3},
];

const expenseData = [
  {name:"Salaries",value:42,color:"#06B6D4"},
  {name:"Operations",value:22,color:"#10B981"},
  {name:"Marketing",value:16,color:"#8B5CF6"},
  {name:"Technology",value:12,color:"#F59E0B"},
  {name:"Administrative",value:8,color:"#F43F5E"},
];

const budgetData = [
  {dept:"Engineering",budget:8.5,actual:7.9,variance:0.6},
  {dept:"Marketing",budget:5.2,actual:5.8,variance:-0.6},
  {dept:"Sales",budget:6.8,actual:6.2,variance:0.6},
  {dept:"Operations",budget:4.1,actual:4.3,variance:-0.2},
  {dept:"HR",budget:2.3,actual:2.1,variance:0.2},
  {dept:"Finance",budget:1.8,actual:1.7,variance:0.1},
];

const forecastData = [
  {m:"Jan",conservative:8.0,expected:8.5,aggressive:9.2,actual:8.3},
  {m:"Feb",conservative:8.2,expected:8.9,aggressive:9.8,actual:8.7},
  {m:"Mar",conservative:8.5,expected:9.3,aggressive:10.5,actual:9.1},
  {m:"Apr",conservative:8.7,expected:9.7,aggressive:11.0,actual:null},
  {m:"May",conservative:9.0,expected:10.2,aggressive:11.8,actual:null},
  {m:"Jun",conservative:9.2,expected:10.6,aggressive:12.4,actual:null},
];

const transactions = [
  {id:"TXN-8821",date:"Dec 12, 2024",category:"Revenue",amount:"+$284,500",status:"Completed",account:"Ops Account"},
  {id:"TXN-8820",date:"Dec 11, 2024",category:"Payroll",amount:"-$142,300",status:"Completed",account:"Payroll Account"},
  {id:"TXN-8819",date:"Dec 11, 2024",category:"Marketing",amount:"-$38,750",status:"Pending",account:"Marketing Fund"},
  {id:"TXN-8818",date:"Dec 10, 2024",category:"Revenue",amount:"+$196,200",status:"Completed",account:"Ops Account"},
  {id:"TXN-8817",date:"Dec 10, 2024",category:"Technology",amount:"-$52,100",status:"Completed",account:"Tech Budget"},
  {id:"TXN-8816",date:"Dec 09, 2024",category:"Investment",amount:"+$410,000",status:"Completed",account:"Investment Portfolio"},
  {id:"TXN-8815",date:"Dec 09, 2024",category:"Operations",amount:"-$28,400",status:"Failed",account:"Ops Account"},
  {id:"TXN-8814",date:"Dec 08, 2024",category:"Revenue",amount:"+$312,800",status:"Completed",account:"Ops Account"},
];

const portfolio = [
  {name:"Stocks",value:38,amount:"$4.56M",change:"+8.2%",color:"#06B6D4"},
  {name:"Bonds",value:24,amount:"$2.88M",change:"+2.1%",color:"#10B981"},
  {name:"Mutual Funds",value:18,amount:"$2.16M",change:"+5.4%",color:"#8B5CF6"},
  {name:"ETFs",value:12,amount:"$1.44M",change:"+6.8%",color:"#F59E0B"},
  {name:"Crypto",value:8,amount:"$0.96M",change:"-3.2%",color:"#F43F5E"},
];

const sparkData = (n,up)=>[...Array(8)].map((_,i)=>({v:up?40+i*8+Math.random()*10:80-i*6+Math.random()*10}));

// ── Sub-components ───────────────────────────────────────────────────────────

function Sparkline({data,color,up}){
  return(
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{top:2,right:0,bottom:0,left:0}}>
        <defs>
          <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          fill={`url(#sg${color.replace('#','')})`} dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

function KPICard({label,value,change,up,color,prefix="$",suffix=""}){
  const spark = sparkData(8,up);
  return(
    <div style={{
      background:"linear-gradient(135deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.02) 100%)",
      border:`1px solid ${C.glassBorder}`,
      borderRadius:16,
      padding:"20px 20px 12px",
      backdropFilter:"blur(12px)",
      position:"relative",
      overflow:"hidden",
      transition:"transform 0.2s,box-shadow 0.2s",
      cursor:"default",
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 12px 40px rgba(0,0,0,0.3)`;}}
    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
      {/* accent bar */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${color},transparent)`}}/>
      <div style={{fontSize:11,color:C.slateLt,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:"-0.5px",marginBottom:6}}>
        {prefix}{value}{suffix}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
        <span style={{
          display:"inline-flex",alignItems:"center",gap:3,
          fontSize:12,fontWeight:600,
          color:up?C.emerald:C.red,
          background:up?"rgba(16,185,129,0.12)":"rgba(244,63,94,0.12)",
          padding:"2px 8px",borderRadius:20,
        }}>
          {up?"↑":"↓"} {change}
        </span>
        <span style={{fontSize:11,color:C.slate}}>vs last period</span>
      </div>
      <Sparkline data={spark} color={color} up={up}/>
    </div>
  );
}

function SectionCard({title,children,action,style={}}){
  return(
    <div style={{
      background:"linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.01) 100%)",
      border:`1px solid ${C.glassBorder}`,
      borderRadius:20,
      padding:24,
      backdropFilter:"blur(12px)",
      ...style
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{fontSize:15,fontWeight:700,color:C.white,margin:0,letterSpacing:"-0.3px"}}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function FilterPills({options,active,setActive}){
  return(
    <div style={{display:"flex",gap:6}}>
      {options.map(o=>(
        <button key={o} onClick={()=>setActive(o)} style={{
          padding:"4px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
          transition:"all 0.15s",
          background:active===o?C.cyan:"rgba(255,255,255,0.07)",
          color:active===o?C.navy:C.slateLt,
        }}>{o}</button>
      ))}
    </div>
  );
}

const tooltipStyle={
  contentStyle:{background:"#0F1E3C",border:`1px solid ${C.glassBorder}`,borderRadius:10,fontSize:12,color:C.white},
  labelStyle:{color:C.slateLt},
  cursor:{stroke:"rgba(255,255,255,0.1)",strokeWidth:1},
};

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function FinanceDashboard(){
  const [darkMode,setDarkMode]=useState(true);
  const [revFilter,setRevFilter]=useState("Monthly");
  const [txSearch,setTxSearch]=useState("");
  const [txSort,setTxSort]=useState("date");
  const [sideOpen,setSideOpen]=useState(true);
  const [activeNav,setActiveNav]=useState("Dashboard");
  const [notif,setNotif]=useState(3);

  const filteredTx = transactions.filter(t=>
    t.id.toLowerCase().includes(txSearch.toLowerCase())||
    t.category.toLowerCase().includes(txSearch.toLowerCase())||
    t.account.toLowerCase().includes(txSearch.toLowerCase())
  );

  const navItems = ["Dashboard","Analytics","Forecasting","Transactions","Portfolio","Settings"];
  const navIcons = {
    Dashboard:"⬛",Analytics:"📊",Forecasting:"🔮",Transactions:"💳",Portfolio:"📈",Settings:"⚙️"
  };

  return(
    <div style={{
      fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",
      background:`linear-gradient(160deg, ${C.navy} 0%, #0A1628 40%, #071020 100%)`,
      minHeight:"100vh",
      color:C.white,
      display:"flex",
      fontSize:14,
    }}>

      {/* ── Sidebar ── */}
      <div style={{
        width:sideOpen?220:64,
        minHeight:"100vh",
        background:"rgba(15,30,60,0.8)",
        borderRight:`1px solid ${C.glassBorder}`,
        backdropFilter:"blur(20px)",
        padding:"24px 0",
        display:"flex",
        flexDirection:"column",
        transition:"width 0.2s",
        flexShrink:0,
        zIndex:10,
      }}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 16px 28px",borderBottom:`1px solid ${C.glassBorder}`}}>
          <div style={{
            width:36,height:36,borderRadius:10,flexShrink:0,
            background:`linear-gradient(135deg,${C.cyan},${C.emerald})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:16,fontWeight:800,color:C.navy,
          }}>F</div>
          {sideOpen&&<span style={{fontSize:15,fontWeight:800,letterSpacing:"-0.3px",whiteSpace:"nowrap"}}>FinanceOS</span>}
        </div>
        {/* Nav */}
        <nav style={{padding:"20px 10px",flex:1}}>
          {navItems.map(item=>(
            <button key={item} onClick={()=>setActiveNav(item)} style={{
              display:"flex",alignItems:"center",gap:10,
              width:"100%",padding:"10px 12px",borderRadius:10,border:"none",
              cursor:"pointer",textAlign:"left",
              background:activeNav===item?"rgba(6,182,212,0.15)":"transparent",
              color:activeNav===item?C.cyan:C.slateLt,
              fontWeight:activeNav===item?600:400,fontSize:13,
              marginBottom:2,transition:"all 0.15s",
              borderLeft:activeNav===item?`3px solid ${C.cyan}`:"3px solid transparent",
            }}>
              <span style={{fontSize:14,minWidth:20,textAlign:"center"}}>{navIcons[item]}</span>
              {sideOpen&&<span style={{whiteSpace:"nowrap"}}>{item}</span>}
            </button>
          ))}
        </nav>
        {/* User */}
        {sideOpen&&<div style={{padding:"16px",borderTop:`1px solid ${C.glassBorder}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>SR</div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:C.white}}>Sarah Reynolds</div>
              <div style={{fontSize:10,color:C.slate}}>Chief Financial Officer</div>
            </div>
          </div>
        </div>}
      </div>

      {/* ── Main ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* ── Header ── */}
        <header style={{
          display:"flex",alignItems:"center",gap:16,
          padding:"0 28px",height:64,
          borderBottom:`1px solid ${C.glassBorder}`,
          background:"rgba(15,30,60,0.6)",
          backdropFilter:"blur(20px)",
          flexShrink:0,
        }}>
          <button onClick={()=>setSideOpen(s=>!s)} style={{background:"none",border:"none",color:C.slate,cursor:"pointer",fontSize:18,padding:4}}>☰</button>
          {/* Search */}
          <div style={{flex:1,maxWidth:360,position:"relative"}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.slate,fontSize:13}}>🔍</span>
            <input placeholder="Search metrics, transactions, reports…" style={{
              width:"100%",background:"rgba(255,255,255,0.06)",border:`1px solid ${C.glassBorder}`,
              borderRadius:10,padding:"8px 12px 8px 36px",color:C.white,fontSize:13,
              outline:"none",boxSizing:"border-box",
            }}/>
          </div>
          <div style={{flex:1}}/>
          {/* Date range */}
          <div style={{
            display:"flex",alignItems:"center",gap:8,
            background:"rgba(255,255,255,0.06)",border:`1px solid ${C.glassBorder}`,
            borderRadius:10,padding:"7px 14px",fontSize:12,color:C.slateLt,cursor:"pointer",
          }}>
            📅 <span>Dec 1 – Dec 31, 2024</span> ▾
          </div>
          {/* Dark mode */}
          <button onClick={()=>setDarkMode(d=>!d)} style={{
            background:"rgba(255,255,255,0.06)",border:`1px solid ${C.glassBorder}`,
            borderRadius:8,padding:"7px 12px",color:C.slateLt,cursor:"pointer",fontSize:13,
          }}>{darkMode?"☀️":"🌙"}</button>
          {/* Notif */}
          <div style={{position:"relative"}}>
            <button style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${C.glassBorder}`,borderRadius:8,padding:"7px 12px",color:C.slateLt,cursor:"pointer",fontSize:16}}>🔔</button>
            {notif>0&&<span style={{position:"absolute",top:-4,right:-4,background:C.red,borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{notif}</span>}
          </div>
          {/* Avatar */}
          <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,cursor:"pointer"}}>SR</div>
        </header>

        {/* ── Body ── */}
        <div style={{flex:1,overflowY:"auto",padding:"24px 28px",display:"flex",flexDirection:"column",gap:24}}>

          {/* Page title */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <div style={{fontSize:11,color:C.cyan,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Executive Overview</div>
              <h1 style={{fontSize:26,fontWeight:800,margin:0,letterSpacing:"-0.5px"}}>Finance Dashboard</h1>
            </div>
            <div style={{fontSize:12,color:C.slate}}>Last updated: Today at 14:32 UTC · Auto-refresh in <span style={{color:C.cyan}}>45s</span></div>
          </div>

          {/* ── KPI Grid ── */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
            <KPICard label="Total Revenue"      value="72.4M"  change="12.3%"  up={true}  color={C.cyan}/>
            <KPICard label="Net Profit"         value="18.6M"  change="8.7%"   up={true}  color={C.emerald}/>
            <KPICard label="Operating Expenses" value="41.2M"  change="3.1%"   up={false} color={C.amber}/>
            <KPICard label="Cash Flow"          value="22.3M"  change="15.4%"  up={true}  color={C.purple}/>
            <KPICard label="EBITDA"             value="24.1M"  change="11.2%"  up={true}  color={C.cyan}/>
            <KPICard label="Accounts Receivable"value="9.8M"   change="4.6%"   up={false} color={C.amber}/>
            <KPICard label="Accounts Payable"   value="6.3M"   change="2.1%"   up={true}  color={C.emerald}/>
            <KPICard label="Profit Margin"      value="25.7"   suffix="%"  prefix="" change="2.4%"  up={true}  color={C.purple}/>
          </div>

          {/* ── Row: Revenue + Expense ── */}
          <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:20}}>

            {/* Revenue */}
            <SectionCard title="Revenue Analytics" action={
              <FilterPills options={["Monthly","Quarterly","Yearly"]} active={revFilter} setActive={setRevFilter}/>
            }>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData} margin={{top:5,right:10,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.cyan} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={C.cyan} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.purple} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="m" tick={{fill:C.slate,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.slate,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                  <Tooltip {...tooltipStyle} formatter={(v,n)=>[`$${v}M`,n]}/>
                  <Legend wrapperStyle={{fontSize:12,paddingTop:12}}/>
                  <Area type="monotone" dataKey="prev" name="Previous Year" stroke={C.purple} strokeWidth={1.5} fill="url(#prevGrad)" strokeDasharray="4 2" dot={false}/>
                  <Area type="monotone" dataKey="target" name="Target" stroke={C.amber} strokeWidth={1.5} fill="none" strokeDasharray="4 2" dot={false}/>
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke={C.cyan} strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{r:5,fill:C.cyan}}/>
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>

            {/* Expense Breakdown */}
            <SectionCard title="Expense Breakdown">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={expenseData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    paddingAngle={3} dataKey="value">
                    {expenseData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:C.navyMid,border:`1px solid ${C.glassBorder}`,borderRadius:8,fontSize:12}} formatter={v=>[`${v}%`]}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px 16px",marginTop:4}}>
                {expenseData.map(e=>(
                  <div key={e.name} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.slateLt}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:e.color,flexShrink:0}}/>
                    {e.name} <strong style={{color:C.white}}>{e.value}%</strong>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ── Row: Cash Flow + Budget ── */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

            {/* Cash Flow */}
            <SectionCard title="Cash Flow Management" action={
              <span style={{fontSize:11,color:C.emerald,fontWeight:600,background:"rgba(16,185,129,0.1)",padding:"3px 10px",borderRadius:20}}>↑ Healthy</span>
            }>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={cashFlowData} margin={{top:5,right:5,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="m" tick={{fill:C.slate,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.slate,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                  <Tooltip {...tooltipStyle} formatter={(v,n)=>[`$${v}M`,n]}/>
                  <Legend wrapperStyle={{fontSize:11,paddingTop:8}}/>
                  <Bar dataKey="inflow" name="Inflow" fill={C.emerald} radius={[4,4,0,0]} barSize={10}/>
                  <Bar dataKey="outflow" name="Outflow" fill={C.red} radius={[4,4,0,0]} barSize={10} fillOpacity={0.8}/>
                  <Line type="monotone" dataKey="balance" name="Balance" stroke={C.cyan} strokeWidth={2} dot={false}/>
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>

            {/* Budget vs Actual */}
            <SectionCard title="Budget vs Actual">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={budgetData} layout="vertical" margin={{top:0,right:10,left:60,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.slate,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                  <YAxis type="category" dataKey="dept" tick={{fill:C.slateLt,fontSize:11}} axisLine={false} tickLine={false} width={55}/>
                  <Tooltip {...tooltipStyle} formatter={(v,n)=>[`$${v}M`,n]}/>
                  <Legend wrapperStyle={{fontSize:11,paddingTop:8}}/>
                  <Bar dataKey="budget" name="Budget" fill={C.slate} radius={[0,4,4,0]} barSize={8} fillOpacity={0.5}/>
                  <Bar dataKey="actual" name="Actual" radius={[0,4,4,0]} barSize={8}
                    fill={C.cyan}
                    label={false}>
                    {budgetData.map((d,i)=><Cell key={i} fill={d.variance>=0?C.emerald:C.red}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>

          {/* ── Row: Forecasting ── */}
          <SectionCard title="AI-Powered Financial Forecasting" action={
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:C.purple,background:"rgba(139,92,246,0.12)",padding:"3px 10px",borderRadius:20,fontWeight:600}}>🤖 AI Forecast</span>
              <span style={{fontSize:11,color:C.slate}}>Confidence: 94%</span>
            </div>
          }>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:20,alignItems:"center"}}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={forecastData} margin={{top:5,right:10,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="aggGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.emerald} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={C.emerald} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="m" tick={{fill:C.slate,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.slate,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                  <Tooltip {...tooltipStyle} formatter={(v,n)=>[v?`$${v}M`:"-",n]}/>
                  <Legend wrapperStyle={{fontSize:11,paddingTop:8}}/>
                  <ReferenceLine x="Mar" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 2" label={{value:"Today",fill:C.slate,fontSize:10}}/>
                  <Area type="monotone" dataKey="aggressive" name="Aggressive" stroke={C.emerald} strokeWidth={1.5} fill="url(#aggGrad)" strokeDasharray="4 2" dot={false}/>
                  <Area type="monotone" dataKey="expected" name="Expected" stroke={C.cyan} strokeWidth={2} fill="none" dot={false}/>
                  <Area type="monotone" dataKey="conservative" name="Conservative" stroke={C.amber} strokeWidth={1.5} fill="none" strokeDasharray="4 2" dot={false}/>
                  <Area type="monotone" dataKey="actual" name="Actual" stroke={C.white} strokeWidth={2.5} fill="none" dot={{fill:C.white,r:3}}/>
                </AreaChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexDirection:"column",gap:12,minWidth:160}}>
                {[
                  {label:"Conservative",value:"$9.2M",color:C.amber,change:"+8%"},
                  {label:"Expected",value:"$10.6M",color:C.cyan,change:"+24%"},
                  {label:"Aggressive",value:"$12.4M",color:C.emerald,change:"+46%"},
                ].map(s=>(
                  <div key={s.label} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 16px",border:`1px solid rgba(255,255,255,0.07)`}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:s.color}}/>
                      <span style={{fontSize:11,color:C.slateLt}}>{s.label}</span>
                    </div>
                    <div style={{fontSize:20,fontWeight:700,color:s.color}}>{s.value}</div>
                    <div style={{fontSize:11,color:C.slate,marginTop:2}}>Jun 2025 · {s.change} YoY</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ── Row: Transactions + Portfolio ── */}
          <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20}}>

            {/* Transactions Table */}
            <SectionCard title="Recent Transactions">
              {/* Controls */}
              <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
                <div style={{position:"relative",flex:1}}>
                  <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.slate,fontSize:12}}>🔍</span>
                  <input value={txSearch} onChange={e=>setTxSearch(e.target.value)}
                    placeholder="Filter transactions…" style={{
                    width:"100%",background:"rgba(255,255,255,0.06)",border:`1px solid ${C.glassBorder}`,
                    borderRadius:8,padding:"7px 12px 7px 30px",color:C.white,fontSize:12,
                    outline:"none",boxSizing:"border-box",
                  }}/>
                </div>
                <button style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${C.glassBorder}`,borderRadius:8,padding:"7px 12px",color:C.slateLt,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>⬇ Export</button>
              </div>
              {/* Table */}
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{borderBottom:`1px solid ${C.glassBorder}`}}>
                      {["ID","Date","Category","Amount","Status","Account"].map(h=>(
                        <th key={h} style={{padding:"0 12px 10px",textAlign:"left",color:C.slate,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap"}}
                          onClick={()=>setTxSort(h.toLowerCase())}>{h} {txSort===h.toLowerCase()?"↓":"↕"}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTx.map(t=>(
                      <tr key={t.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"10px 12px",color:C.cyan,fontWeight:500,fontFamily:"monospace"}}>{t.id}</td>
                        <td style={{padding:"10px 12px",color:C.slateLt,whiteSpace:"nowrap"}}>{t.date}</td>
                        <td style={{padding:"10px 12px",color:C.white}}>{t.category}</td>
                        <td style={{padding:"10px 12px",fontWeight:600,color:t.amount.startsWith("+")?C.emerald:C.red,fontFamily:"monospace"}}>{t.amount}</td>
                        <td style={{padding:"10px 12px"}}>
                          <span style={{
                            fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,
                            background:t.status==="Completed"?"rgba(16,185,129,0.12)":t.status==="Pending"?"rgba(245,158,11,0.12)":"rgba(244,63,94,0.12)",
                            color:t.status==="Completed"?C.emerald:t.status==="Pending"?C.amber:C.red,
                          }}>{t.status}</span>
                        </td>
                        <td style={{padding:"10px 12px",color:C.slateLt,whiteSpace:"nowrap"}}>{t.account}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Portfolio */}
            <SectionCard title="Investment Portfolio" action={
              <span style={{fontSize:12,color:C.emerald,fontWeight:600}}>+6.4% overall</span>
            }>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={portfolio} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value">
                    {portfolio.map((p,i)=><Cell key={i} fill={p.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:C.navyMid,border:`1px solid ${C.glassBorder}`,borderRadius:8,fontSize:12}} formatter={(v,n)=>[`${v}%`,n]}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
                {portfolio.map(p=>(
                  <div key={p.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:p.color,flexShrink:0}}/>
                      <span style={{fontSize:12,color:C.slateLt}}>{p.name}</span>
                    </div>
                    <div style={{display:"flex",gap:14,alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:600,color:C.white}}>{p.amount}</span>
                      <span style={{fontSize:11,color:p.change.startsWith("+")?C.emerald:C.red,fontWeight:600,minWidth:44,textAlign:"right"}}>{p.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ── Risk & Compliance ── */}
          <SectionCard title="Risk & Compliance Monitoring">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>

              {/* Risk Score */}
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,padding:18,border:`1px solid ${C.glassBorder}`,textAlign:"center"}}>
                <div style={{fontSize:11,color:C.slateLt,marginBottom:12,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em"}}>Financial Risk Score</div>
                <div style={{fontSize:52,fontWeight:800,color:C.emerald,lineHeight:1}}>78</div>
                <div style={{fontSize:11,color:C.emerald,marginTop:4,marginBottom:12}}>Low Risk</div>
                <div style={{background:"rgba(255,255,255,0.07)",borderRadius:20,height:6,overflow:"hidden"}}>
                  <div style={{width:"78%",height:"100%",background:`linear-gradient(90deg,${C.emerald},${C.cyan})`,borderRadius:20}}/>
                </div>
              </div>

              {/* Compliance */}
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,padding:18,border:`1px solid ${C.glassBorder}`}}>
                <div style={{fontSize:11,color:C.slateLt,marginBottom:14,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em"}}>Compliance Status</div>
                {[
                  {label:"SOX Compliance",status:"Compliant",color:C.emerald},
                  {label:"GAAP Standards",status:"Compliant",color:C.emerald},
                  {label:"Tax Filings",status:"Due Dec 31",color:C.amber},
                  {label:"Audit Trail",status:"Compliant",color:C.emerald},
                ].map(c=>(
                  <div key={c.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:12,color:C.slateLt}}>{c.label}</span>
                    <span style={{fontSize:11,fontWeight:600,color:c.color,background:`${c.color}18`,padding:"2px 8px",borderRadius:20}}>{c.status}</span>
                  </div>
                ))}
              </div>

              {/* Alerts */}
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,padding:18,border:`1px solid ${C.glassBorder}`,gridColumn:"span 2"}}>
                <div style={{fontSize:11,color:C.slateLt,marginBottom:14,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em"}}>Active Alerts</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[
                    {type:"warning",icon:"⚠️",msg:"Accounts Receivable aging >60 days: $1.2M outstanding — 3 clients"},
                    {type:"info",icon:"ℹ️",msg:"Q4 tax payment due in 19 days · Estimated liability: $4.8M"},
                    {type:"success",icon:"✅",msg:"Monthly reconciliation completed · Zero discrepancies detected"},
                    {type:"warning",icon:"⚠️",msg:"Marketing budget overspend: $0.6M over allocation (Nov–Dec)"},
                  ].map((a,i)=>(
                    <div key={i} style={{
                      display:"flex",gap:10,alignItems:"flex-start",
                      padding:"10px 14px",borderRadius:10,
                      background:a.type==="warning"?"rgba(245,158,11,0.08)":a.type==="success"?"rgba(16,185,129,0.08)":"rgba(6,182,212,0.08)",
                      border:`1px solid ${a.type==="warning"?"rgba(245,158,11,0.15)":a.type==="success"?"rgba(16,185,129,0.15)":"rgba(6,182,212,0.15)"}`,
                    }}>
                      <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{a.icon}</span>
                      <span style={{fontSize:12,color:C.slateLt,lineHeight:1.5}}>{a.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Footer */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderTop:`1px solid ${C.glassBorder}`,fontSize:11,color:C.slate}}>
            <span>FinanceOS v4.2.1 · Enterprise Edition</span>
            <span>© 2024 FinanceOS Inc. · Data is simulated for demonstration purposes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
