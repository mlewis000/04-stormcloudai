"I'm building StormCloud AI — a UK tech & marketing agency website. Brand: dark navy + electric blue (#4D9EFF), modern & techy. Stack: HTML/CSS/JS to start, may move to Next.js. Services: web design, cloud/AWS, AI chatbots, automation, booking widgets, SEO, paid ads, social media, content, brand identity. Tagline: Built for growth. Powered by AI. Target: UK SMEs."



## Claude Requirements
1. Repo for website /Users/martin.lewis/Library/CloudStorage/OneDrive-Accenture/WORK/ML-WORK/ML-GIT/AI/CLAUDE-PROJECTS/04-stormcloudai. All products will have there own repo.
2. Any questions and updates should be updated in CLAUDE.md.
3. Ask any questions you are unsure about grill-me.
4. Focus on Best Practices, Security, Repeatability in using code.


## Decisions Made
- **Layout:** Multi-page (Home, Services, About, Contact)
- **Logo:** CSS/SVG designed (no external asset)
- **Reference sites:** None — free to choose direction
- **Booking widget:** Contact form for now; future = Cal.com self-hosted on AWS (no AI platform needed)

## Infrastructure Roadmap

### Phase 1 — Now (Static Site)
- **Hosting:** AWS S3 + CloudFront
- **Why:** Static HTML/CSS/JS needs no server. S3 stores the files, CloudFront serves them globally with HTTPS and edge caching. Cost: pennies/month.
- **Deployment:** GitHub Actions → build → sync to S3 → invalidate CloudFront cache

### Phase 2 — Next.js Migration
- **Trigger:** When SSR, dynamic routing or API routes are needed
- **Hosting:** AWS App Runner (simpler than ECS — point at container image, handles scaling/HTTPS/load balancing automatically)
- **Why App Runner over ECS here:** Single web app, less ops overhead, still fully containerised
- **Prep:** Dockerise the app locally early so the move is trivial

### Phase 3 — Products & Full Platform
- **Trigger:** When shipping separate products (chatbot platform, client dashboards, booking system, etc.)
- **Hosting:** ECS + Fargate
- **Why:** Multiple containerised services need proper orchestration. Each product lives in its own container/service, each in its own repo (per Claude Requirements).
- **Supporting services:**
  - ALB (Application Load Balancer) — routes traffic to services
  - ECR (Elastic Container Registry) — stores Docker images
  - RDS or DynamoDB — database per product as needed
  - Secrets Manager — credentials and API keys
  - CloudWatch — logging and monitoring
- **Booking widget:** Cal.com self-hosted on Fargate at this stage

### Guiding principles
- Containerise early (Docker locally) even before ECS — makes migration seamless
- Each product = its own repo + its own ECS service
- Website repo stays separate from product repos throughout

## The plan
Lets go one step at a time.
1. Build the website.

### Website pages
1. `index.html` — Home (hero, services overview, why us, CTA)
2. `services.html` — All services with descriptions
3. `about.html` — Mission, values, team
4. `contact.html` — Contact form
5. `css/style.css` — Global styles
6. `js/main.js` — Interactions

