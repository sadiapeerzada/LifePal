# LifePal: System Architecture and Product Reasoning Document

## 1. Executive Summary

### 1.1 Rationale for Existence
LifePal is an advanced clinical support infrastructure designed to fill the acute "clinical silence" that occurs between oncology cycles. In the current healthcare landscape, oncology is a triumph of biological engineering but remains a failure of human continuity. Patients often transition from a high-care hospital environment to a state of high-stakes autonomy at home, where they must navigate complex medication schedules, emotional trauma, and bureaucratic aid systems without real-time guidance.

### 1.2 The Systems Problem
LifePal views oncology support not as a content delivery problem, but as a systems problem. The fundamental challenges—fragmentation of care, data silos, psychological isolation, and regional inequality—cannot be solved by a static application. They require a role-based, intelligent sanctuary that operates with high availability (offline-first) and strict safety interlocks.

### 1.3 Vision and Objective
Developed with technical and clinical guidance from the Department of Radiotherapy at AMU (Aligarh Muslim University), LifePal provides a digital scaffolding that sustains the patient journey. By integrating multimodal AI agents with a local-first persistence model, LifePal ensures that expert-grounded clinical navigation and emotional support are accessible regardless of geographic location or network stability.

---

## 2. Problem Landscape

### 2.1 Fragmentation of Oncology Care
Modern cancer treatment is episodic. When a patient leaves the clinical perimeter of an institution like JNMCH, they become their own primary care coordinator. Fragmented reports, varied prescriptions, and inconsistent symptom logging create a high-friction environment where mistakes in medication or delays in identifying clinical "red flags" are common.

### 2.2 The Emotional Void and "Patient Silencing"
Oncology is as much a psychological crisis as a physiological one. However, patients frequently engage in "emotional silencing"—suppressing fear and pain to shield their families. This lack of a private, non-judgmental outlet accelerates psychological decline, which is clinically proven to negatively impact physical recovery rates.

### 2.3 Caregiver Load and Invisible Burnout
Caregivers are the silent infrastructure of oncology. In many regional contexts, a single family member manages nursing, finance, and logistics while suppressing their own trauma. This "slow-burn" exhaustion often leads to a collapse of the support system, yet it remains unmonitored by traditional EHR (Electronic Health Record) systems.

### 2.4 Pediatric Jargon Trauma
Children undergoing treatment, or children of parents with cancer, suffer from "Jargon Trauma." Cold clinical terms—malignancy, infusion, leukocyte—are terrifying. There is a systemic failure in translating clinical reality into age-appropriate, metaphor-driven narratives that empower pediatric patients rather than intimidating them.

### 2.5 Bureaucratic Friction in Financial Aid
In regions like India, financial aid (Ayushman Bharat, RAN, PMNRF) is available but the bureaucracy required to access it is a secondary trauma. Fragmented information leads to eligible patients failing to receive the aid they desperately need during critical treatment windows.

---

## 3. System Design Philosophy

### 3.1 Role-Based Architecture
The system is polymorphic. It does not provide a single interface; instead, the entire runtime environment—tone, features, and AI behavior—morphs to suit five distinct personas: Adult Patient, Child, Caregiver, Survivor, and Donor. This ensures cognitive and emotional alignment with the user’s specific needs.

### 3.2 Offline-First Healthcare Logic
Oncology patients are frequently in "connectivity bunkers"—radiation-shielded wards or rural districts with inconsistent signals. LifePal treats the network as a transient resource. The local device is the primary source of truth, utilizing IndexedDB and device-level encryption to ensure the sanctuary is always operational.

### 3.3 Dignity and Privacy as Constraints
Privacy is treated as a component of clinical dignity. Sensitive emotional data and clinical journals remain on the local device by default. System trust is built on a "Need-to-Know" data minimization strategy.

### 3.4 AI as Assistance, Not Authority
LifePal follows the "Companion-Navigator" model. AI agents are prohibited from diagnosing or prescribing. They are designed to explain, summarize, mirror, and alert, always operating within the grounding of institutional protocols (AMU Radiotherapy).

---

## 4. User Roles and Trust Levels

### 4.1 The Patient (High-Trust, Sensitive Data)
The patient persona assumes the highest level of data sensitivity. The system provides clinical navigation tools, document interpretation, and emotional mirroring.

### 4.2 The Child (Empowered, Safe-Boundaries)
Interaction is metaphoric and gamified. The trust level is high but restricted from clinical or financial stressors. All interactions are summarized for the guardian.

### 4.3 The Caregiver (Strategic, Load-Bearing)
The caregiver acts as the system administrator for the family. They have visibility over patient logs and their own "Resilience Capacity" monitors.

### 4.4 The Survivor (Long-Term Vigilance)
Focus shifts from cytotoxic treatment support to long-term surveillance and psychological thriving. Trust is centered on pattern recognition and peace of mind.

### 4.5 The Donor (Transparent, Impact-Oriented)
Donors interact with an anonymized, high-level impact layer. They have zero access to PII (Personally Identifiable Information), ensuring patient dignity while providing financial transparency.

---

## 5. High-Level System Architecture

### Diagram 1: Platform Overview

**Textual Layout:**
```text
[ USER TIER ]
    |--- User Mobile/Web Devices (PWA)
    |--- Offline Persistence (IndexedDB)
    |
[ GATEWAY TIER (SECURE PROXY) ]
    |--- Vercel Edge Functions
    |--- Request Sanitization (Prompt Injection Guard)
    |--- Managed Identity Resolver
    |
[ AI ORCHESTRATION TIER ]
    |--- Multi-Agent Dispatcher (Gemini 3 Pro)
    |--- Grounding Engine (Google Search/Maps API)
    |--- Institutional Protocol Database (RAG)
    |
[ CLOUD INFRASTRUCTURE ]
    |--- Azure Blob Storage (Encrypted Binaries)
    |--- Microsoft Key Vault (Secret Rotation)
    |--- Aggregated Analytics (Cosmos DB)
```

**Responsibilities:**
- **User Tier:** Executes the UI/UX and maintains the local clinical ledger.
- **Gateway Tier:** Acts as a high-security air-gap between client devices and AI models, handling authentication and PII redaction.
- **AI Orchestration Tier:** Routes queries to specialized agents and ensures all responses are grounded in clinical protocol.
- **Cloud Infrastructure:** Provides highly compliant archival storage and master secret management.

**Data Flow:**
1. User requests a document summary.
2. The Gateway Tier redacts the user's name and hospital ID.
3. The AI Orchestration Tier compares the document against AMU protocols.
4. The response is returned and cached locally for offline retrieval.

---

## 6. Client-Side Architecture

### Diagram 2: Frontend & Offline Storage Model

**Textual Layout:**
```text
[ REACT APP ROOT ]
    |--- [ NAVIGATION GUARD ] (Role-based state)
    |--- [ STATE PROVIDER ] (React Context + Hooks)
    |
[ PERSISTENCE LAYER ]
    |--- [ SYNC MANAGER ] (Eventual Consistency Logic)
    |--- [ INDEXEDDB ENGINE ] (Local Source of Truth)
    |       |--- Clinical Logs
    |       |--- Document Blobs
    |       |--- AI Response Cache
    |
[ DEVICE ENCLAVE ]
    |--- AES-256 Encryption Keys
    |--- User LifePal PIN
```

**Functionality:**
- **IndexedDB:** Chosen for its multi-gigabyte capacity, allowing for high-res medical report storage offline.
- **Sync Manager:** Monitors `navigator.onLine` and manages a background queue of pending updates.
- **UX Resilience:** If a network call fails, the UI optimistically updates the local DB and notifies the user that sync is pending.

---

## 7. Offline Synchronization Model

### Diagram 3: Offline Queue & Sync Flow

**Textual Layout:**
```text
[ USER ACTION ]
    |
    v
[ APPEND-ONLY LEDGER ] (IndexedDB Event Store)
    |
    v
[ SYNC WORKER ] <--- (Background Process)
    |
    |-- [ IF OFFLINE ] ---> [ WAIT FOR EVENT: 'online' ]
    |-- [ IF ONLINE ] ----> [ ATOMIC BATCH PUSH ]
                                |
                                v
                        [ CONFLICT RESOLUTION ]
                                |--- Vector Clocks
                                |--- Causal Consistency
```

**Reasoning:**
Oncology data integrity is critical. A "Last-Write-Wins" model is insufficient for symptom logs. LifePal uses a Causal Chain model where every clinical entry is immutable once synced, and updates are tracked as new ledger entries.

---

## 8. AI Agent Architecture

### Diagram 4: Multi-Agent AI System (Orchestrator-Worker Model)

**Textual Layout:**
```text
[ INTENT ORCHESTRATOR ] (Gemini 3 Pro)
    |
    |--- [ CLARIFIER AGENT ] (Navigator)
    |       |-- Scope: Medical Reports / Protocols
    |
    |--- [ COMPANION AGENT ] (Buddy)
    |       |-- Scope: Emotional mirroring / Meditation
    |
    |--- [ HERO AGENT ] (Pediatric)
    |       |-- Scope: Metaphoric Storytelling / Quests
    |
    |--- [ DISCOVERY AGENT ] (Aid & Schemes)
    |       |-- Scope: Regional Government Schemes / NGO Aid
```

**Isolation:**
Agents operate within "Safe-Context Windows." The **Hero Agent** has zero access to the financial status of the family, ensuring the child is protected from parent-level stressors. The **Clarifier Agent** cannot offer emotional support; if sadness is detected, the Orchestrator hand-offs to the **Companion Agent**.

---

## 9. AI Safety & Guardrails

### Diagram 5: AI Safety & Escalation Flow

**Textual Layout:**
```text
[ AGENT OUTPUT ]
    |
    v
[ SAFETY GATEWAY ] (Regex + Classifier Pass)
    |
    |-- [ DETECTED: DIAGNOSIS ATTEMPT ] ---> [ REDIRECT: 'Contact Oncologist' ]
    |-- [ DETECTED: DOSAGE CHANGE ] --------> [ BLOCK: 'Consult clinical team' ]
    |-- [ DETECTED: CRISIS SIGNALS ] -------> [ ACTION: EMERGENCY SOS ACTIVATION ]
    |
[ CONFIDENCE SCORING ] (Low Confidence?)
    |
    v
[ SAFE PIVOT ] ("I am unsure, let's ask your doctor.")
```

**Rigorous Constraints:**
1. **Diagnosis Wall:** Hard blocks on prompts containing "Do I have cancer?"
2. **Dosage Guard:** Refusal to interpret numerical dosage shifts.
3. **Fail-Closed:** If the AI confidence falls below 0.85 on protocol accuracy, the system refuses the answer and directs the user to the JNMCH helpdesk.

---

## 10. Data Architecture

### Diagram 6: Data Storage & Flow

**Textual Layout:**
```text
[ TIER A: TRANSIENT ] (Memory / LocalStorage)
    |-- Session UI State
    
[ TIER B: SENSITIVE LOCAL ] (IndexedDB)
    |-- Mood History
    |-- Personal Journal
    |-- (Encrypted via Device Key)
    
[ TIER C: COMPLIANT CLOUD ] (Azure Blob Storage)
    |-- Redacted PDF Reports
    |-- Med Scanner Images
    |-- (Encrypted at Rest)
```

**Breach Containment:**
PII (Name/Address) is separated from clinical metadata. If Tier C is compromised, the data is useless without the identity keys stored exclusively in Tier B (on the user's device).

---

## 11. Secrets & Trust Zones

### Diagram 7: Secrets Management & Trust Boundaries

**Textual Layout:**
```text
[ TRUST ZONE 1: PUBLIC ]
    |-- Static Assets / CSS
    
[ TRUST ZONE 2: AUTHENTICATED CLIENT ]
    |-- User Role Identity
    |-- Local AES Key
    
[ TRUST ZONE 3: CLOUD GATEWAY ]
    |-- Azure Key Vault Connection
    |-- Secret Rotation Loop
```

**Managed Identity:**
LifePal utilizes Azure Managed Identity. The application code never handles the Gemini API Key directly; it requests a short-lived bearer token from the identity provider, significantly reducing the blast-radius of a source-code leak.

---

## 12. Pediatric Interaction Flow

### Diagram 8: Child-Safe AI Interaction Sequence

**Textual Layout:**
```text
[ CLINICAL REALITY ] (e.g., Chemotherapy)
    |
    v
[ METAPHORIC TRANSLATOR ] (Gemini 3 Flash)
    |--- "Drinking Magic Juice to power up the shield."
    |
[ GUARDIAN INTERLOCK ] (Reviewer)
    |--- Summarizes interaction for parent dashboard.
    |
[ HERO HQ DISPLAY ]
    |--- Gamified Quest Card
```

**Session Boundaries:**
Pediatric sessions have a "Hard-Stop" after 15 minutes to prevent digital fatigue and ensure that real-world interaction with caregivers remains the primary care vector.

---

## 13. Caregiver Burnout Signal Flow

### Diagram 9: Non-Invasive Burnout Detection

**Textual Layout:**
```text
[ SIGNAL A: LOG FREQUENCY ] (Are they skipping logs?)
[ SIGNAL B: SENTIMENT TREND ] (Using words of exhaustion?)
[ SIGNAL C: SLEEP METRICS ] (Harmony wearable data)
    |
    v
[ RESILIENCE AGGREGATOR ]
    |
    v
[ ACTION THRESHOLDS ]
    |-- [ < 40% CAPACITY ] --> [ ALERT: 'Hand-off one task today' ]
    |-- [ < 10% CAPACITY ] --> [ ACTION: ACTIVATE BACKUP NETWORK ]
```

**Philosophy:**
Detection is non-medical. It is a social safety net designed to preserve the "Anchor" of the family care unit.

---

## 14. Survivor Lifecycle Support

### Diagram 10: Post-Treatment Support Flow

**Textual Layout:**
```text
[ REMISSION ONBOARDING ]
    |
    v
[ VIGILANCE CYCLE ] (Monthly AI-led check-in)
    |
    v
[ TREND MONITORING ] (Are minor symptoms aggregating?)
    |
    v
[ PEACE OF MINDR REPORT ] (Summary for 6-month oncology visit)
```

**Boundaries:**
The system distinguishes between "Aging Symptoms" and "Recurrence Markers," grounding responses in survivorship protocols provided by AMU.

---

## 15. Technology Stack Justification

### 15.1 React & PWA
Selected for high-performance UI rendering and the ability to package the application as a Progressive Web App (PWA). This bypasses app store friction and allows for true offline operation on mobile devices.

### 15.2 IndexedDB
Traditional `localStorage` is capped at 5MB. Oncology reports are often high-resolution PDFs. IndexedDB provides a structured, high-capacity local database essential for a local-first medical record.

### 15.3 Azure Infrastructure
Azure was chosen for its mature healthcare compliance frameworks (HIPAA/GDPR readiness) and the seamless integration of Microsoft Key Vault for managing sensitive model keys.

### 15.4 Google Gemini (Multimodal)
Gemini 3 series is the only model currently capable of processing Native Audio, high-fidelity Vision (Med-Scanner), and complex reasoning within a single 1M-token context window. This allows for "Longitudinal Awareness"—the AI remembers the patient's history across months of care.

---

## 16. Ethical AI Constraints

1. **Safety over Capability:** LifePal would rather refuse an answer than hallucinate a clinical outcome.
2. **AI Humility:** The system explicitly states its limitations. It is a "Cognitive Assistant," not a clinical authority.
3. **No Persuasion:** The AI is prohibited from persuading patients to undergo specific clinical trials or choose specific private hospitals; it only presents verified aid schemes and institutional protocols.

---

## 17. Scalability & Evolution

### 17.1 Modular Expansion
The Role-Based architecture is modular. Future versions can add roles for "Community Volunteers," "Palliative Nurses," and "Physiotherapists."

### 17.2 Hospital Systems Integration
While currently standalone, the architecture is FHIR-ready (Fast Healthcare Interoperability Resources), allowing for future direct ingestion of lab results from hospital EHR systems.

### 17.3 10-Year Vision
LifePal aims to become the standard infrastructure for "Human-Continuity Care" in chronic diseases, extending beyond oncology into cardiology and autoimmune support.

---

## 18. Known Limitations

- **Multimodal Latency:** Deep clinical reasoning can take 3-5 seconds. The system trades speed for protocol accuracy.
- **Hardware Dependency:** As a local-first app, if a user loses their phone without a cloud-backup enabled, their local logs are lost. This is a deliberate tradeoff to preserve maximum privacy.
- **Language Nuance:** While AI supports Hindi and Telugu, highly localized regional dialects may still result in standard language outputs.

---

## 19. Contribution Philosophy

Contributors to LifePal are expected to adhere to the "Sanctuary Code of Conduct." This means prioritizing user dignity, clinical safety, and data privacy above all else. We welcome contributions in AI safety research, pediatric psychology metaphors, and regional language localization.

---

## 20. Final Vision Statement

LifePal is built for the **2:00 AM moment**. It is for the father in Aligarh staring at a report he doesn't understand. It is for the mother who is too exhausted to remember the next dosage. It is for the child who is scared of the "magic juice" that makes them feel sick. We believe that by combining the rigor of oncology with the warmth of intelligent companionship, we can ensure that while the battle against cancer is hard, no one has to fight it in the dark.

**Stay Brave. Logic is our Weapon, Compassion is our Shield.**
