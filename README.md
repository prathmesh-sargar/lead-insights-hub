# AI Lead Generation & Outreach Automation Platform


<img width="1460" height="480" alt="Dashboard Screenshot" alt="Screenshot 2026-03-12 211422" src="https://github.com/user-attachments/assets/22c7c1a0-629b-4a48-804c-fa5f194996e4" />



An **automation platform for discovering business leads, extracting contact information, and executing personalized outreach campaigns** using workflow orchestration and AI-driven messaging.

The system integrates **lead discovery, contact enrichment, multi-channel outreach, reply detection, and follow-up automation** into a single automated pipeline.

This platform eliminates manual prospecting by turning **unstructured business listings into structured CRM leads** and automatically managing communication with potential clients.

---

# Problem

Businesses often spend **hours manually searching for leads**, collecting contact information, and sending outreach messages.

Traditional process:

```
Search businesses → open websites → copy emails → send outreach → track replies → follow up manually
```

This approach is:

* time consuming
* repetitive
* difficult to scale
* prone to human error

---

# Solution

This project automates the entire workflow:

```
Lead Discovery
      ↓
Website Scraping
      ↓
Email Extraction
      ↓
Lead Enrichment
      ↓
CRM Storage
      ↓
AI-Personalized Outreach
      ↓
Reply Detection
      ↓
Follow-Up Automation
      ↓
Analytics Dashboard
```

The result is a **fully automated outbound lead generation system**.

---

# System Architecture

The platform consists of multiple automation layers:

```
User Search Input
        ↓
Google Maps Discovery (Serper API)
        ↓
Business Metadata Extraction
        ↓
Website Scraping
        ↓
Email Extraction & Data Normalization
        ↓
Lead Enrichment & Deduplication
        ↓
Google Sheets CRM
        ↓
Outreach Automation Engine
     ↙            ↘
Email Channel    WhatsApp Channel
     ↓                 ↓
Reply Listener System
     ↓
Follow-Up Automation
     ↓
Analytics Dashboard
```

---

# Core Workflows

The system is composed of **three main automation pipelines**.

---

## 1️⃣ Lead Generation Workflow

Automates discovery and enrichment of business leads.

Pipeline steps:

* Search Google Maps using **Serper API**
* Fetch multi-page business results
* Extract business metadata (name, address, website, phone)
* Scrape business websites
* Extract emails using regex
* Normalize phone numbers
* Clean domains
* Deduplicate leads using domain/phone keys
* Store leads in **Google Sheets CRM**

This workflow converts **unstructured web data into a structured lead database**.

---

## 2️⃣ Auto Reply Engine

Handles automated outreach and communication tracking.

Capabilities:

* Channel decision logic (Email or WhatsApp)
* AI-generated personalized messages
* Email sending using **Gmail API**
* WhatsApp messaging using **WhatsApp API**
* CRM updates after message delivery
* Status tracking for campaigns

This ensures every discovered lead receives **automated yet personalized communication**.

---

## 3️⃣ Follow-Up Automation Engine

Maintains consistent communication with prospects.

Automation steps:

* Scheduled trigger scans CRM
* Detects leads requiring follow-up
* Generates follow-up emails automatically
* Sends follow-up messages
* Updates follow-up counters
* Records next contact date

This prevents leads from being lost due to missed follow-ups.

---

# Key Features

* Automated business lead discovery
* Website scraping and contact extraction
* Email extraction using regex
* Lead enrichment and deduplication
* Multi-channel outreach (Email + WhatsApp)
* AI-personalized messaging
* Reply detection and CRM updates
* Automated follow-up scheduling
* Analytics dashboard for outreach insights

---

# Tech Stack

| Layer               | Technology              |
| ------------------- | ----------------------- |
| Workflow Automation | n8n                     |
| Backend Logic       | Node.js                 |
| AI Personalization  | OpenAI API              |
| Lead Discovery      | Serper API              |
| Messaging           | Gmail API, WhatsApp API |
| CRM                 | Google Sheets           |
| Analytics           | Custom Dashboard        |

---

# Lead Generation Dashboard

### Analytics Dashboard

<img width="1614" height="502" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/21dbafaf-f4e2-486f-ad3b-52d4a07b3eca" />

<img width="1679" height="679" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/20b21429-9c18-4eb2-8b2e-360c57477e63" />

<img width="1730" height="710" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/4bcf8ff7-4bac-4948-bcd1-af2a1bec6298" />

<img width="1919" height="1052" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/784e9c80-4015-47d1-a89b-e2a983d0d2af" />

---

### CRM Lead Management

<img width="397" height="951" alt="Lead CRM Screenshot" src="https://github.com/user-attachments/assets/5ae6adbd-a134-4d84-84c4-4ff589bb51a0" />

<img width="671" height="918" alt="Lead CRM Screenshot" src="https://github.com/user-attachments/assets/b6d94fd5-7dd3-4d31-9001-0058cdeb8922" />

---

### Workflow Automation Overview

<img width="1462" height="452" alt="Automation Workflow" src="https://github.com/user-attachments/assets/05d88b4f-df3c-4ce7-b27e-db92276cbc9f" />

---

# Results

The automation system significantly reduces manual effort in lead generation workflows.

Key improvements:

* ~70% reduction in manual prospecting time
* automated outreach execution
* centralized lead tracking
* consistent follow-up communication
* scalable outbound lead generation

---

# Future Improvements

* CRM migration from Google Sheets to PostgreSQL
* campaign analytics improvements
* lead scoring using AI models
* automated A/B testing for outreach messages
* webhook integrations for additional communication channels

---

# License

This project is for educational and experimental purposes. Use responsibly when interacting with external platforms and APIs.

---
