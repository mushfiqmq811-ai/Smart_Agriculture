# Smart Agriculture Web Platform

A React + Vite frontend demonstration of an AI/IoT/data-driven agricultural decision-support platform.

## Important data integrity rule

This starter uses **SIMULATION / DEMONSTRATION DATA** only. It does not claim live sensor readings, real AI accuracy, experimental yield gains, or real-world water savings.

Replace simulation data only when verified data, APIs, experiments, datasets, and model documentation are available.

## Local setup

```bash
npm install
npm run dev
```

Build for deployment:

```bash
npm run build
```

## Render

Create a **Static Site**:
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

No backend is required for this frontend demo.

## Next production integrations

- Verified weather API
- Real IoT ingestion endpoint
- Supabase/PostgreSQL
- Python ML service
- Auth + consent
- Verified experiment data
- Dataset/API citations
- Real map/remote-sensing provider

## Architecture

Sensor/Data → Cleaning → Processing → Model → Risk/Decision Engine → Recommendation → Farmer Action → Impact Measurement
