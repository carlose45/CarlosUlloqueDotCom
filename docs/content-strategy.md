# Content Strategy

This document is the source of truth for positioning, keywords, privacy boundaries, and editorial direction for `ulloque.com`.

## Positioning

Carlos Ulloque is positioned as a privacy-aware technical authority in mission critical engineering, security and infrastructure, and product engineering.

Primary positioning statement:

> Carlos Ulloque is a Mission Critical Engineer focused on building reliable systems, securing what matters, and sharing real-world lessons from infrastructure and product engineering.

Supporting themes:

- Reliability under operational pressure
- Security-aware infrastructure design
- Practical product engineering
- Oracle, Exadata, RAC, ZDLRA, Control-M, Cloudflare Access, and client-side encryption experience
- Clear technical writing without exposing sensitive systems or personal data

## Tone Guidelines

The site should sound technical, calm, specific, and understated.

Use:

- concrete engineering language
- field-tested lessons
- architecture and tradeoff framing
- privacy-safe examples
- measured confidence

Avoid:

- influencer language
- unverifiable claims
- generic portfolio filler
- keyword stuffing
- confidential client context
- personal oversharing

## Page Intent Map

| Page        | Primary intent                          | SEO role                                              | Notes                                                        |
| ----------- | --------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| `/`         | Establish identity and authority        | Rank for Carlos Ulloque, Ulloque, Ulloque engineering | Main entity page and internal linking hub                    |
| `/about`    | Explain professional background safely  | Support entity trust and expertise                    | No sensitive personal details                                |
| `/notes`    | Publish technical field notes           | Long-tail technical SEO                               | Notes should be crawlable and MDX-backed                     |
| `/projects` | Present products and engineering work   | Demonstrate practical authority                       | Avoid secrets and private endpoints                          |
| `/labs`     | Show experiments and architecture ideas | Capture exploratory technical topics                  | Clearly mark status and maturity                             |
| `/uses`     | Document tools and workflow             | Support technical credibility                         | Avoid affiliate-style content                                |
| `/cv`       | Reserved private/protected CV route     | No public SEO role                                    | Must remain noindex and should not contain sensitive CV data |
| `/privacy`  | Explain privacy posture                 | Trust and compliance support                          | Created by privacy/security policy issue                     |

## Keyword Map

| Cluster                        | Primary page         | Supporting pages                | Intent                                      |
| ------------------------------ | -------------------- | ------------------------------- | ------------------------------------------- |
| Carlos Ulloque                 | `/`                  | `/about`, `/projects`, `/notes` | Entity lookup                               |
| Ulloque                        | `/`                  | `/about`                        | Brand/name lookup                           |
| Ulloque engineering            | `/`                  | `/projects`, `/labs`            | Professional authority                      |
| Mission critical engineer      | `/`, `/about`        | `/notes`                        | Positioning                                 |
| Security & Infrastructure      | `/`, `/projects`     | `/labs`, `/notes`               | Expertise                                   |
| Product Engineering            | `/`, `/projects`     | `/labs`                         | Builder credibility                         |
| Carlos Ulloque Oracle          | `/notes`, `/about`   | `/projects`                     | Technical authority                         |
| Carlos Ulloque Exadata         | `/notes`             | `/about`                        | Long-tail technical SEO                     |
| Carlos Ulloque Panama          | `/about`             | `/`                             | Location/entity support without oversharing |
| Oracle Exadata troubleshooting | `/notes`             | `/projects`                     | Technical searches                          |
| Oracle RAC infrastructure      | `/notes`             | `/about`                        | Technical searches                          |
| ZDLRA recovery appliance       | `/notes`             | `/labs`                         | Technical searches                          |
| Control-M EM Kafka             | `/notes`             | `/projects`                     | Technical searches                          |
| Cloudflare Access Java JWT     | `/notes`, `/labs`    | `/projects`                     | Security implementation searches            |
| Client-side encrypted systems  | `/projects`, `/labs` | `/notes`                        | Product/security searches                   |

## Internal Linking Strategy

Homepage should link to:

- `/about` for entity/background trust
- `/notes` for technical authority
- `/projects` for proof of work
- `/labs` for active exploration

Notes should link to:

- related notes by topic
- relevant projects or labs
- `/about` only when it naturally supports author/entity context

Projects should link to:

- related notes explaining technical decisions
- related labs if an idea evolved from experimentation
- homepage for entity consolidation

Labs should link to:

- related projects if an experiment becomes productized
- related notes if a concept has a field lesson or tutorial

## Privacy Rules

Never publish:

- phone number
- exact address
- birthdate
- personal IDs
- family details
- private client names unless already public and explicitly approved
- hostnames, IPs, credentials, ticket numbers, screenshots, or logs that identify private systems
- full CV/resume content on a public static route

When writing technical examples:

- sanitize hostnames, domains, paths, user names, and timestamps
- use fictional or generic infrastructure names
- describe architecture patterns without exposing private topology
- prefer lessons learned over incident-specific narratives

## Initial Editorial Backlog

### Notes

1. Exadata datapatch troubleshooting checklist
2. Oracle RAC infrastructure lessons for reliability
3. ZDLRA and OEM last backup visibility issues
4. Control-M EM with Kafka recovery notes
5. Cloudflare Access, Java, and JWT validation patterns
6. Designing client-side encrypted systems without leaking trust to the server

### Projects

1. DontTell: client-side encrypted sharing concept
2. Vault: private secure storage/product architecture concept
3. Cloudflare Access experiments for protected technical workflows

### Labs

1. One-time token access links
2. Zero Trust access patterns for private routes
3. Browser-first encryption UX experiments

## Content Quality Checklist

Before publishing content, verify:

- the page has one clear search/user intent
- title and description are specific
- internal links are intentional
- no sensitive personal or client data is present
- claims are accurate and supportable
- examples are sanitized
- draft status is correct
