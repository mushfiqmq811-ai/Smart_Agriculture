import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Beaker, Brain,
  CheckCircle2, ChevronRight, CloudRain, Droplets, Globe2, Leaf,
  Map, Menu, Microscope, Moon, Radio, Recycle, ShieldCheck, Sprout,
  Sun, Thermometer, Upload, Waves, X, Zap
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, LineChart, Line,
  PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import './styles.css'

const simLabel = 'SIMULATION / DEMONSTRATION DATA'

const env = [
  { label:'Temperature', value:'28.5', unit:'°C', target:'22–32°C', status:'Optimal', icon:Thermometer, trend:'+0.4°C', tone:'green' },
  { label:'Humidity', value:'72', unit:'%', target:'60–80%', status:'Optimal', icon:Waves, trend:'Stable', tone:'green' },
  { label:'Soil Moisture', value:'48.2', unit:'%', target:'45–60%', status:'Optimal', icon:Droplets, trend:'Stable', tone:'green' },
  { label:'Soil pH', value:'6.4', unit:'pH', target:'6.0–7.0', status:'Optimal', icon:Leaf, trend:'+0.1', tone:'green' },
  { label:'Nitrogen', value:'62', unit:'mg/kg', target:'50–80', status:'Optimal', icon:Sprout, trend:'Stable', tone:'green' },
  { label:'Phosphorus', value:'31', unit:'mg/kg', target:'25–45', status:'Optimal', icon:Sprout, trend:'+2', tone:'green' },
  { label:'Potassium', value:'44', unit:'mg/kg', target:'35–55', status:'Optimal', icon:Sprout, trend:'Stable', tone:'green' },
  { label:'Light Intensity', value:'68', unit:'klux', target:'40–80', status:'Good', icon:Sun, trend:'−3%', tone:'blue' },
  { label:'Rain Probability', value:'72', unit:'%', target:'<40% preferred', status:'High', icon:CloudRain, trend:'+18%', tone:'amber' },
  { label:'Water Level', value:'76', unit:'%', target:'>30%', status:'Good', icon:Waves, trend:'−4%', tone:'blue' }
]

const moistureData = [
  {name:'00', value:53},{name:'04', value:51},{name:'08', value:49},{name:'12', value:47},
  {name:'16', value:48.2},{name:'20', value:49},{name:'24', value:48.2}
]
const tempData = [
  {name:'Mon', value:27.2},{name:'Tue', value:28.1},{name:'Wed', value:29.4},
  {name:'Thu', value:28.8},{name:'Fri', value:28.5},{name:'Sat', value:29.1},{name:'Sun', value:28.5}
]
const riskData = [
  {day:'1', heat:12, water:18, rain:32, disease:22},
  {day:'3', heat:18, water:21, rain:54, disease:31},
  {day:'5', heat:26, water:18, rain:48, disease:44},
  {day:'7', heat:31, water:24, rain:28, disease:38},
  {day:'9', heat:24, water:31, rain:22, disease:29},
  {day:'11', heat:18, water:38, rain:19, disease:23},
  {day:'13', heat:20, water:42, rain:34, disease:27},
  {day:'15', heat:23, water:35, rain:26, disease:25}
]
const weather = [
  {day:'Today', icon:Sun, temp:'29°', rain:'25%', humidity:'70%'},
  {day:'Tomorrow', icon:CloudRain, temp:'27°', rain:'72%', humidity:'82%'},
  {day:'Day 3', icon:CloudRain, temp:'28°', rain:'61%', humidity:'78%'},
  {day:'Day 4', icon:Sun, temp:'30°', rain:'18%', humidity:'67%'},
  {day:'Day 5', icon:Sun, temp:'31°', rain:'12%', humidity:'64%'}
]
const zones = [
  {id:'A1', crop:'Tomato', health:91, moisture:51, temp:28.1, risk:'Low'},
  {id:'A2', crop:'Tomato', health:83, moisture:45, temp:29.0, risk:'Moderate'},
  {id:'B1', crop:'Chili', health:88, moisture:49, temp:27.8, risk:'Low'},
  {id:'B2', crop:'Chili', health:76, moisture:42, temp:29.5, risk:'Moderate'}
]

function Badge({children, tone='green'}) {
  return <span className={`badge ${tone}`}>{children}</span>
}

function SectionHeader({eyebrow, title, text}) {
  return <div className="section-head">
    <div>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  </div>
}

function Card({children, className=''}) {
  return <div className={`card ${className}`}>{children}</div>
}

function MetricCard({item}) {
  const Icon=item.icon
  return <Card className="metric-card">
    <div className="metric-top">
      <div className="metric-icon"><Icon size={18}/></div>
      <Badge tone={item.tone}>{item.status}</Badge>
    </div>
    <div className="metric-label">{item.label}</div>
    <div className="metric-value">{item.value}<span>{item.unit}</span></div>
    <div className="metric-meta"><span>Target: {item.target}</span><span>{item.trend}</span></div>
  </Card>
}

function ChartCard({title, subtitle, children, action}) {
  return <Card className="chart-card">
    <div className="card-head">
      <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
      {action}
    </div>
    <div className="chart">{children}</div>
  </Card>
}

function App() {
  const [lang,setLang]=useState('en')
  const [active,setActive]=useState('dashboard')
  const [mobileOpen,setMobileOpen]=useState(false)
  const [mode,setMode]=useState('farmer')
  const [demo,setDemo]=useState(true)
  const [cropText,setCropText]=useState('')
  const [upload,setUpload]=useState(null)
  const [farmSize,setFarmSize]=useState(2)
  const [waterUse,setWaterUse]=useState(1200)
  const [irrigation,setIrrigation]=useState('traditional')
  const [selectedZone,setSelectedZone]=useState(zones[0])

  const impact = useMemo(() => {
    const factor = irrigation==='traditional' ? 0.18 : 0.12
    const potential = Math.round(waterUse * factor)
    return { potential, smart:Math.max(0,waterUse-potential) }
  },[waterUse,irrigation])

  const nav = [
    ['dashboard','Smart Farm Dashboard',Activity],
    ['doctor','AI Crop Doctor',Brain],
    ['irrigation','Smart Irrigation',Droplets],
    ['risk','15-Day Risk Forecast',AlertTriangle],
    ['weather','Weather Intelligence',CloudRain],
    ['crop','Crop Recommender',Sprout],
    ['soil','Soil Intelligence',Leaf],
    ['disease','Disease Risk',ShieldCheck],
    ['map','Farm Map',Map],
    ['analytics','Analytics',BarChart3],
    ['impact','Impact Calculator',Recycle],
    ['experiment','Experiment & Validation',Beaker],
    ['method','How It Works',Zap],
    ['model','AI Methodology',Microscope],
    ['sources','Data Sources',Globe2],
  ]

  const go = id => { setActive(id); setMobileOpen(false); window.scrollTo({top:0,behavior:'smooth'}) }

  return <div className="app">
    <header className="topbar">
      <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}><Menu size={21}/></button>
      <button className="brand" onClick={()=>go('home')}>
        <span className="brand-mark"><Sprout size={21}/></span>
        <span><strong>AgriSense</strong><small>Smart Agriculture Platform</small></span>
      </button>
      <div className="top-actions">
        <div className="demo-toggle">
          <span className="pulse-dot"></span>
          <span>{simLabel}</span>
        </div>
        <button className="lang" onClick={()=>setLang(lang==='en'?'bn':'en')}>{lang==='en'?'বাংলা':'English'}</button>
        <button className="mode-btn" onClick={()=>setMode(mode==='farmer'?'researcher':'farmer')}>
          {mode==='farmer'?'Farmer Mode':'Researcher Mode'}
        </button>
      </div>
    </header>

    <aside className={`sidebar ${mobileOpen?'open':''}`}>
      <div className="side-title">PLATFORM</div>
      {nav.map(([id,label,Icon])=><button key={id} className={active===id?'active':''} onClick={()=>go(id)}>
        <Icon size={17}/><span>{label}</span>
      </button>)}
      <div className="sidebar-bottom">
        <button onClick={()=>go('about')}><ShieldCheck size={17}/><span>About & Privacy</span></button>
      </div>
    </aside>

    <main className="main">
      {active==='home' && <Home go={go} demo={demo} setDemo={setDemo}/>}
      {active==='dashboard' && <Dashboard go={go} mode={mode}/>}
      {active==='doctor' && <CropDoctor cropText={cropText} setCropText={setCropText} upload={upload} setUpload={setUpload}/>}
      {active==='irrigation' && <Irrigation/>}
      {active==='risk' && <Risk/>}
      {active==='weather' && <Weather/>}
      {active==='crop' && <CropRecommender/>}
      {active==='soil' && <Soil/>}
      {active==='disease' && <Disease/>}
      {active==='map' && <FarmMap selectedZone={selectedZone} setSelectedZone={setSelectedZone}/>}
      {active==='analytics' && <Analytics/>}
      {active==='impact' && <Impact farmSize={farmSize} setFarmSize={setFarmSize} waterUse={waterUse} setWaterUse={setWaterUse} irrigation={irrigation} setIrrigation={setIrrigation} impact={impact}/>}
      {active==='experiment' && <Experiment/>}
      {active==='method' && <Method/>}
      {active==='model' && <Model/>}
      {active==='sources' && <Sources/>}
      {active==='about' && <About/>}
    </main>
  </div>
}

function Home({go,demo,setDemo}) {
  return <div className="page home-page">
    <section className="hero">
      <div className="hero-copy">
        <Badge>DATA-DRIVEN AGRICULTURAL INTELLIGENCE</Badge>
        <h1>Every Drop. Every Crop.<br/><em>Every Decision — Smarter.</em></h1>
        <p>AI + IoT + Weather + Soil Intelligence for smarter and more sustainable farming.</p>
        <div className="hero-actions">
          <button className="primary" onClick={()=>go('dashboard')}>Open Smart Farm Dashboard <ArrowRight size={17}/></button>
          <button className="secondary" onClick={()=>go('method')}>Explore How It Works</button>
        </div>
        <div className="hero-proof">
          <div><strong>1</strong><span>Decision layer</span></div>
          <div><strong>4+</strong><span>Data domains</span></div>
          <div><strong>15</strong><span>Day risk horizon</span></div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="farm-orbit"></div>
        <div className="hero-farm-card">
          <div className="mini-label">FARM HEALTH SCORE</div>
          <div className="score-ring"><span>87</span><small>/100</small></div>
          <div className="score-status"><CheckCircle2 size={15}/> Balanced conditions</div>
          <div className="mini-grid">
            <span>Soil <b>92%</b></span><span>Moisture <b>86%</b></span>
            <span>Weather <b>81%</b></span><span>Crop <b>88%</b></span>
          </div>
        </div>
      </div>
    </section>

    <div className="simulation-banner">
      <AlertTriangle size={18}/>
      <div><strong>Demonstration environment</strong><span>All displayed values on this starter are simulated. They are not live sensor, weather, experimental, or model-performance claims.</span></div>
      <label className="switch"><input type="checkbox" checked={demo} onChange={e=>setDemo(e.target.checked)}/><span></span></label>
    </div>

    <section className="home-section">
      <SectionHeader eyebrow="THE DECISION LOOP" title="From data to action" text="The platform connects environmental signals to explainable recommendations and measurable outcomes."/>
      <div className="flow-grid">
        {['Data Collection','Analysis','Prediction','Risk Detection','Recommendation','Farmer Action','Impact'].map((x,i)=><React.Fragment key={x}>
          <div className="flow-item"><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b></div>{i<6&&<ChevronRight className="flow-arrow" size={18}/>}
        </React.Fragment>)}
      </div>
    </section>

    <section className="home-section two-col">
      <Card className="feature-card"><div className="feature-icon"><Brain/></div><h3>Explainable AI</h3><p>Recommendations are paired with supporting factors, confidence, methodology and limitations instead of opaque percentages.</p><button className="text-btn" onClick={()=>go('model')}>View methodology <ArrowRight size={15}/></button></Card>
      <Card className="feature-card"><div className="feature-icon"><Droplets/></div><h3>Decision-first irrigation</h3><p>Soil moisture and weather signals are combined into a simple farmer-facing action: required, postponed, or not required.</p><button className="text-btn" onClick={()=>go('irrigation')}>See irrigation logic <ArrowRight size={15}/></button></Card>
    </section>

    <footer><span>Built for Bangladesh. Designed for the World.</span><span>© 2026 AgriSense • Demonstration Platform</span></footer>
  </div>
}

function Dashboard({go,mode}) {
  return <div className="page">
    <PageTop eyebrow="SMART FARM DASHBOARD" title="Farm control center" text="A single operational view of soil, weather, crop and risk signals."/>
    <div className="action-row">
      <div className="location-pill"><Map size={15}/> Demo Farm • Bangladesh</div>
      <button className="primary small" onClick={()=>go('doctor')}>Ask Crop Doctor <ArrowRight size={15}/></button>
    </div>
    <div className="grid-4">{env.slice(0,4).map(x=><MetricCard key={x.label} item={x}/>)}</div>
    <div className="grid-3">{env.slice(4,10).map(x=><MetricCard key={x.label} item={x}/>)}</div>

    <div className="dashboard-grid">
      <Card className="health-card">
        <div className="card-head"><div><h3>Farm Health Score</h3><p>Documented demo formula: weighted condition indicators.</p></div><Badge>Demo</Badge></div>
        <div className="health-body"><div className="big-score">87<span>/100</span></div><div className="progress"><span style={{width:'87%'}}></span></div><div className="factor"><span>Soil condition</span><b>25%</b><i></i></div><div className="factor"><span>Moisture</span><b>20%</b><i></i></div><div className="factor"><span>Weather</span><b>20%</b><i></i></div><div className="factor"><span>Crop health</span><b>20%</b><i></i></div><div className="factor"><span>Disease risk</span><b>15%</b><i></i></div></div>
        <div className="formula">Demo formula: score = 0.25×soil + 0.20×moisture + 0.20×weather + 0.20×crop + 0.15×(100−risk). Replace weights only after validation.</div>
      </Card>
      <ChartCard title="Soil Moisture" subtitle="Last 24 hours • simulated">
        <ResponsiveContainer width="100%" height="100%"><AreaChart data={moistureData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis domain={[35,65]}/><Tooltip/><Area type="monotone" dataKey="value" strokeWidth={2} fillOpacity={0.12}/></AreaChart></ResponsiveContainer>
      </ChartCard>
      <Card className="today-card"><div className="card-head"><div><h3>What should I do today?</h3><p>Farmer Mode</p></div><Sprout/></div><div className="decision"><span>💧</span><div><b>Irrigation</b><strong>Not Required</strong><small>Moisture is within target; rain probability is elevated.</small></div></div><div className="decision"><span>🌧</span><div><b>Rain</b><strong>Likely</strong><small>72% simulated probability in next 24h.</small></div></div><div className="decision"><span>🦠</span><div><b>Disease Risk</b><strong>Moderate</strong><small>Humidity + wet-condition factors.</small></div></div><div className="decision"><span>🌱</span><div><b>Crop Condition</b><strong>Good</strong><small>Demo crop-health indicator is stable.</small></div></div></Card>
    </div>
    {mode==='researcher' && <Card className="research-strip"><div><Radio/><div><b>Researcher Mode enabled</b><span>Raw readings, model metadata, uncertainty and source traceability are prioritized.</span></div><button onClick={()=>go('model')}>Open model details</button></div></Card>}
  </div>
}

function PageTop({eyebrow,title,text}) {
  return <div className="page-top"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div><Badge tone="blue">Demo Environment</Badge></div>
}

function CropDoctor({cropText,setCropText,upload,setUpload}) {
  const hasInput = cropText.trim().length>0 || upload
  return <div className="page">
    <PageTop eyebrow="AI CROP DOCTOR" title="Turn symptoms into explainable decisions" text="Describe a crop symptom or upload an image. This interface is a demonstration shell; no medical/agronomic diagnosis claim is made."/>
    <div className="doctor-grid">
      <Card>
        <div className="card-head"><div><h3>Crop problem</h3><p>Example: “Tomato leaves are turning yellow.”</p></div><Brain/></div>
        <textarea value={cropText} onChange={e=>setCropText(e.target.value)} placeholder="Describe what you observe..."></textarea>
        <label className="upload-box"><Upload size={22}/><b>{upload ? upload : 'Upload crop image'}</b><span>PNG/JPG • demo preview only</span><input type="file" accept="image/*" onChange={e=>setUpload(e.target.files?.[0]?.name||null)}/></label>
        <button className="primary full" disabled={!hasInput}>Analyze with Demo Engine <ArrowRight size={16}/></button>
      </Card>
      <Card className="diagnosis">
        <div className="card-head"><div><h3>Explainable result</h3><p>{hasInput?'Demo inference based on predefined factors.':'Enter an observation to preview the decision layout.'}</p></div></div>
        <div className="result-box"><Badge tone="amber">Illustrative</Badge><h3>{hasInput?'Possible nutrient / water stress':'No analysis yet'}</h3><p>{hasInput?'The interface would combine symptom evidence with soil, moisture, weather and crop context. A production model must cite its dataset and validation metrics.':'Your result will appear here.'}</p></div>
        <h4>Why this recommendation?</h4>
        <div className="evidence"><span>01</span><div><b>Supporting factors</b><p>Soil condition, moisture trend, recent weather and crop stage.</p></div></div>
        <div className="evidence"><span>02</span><div><b>Confidence</b><p>Not calculated in this frontend demo. A validated model should provide calibrated uncertainty.</p></div></div>
        <div className="evidence"><span>03</span><div><b>Recommended action</b><p>Verify soil and crop conditions before applying any treatment.</p></div></div>
      </Card>
    </div>
  </div>
}

function Irrigation() {
  return <div className="page">
    <PageTop eyebrow="SMART IRRIGATION" title="Irrigate when the crop actually needs it" text="A decision layer combining soil moisture, rainfall probability and crop requirement."/>
    <div className="decision-banner green"><div className="decision-icon"><CheckCircle2/></div><div><span>IRRIGATION STATUS</span><h2>NO IRRIGATION REQUIRED</h2><p>Demo logic: soil moisture is inside target range and near-term rain probability is elevated.</p></div></div>
    <div className="grid-3">
      <Card><div className="stat-label">Soil moisture</div><div className="stat-big">48.2<span>%</span></div><Badge>Target 45–60%</Badge></Card>
      <Card><div className="stat-label">Rain probability</div><div className="stat-big">72<span>%</span></div><Badge tone="amber">Elevated</Badge></Card>
      <Card><div className="stat-label">Recommended duration</div><div className="stat-big">0<span> min</span></div><Badge tone="blue">Demo output</Badge></Card>
    </div>
    <ChartCard title="Traditional vs Smart irrigation" subtitle="Illustrative normalized water-use index; not an empirical saving claim.">
      <ResponsiveContainer width="100%" height="100%"><BarChart data={[{name:'Traditional',water:100},{name:'Smart',water:82}]}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis domain={[0,110]}/><Tooltip/><Bar dataKey="water" name="Water-use index" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>
    </ChartCard>
    <Card className="logic-card"><h3>Decision logic</h3><div className="logic-row"><span>Soil moisture</span><b>48.2%</b><Badge>Within target</Badge></div><div className="logic-row"><span>Rain forecast</span><b>72%</b><Badge tone="amber">Elevated</Badge></div><div className="logic-row"><span>Crop demand</span><b>Moderate</b><Badge tone="blue">Context input</Badge></div></Card>
  </div>
}

function Risk() {
  return <div className="page">
    <PageTop eyebrow="15-DAY AGRICULTURAL RISK FORECAST" title="Look ahead before conditions change" text="Risk estimates are directional demonstrations, not certainties. Production forecasts require validated models and uncertainty calibration."/>
    <Card className="risk-chart"><div className="card-head"><div><h3>Risk trajectory</h3><p>Illustrative 0–100 risk index</p></div><Badge tone="amber">Simulation</Badge></div><div className="chart tall"><ResponsiveContainer width="100%" height="100%"><LineChart data={riskData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day" tickFormatter={v=>`D${v}`}/><YAxis domain={[0,100]}/><Tooltip/><Line type="monotone" dataKey="heat" name="Heat stress" strokeWidth={2}/><Line type="monotone" dataKey="water" name="Water stress" strokeWidth={2}/><Line type="monotone" dataKey="rain" name="Excess rainfall" strokeWidth={2}/><Line type="monotone" dataKey="disease" name="Disease risk" strokeWidth={2}/></LineChart></ResponsiveContainer></div></Card>
    <div className="risk-list">{[['Day 1–3','Low','Stable soil and moderate weather.','Monitor moisture.'],['Day 4–6','Moderate','Rain + humidity combination increases wet-condition risk.','Review irrigation timing.'],['Day 7–9','Low','Conditions normalize in this demonstration scenario.','Routine monitoring.'],['Day 10–15','Moderate','Water-stress index rises in the simulated trajectory.','Recheck soil moisture trend.']].map(r=><Card key={r[0]} className="risk-row"><div><span className="day-range">{r[0]}</span><h3>{r[1]} Risk</h3></div><div><b>Main factors</b><p>{r[2]}</p></div><div><b>Action</b><p>{r[3]}</p></div><Badge tone={r[1]==='Low'?'green':'amber'}>{r[1]}</Badge></Card>)}</div>
  </div>
}

function Weather() {
  return <div className="page">
    <PageTop eyebrow="WEATHER INTELLIGENCE" title="Forecasts translated into farm decisions" text="Weather is useful here because it changes irrigation, disease and stress decisions."/>
    <div className="weather-grid">{weather.map(({day,icon:Icon,temp,rain,humidity})=><Card key={day} className="weather-card"><span>{day}</span><Icon size={27}/><strong>{temp}</strong><small>Rain {rain}</small><small>Humidity {humidity}</small></Card>)}</div>
    <Card className="warning"><AlertTriangle/><div><b>Wet-condition watch</b><p>Simulated humidity + rainfall conditions may increase disease risk. Consider monitoring foliage and avoiding unnecessary irrigation.</p></div></Card>
    <div className="grid-3"><Card><h3>72h decision</h3><p>Postpone routine irrigation if soil remains within target and forecast rain materializes.</p></Card><Card><h3>Heat stress</h3><p>No high heat alert in this demo window. Production thresholds should be crop-specific.</p></Card><Card><h3>Data quality</h3><p>Weather values shown here are simulation values, not an external API feed.</p></Card></div>
  </div>
}

function CropRecommender() {
  const [p,setP]=useState({ph:6.4,n:62,p:31,k:44,temp:28,humidity:72,rain:120,location:'Bangladesh',season:'Monsoon'})
  const score = c => Math.max(0,Math.min(100,Math.round(100-Math.abs(p.ph-c.ph)*18-Math.abs(p.temp-c.temp)*2-Math.abs(p.humidity-c.hum)*0.4)))
  const crops=[{name:'Tomato',ph:6.2,temp:26,hum:65,reason:'pH and temperature are close to the illustrative target.'},{name:'Chili',ph:6.3,temp:27,hum:65,reason:'Balanced pH and warm conditions in this demo.'},{name:'Rice',ph:6.0,temp:29,hum:78,reason:'Higher humidity and warm temperature fit the illustrative profile.'}]
  return <div className="page"><PageTop eyebrow="CROP RECOMMENDER" title="Match crop conditions with transparent inputs" text="Suitability scores below are illustrative frontend calculations—not a validated agronomic model."/>
    <Card><div className="form-grid">{[['ph','Soil pH'],['n','Nitrogen'],['p','Phosphorus'],['k','Potassium'],['temp','Temperature'],['humidity','Humidity'],['rain','Rainfall']].map(([k,l])=><label key={k}>{l}<input type="number" value={p[k]} onChange={e=>setP({...p,[k]:Number(e.target.value)})}/></label>)}<label>Location<select value={p.location} onChange={e=>setP({...p,location:e.target.value})}><option>Bangladesh</option><option>Demo region</option></select></label><label>Season<select value={p.season} onChange={e=>setP({...p,season:e.target.value})}><option>Monsoon</option><option>Dry</option><option>Winter</option></select></label></div></Card>
    <div className="crop-results">{crops.map(c=><Card key={c.name}><div className="crop-head"><div className="crop-avatar"><Sprout/></div><div><h3>{c.name}</h3><p>{c.reason}</p></div><strong>{score(c)}<small>/100</small></strong></div><div className="progress"><span style={{width:`${score(c)}%`}}></span></div><small>Method: weighted distance from illustrative target conditions. Validate against local agronomic guidance before real use.</small></Card>)}</div>
  </div>
}

function Soil() {
  return <div className="page"><PageTop eyebrow="SOIL INTELLIGENCE" title="Read the soil before changing the field" text="Current → ideal → status makes each recommendation traceable."/>
    <div className="grid-3">{[['pH','6.4','6.0–7.0'],['Nitrogen','62 mg/kg','50–80'],['Phosphorus','31 mg/kg','25–45'],['Potassium','44 mg/kg','35–55'],['Moisture','48.2%','45–60%'],['Soil temperature','27.2°C','22–30°C']].map(x=><Card key={x[0]}><div className="stat-label">{x[0]}</div><div className="soil-current">{x[1]} <Badge>Optimal</Badge></div><p>Ideal: <b>{x[2]}</b></p></Card>)}</div>
    <Card className="recommend"><Leaf/><div><h3>Soil Recommendation</h3><p>Demo condition: nutrient levels are inside the configured target ranges. No amendment recommendation is generated.</p><small>In production, recommendation rules must reference a crop-specific agronomic source.</small></div></Card>
  </div>
}

function Disease() {
  const rows=[['Leaf Blight','Moderate','↑','High humidity + wet conditions'],['Powdery Mildew','Low','↓','Current temperature not strongly favourable'],['Root Rot','Low','→','Moisture within target range']]
  return <div className="page"><PageTop eyebrow="DISEASE RISK DETECTION" title="Detect risk signals before visible damage" text="Risk is estimated from environmental conditions; it is not a diagnosis."/>
    <Card><table><thead><tr><th>Disease</th><th>Risk</th><th>Trend</th><th>Why?</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}><td><b>{r[0]}</b></td><td><Badge tone={r[1]==='Moderate'?'amber':'green'}>{r[1]}</Badge></td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody></table></Card>
    <Card className="warning"><ShieldCheck/><div><b>Explainability layer</b><p>Production disease models should expose feature inputs, training source, validation metrics, confidence calibration and known failure modes.</p></div></Card>
  </div>
}

function FarmMap({selectedZone,setSelectedZone}) {
  return <div className="page"><PageTop eyebrow="FARM MAP" title="Zone-level field intelligence" text="A visual farm-zone model. No real satellite or geolocation data is connected in this starter."/>
    <div className="map-layout"><Card className="map-card"><div className="map-toolbar"><Badge>Demo Farm</Badge><span>4 zones</span></div><div className="field-map">{zones.map((z,i)=><button key={z.id} className={`zone z${i+1} ${selectedZone.id===z.id?'selected':''}`} onClick={()=>setSelectedZone(z)}><span>{z.id}</span><small>{z.health}%</small></button>)}</div><div className="map-note"><Map size={15}/> Illustrative zone map — not satellite imagery.</div></Card>
    <Card className="zone-detail"><div className="card-head"><div><h3>Zone {selectedZone.id}</h3><p>{selectedZone.crop}</p></div><Badge tone={selectedZone.risk==='Low'?'green':'amber'}>{selectedZone.risk} risk</Badge></div><div className="zone-stats"><div><span>Crop health</span><b>{selectedZone.health}%</b></div><div><span>Soil moisture</span><b>{selectedZone.moisture}%</b></div><div><span>Temperature</span><b>{selectedZone.temp}°C</b></div></div><div className="zone-action"><b>Recommended action</b><p>{selectedZone.risk==='Low'?'Continue routine monitoring.':'Review moisture and disease indicators within this zone.'}</p></div></Card></div>
  </div>
}

function Analytics() {
  return <div className="page"><PageTop eyebrow="ANALYTICS" title="See trends, not isolated numbers" text="Interactive charts for moisture, temperature, water use and risk progression."/>
    <div className="chart-grid"><ChartCard title="Soil Moisture" subtitle="7-day illustrative trend"><ResponsiveContainer width="100%" height="100%"><LineChart data={[...moistureData,...moistureData.slice(0,0)]}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Line type="monotone" dataKey="value" strokeWidth={2}/></LineChart></ResponsiveContainer></ChartCard>
    <ChartCard title="Temperature" subtitle="Historical illustrative trend"><ResponsiveContainer width="100%" height="100%"><AreaChart data={tempData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Area type="monotone" dataKey="value" fillOpacity={0.1} strokeWidth={2}/></AreaChart></ResponsiveContainer></ChartCard></div>
    <ChartCard title="Disease Risk Progression" subtitle="Illustrative risk index"><ResponsiveContainer width="100%" height="100%"><LineChart data={riskData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Line type="monotone" dataKey="disease" strokeWidth={2}/></LineChart></ResponsiveContainer></ChartCard>
  </div>
}

function Impact({farmSize,setFarmSize,waterUse,setWaterUse,irrigation,setIrrigation,impact}) {
  return <div className="page"><PageTop eyebrow="IMPACT CALCULATOR" title="Quantify resource decisions transparently" text="This calculator demonstrates the interface and formula structure. It does not claim measured savings."/>
    <div className="impact-grid"><Card><h3>Farm inputs</h3><div className="form-stack"><label>Farm size (hectares)<input type="number" min="0.1" value={farmSize} onChange={e=>setFarmSize(Number(e.target.value))}/></label><label>Current water use (L / irrigation event)<input type="number" min="0" value={waterUse} onChange={e=>setWaterUse(Number(e.target.value))}/></label><label>Current irrigation method<select value={irrigation} onChange={e=>setIrrigation(e.target.value)}><option value="traditional">Traditional</option><option value="smart">Smart</option></select></label></div></Card>
    <Card className="impact-output"><Badge tone="blue">Illustrative formula</Badge><div className="impact-number">{impact.potential}<span>L</span></div><p>Potentially avoidable water per event under the demo factor.</p><div className="impact-row"><span>Baseline</span><b>{waterUse} L</b></div><div className="impact-row"><span>Demo smart estimate</span><b>{impact.smart} L</b></div><div className="formula">Demo factor = 18% for Traditional mode. This is a UI placeholder, not evidence of real-world water saving.</div></Card></div>
    <Card><h3>Evidence required for a real impact claim</h3><div className="three-points"><div><b>1. Baseline</b><span>Measured water, cost and yield over a defined period.</span></div><div><b>2. Intervention</b><span>Documented smart-irrigation protocol and comparable conditions.</span></div><div><b>3. Validation</b><span>Replicated measurements with uncertainty and statistical method.</span></div></div></Card>
  </div>
}

function Experiment() {
  const data=[{name:'Water Used',traditional:100,smart:82},{name:'Cost',traditional:100,smart:86},{name:'Health Index',traditional:78,smart:87}]
  return <div className="page"><PageTop eyebrow="EXPERIMENT & VALIDATION" title="Separate measured evidence from demo output" text="Use this section for real control-vs-smart experiments once measurements are collected."/>
    <Card className="experiment-empty"><div className="experiment-icon"><Beaker/></div><h2>Experimental data not connected</h2><p>The project must not invent yield, cost, water-saving or crop-health improvements. Upload verified measurements to populate this section.</p><button className="secondary"><Upload size={16}/> Upload experiment CSV</button></Card>
    <div className="validation-table"><Card><h3>Recommended validation structure</h3><table><thead><tr><th>Parameter</th><th>Control Plot</th><th>Smart Plot</th><th>Evidence</th></tr></thead><tbody>{['Water Used','Yield','Cost','Crop Health'].map(x=><tr key={x}><td><b>{x}</b></td><td>Not provided</td><td>Not provided</td><td><Badge tone="amber">Required</Badge></td></tr>)}</tbody></table></Card></div>
  </div>
}

function Method() {
  const steps=['Data Collection','Data Cleaning','Data Processing','AI / ML Model','Prediction & Risk Analysis','Decision Engine','Farmer Recommendation','Real-world Action','Impact Measurement']
  return <div className="page"><PageTop eyebrow="HOW IT WORKS" title="A traceable decision pipeline" text="The system is designed as a modular loop: data enters, decisions are explained, actions are measured."/>
    <div className="method-flow">{steps.map((x,i)=><div className="method-step" key={x}><div className="method-num">{i+1}</div><div><b>{x}</b><span>{i===0?'Sensors, weather, soil and farm inputs':i===3?'Validated model appropriate to the task':i===6?'Simple, contextual action for the farmer':'Documented processing stage'}</span></div>{i<steps.length-1&&<ArrowRight/>}</div>)}</div>
    <Card className="architecture"><h3>Modular technical architecture</h3><div className="arch-grid">{['React Frontend','Node / Python API','PostgreSQL / Supabase','Python ML Service','IoT / Weather / Soil APIs','Analytics & Export'].map(x=><div key={x}><Zap size={17}/><b>{x}</b><small>Replaceable module</small></div>)}</div></Card>
  </div>
}

function Model() {
  const items=[['Model name','Not selected / not connected'],['Input features','Soil, weather, crop and farm variables'],['Training data','Not provided in this frontend'],['Samples','Not provided'],['Validation','Not performed here'],['Performance metrics','Not available'],['Confidence','Not calculated'],['Limitations','Demo interface only; no validated inference'],['Last update','Not applicable']]
  return <div className="page"><PageTop eyebrow="AI / ML MODEL TRANSPARENCY" title="No invented AI claims" text="Every production model field should be filled from real project evidence."/>
    <Card><table className="model-table"><tbody>{items.map(([a,b])=><tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></Card>
    <div className="grid-3"><Card><Brain/><h3>Explainability</h3><p>Show feature contribution or supporting factors appropriate to the selected model.</p></Card><Card><Microscope/><h3>Validation</h3><p>Report dataset split, metrics, calibration and test conditions.</p></Card><Card><ShieldCheck/><h3>Limitations</h3><p>Document missing data, domain shift, uncertainty and situations where the model should not be used.</p></Card></div>
  </div>
}

function Sources() {
  return <div className="page"><PageTop eyebrow="DATA SOURCES & CITATIONS" title="Trace every external number" text="Replace each placeholder with the exact dataset/API, version, update frequency and limitations used by the project."/>
    <Card><table><thead><tr><th>Data domain</th><th>Source</th><th>Update</th><th>Status</th><th>Limitations</th></tr></thead><tbody>{[['Weather','Not connected','—','Placeholder','API/source must be cited'],['Soil','Not connected','—','Placeholder','Sampling method required'],['IoT sensors','Not connected','—','Placeholder','Calibration + timestamp required'],['Agricultural dataset','Not connected','—','Placeholder','Dataset version + license required'],['Remote sensing','Not connected','—','Placeholder','Provider + acquisition date required']].map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{i===3?<Badge tone="amber">{c}</Badge>:c}</td>)}</tr>)}</tbody></table></Card>
  </div>
}

function About() {
  return <div className="page"><PageTop eyebrow="ABOUT & PRIVACY" title="Built for Bangladesh. Designed for the World." text="A scalable architecture for flood, drought, salinity, water scarcity and crop-risk use cases."/>
    <div className="grid-3"><Card><Globe2/><h3>Global scalability</h3><p>Country, climate, crop and language layers should be configurable instead of hard-coded.</p></Card><Card><ShieldCheck/><h3>Privacy</h3><p>Production deployments should define consent, location privacy, data ownership, retention and secure storage.</p></Card><Card><Recycle/><h3>Responsible impact</h3><p>Measured impact belongs to validated experiments, not interface assumptions.</p></Card></div>
    <Card className="privacy"><h3>Demo data policy</h3><p>Values in this starter are clearly marked as simulation/demonstration data. They should not be presented as live field measurements, real weather readings, verified AI accuracy or experimentally measured impact.</p></Card>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
