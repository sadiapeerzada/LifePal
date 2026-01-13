# LifePal: Architectural Blueprint and System Documentation

## 1. Executive Summary

### 1.1 Vision
LifePal is conceived as a foundational piece of social-clinical infrastructure designed to fill the acute void that exists between formal hospital discharge and the reality of home-based recovery. In the context of oncology, this void—often referred to as the "clinical silence"—is where patient outcomes frequently degrade due to psychological isolation, caregiver fatigue, and logistical fragmentation. LifePal envisions a world where every oncology patient, regardless of their geographic location or socioeconomic status, has access to a 24/7 intelligent sanctuary that provides grounded clinical navigation, empathetic companionship, and logistical support.

### 1.2 Mission
Our mission is to democratize expert-grade oncology support through the deployment of role-specific AI agents and an offline-first architectural philosophy. By grounding our intelligence in the clinical protocols of the Department of Radiotherapy at AMU (Aligarh Muslim University), we aim to provide a high-trust digital environment that respects the dignity of the patient, the resilience of the caregiver, and the innocence of the child.

### 1.3 The Rationale for Existence
Modern oncology is a triumph of biological engineering, yet it remains a failure of human continuity. The current healthcare paradigm assumes that patients have the cognitive bandwidth to manage complex drug interactions, navigate bureaucratic aid schemes, and maintain emotional equilibrium while undergoing cytotoxic treatments. LifePal exists because the burden of "being a patient" has become too heavy for the human alone to carry. We provide the "digital scaffolding" necessary to sustain the oncology journey from diagnosis through survivorship.

---

## 2. Problem Landscape

### 2.1 The Fragmentation of Home-Based Care
Oncology treatment is episodic (chemotherapy cycles, radiotherapy sessions), but the disease is continuous. When a patient leaves the clinical perimeter, they become their own primary care coordinator. Fragmented documentation, lack of access to real-time clinical clarification, and the complexity of symptom management create a high-friction environment that often leads to sub-optimal compliance and avoidable emergency admissions.

### 2.2 The Emotional Void and "Patient Silencing"
Cancer is a socially isolating event. Patients frequently engage in "emotional silencing"—suppressing their fear and pain to protect their family members from further distress. This creates a feedback loop of internal trauma. Traditional support groups are often inaccessible or overwhelming. There is a critical need for a private, non-judgmental space where patients can process their reality without the fear of being a burden.

### 2.3 The Invisible Crisis: Caregiver Exhaustion
Caregivers are the silent backbone of the oncology system. In many regional contexts, a single family member manages nursing tasks, financial logistics, and household maintenance. This "invisible burnout" is a leading cause of home-care collapse. Current digital health solutions ignore the caregiver’s psychological state, treating them merely as a data-entry point rather than a secondary patient requiring support.

### 2.4 Pediatric Trauma and Jargon Confusion
Children undergoing treatment, or children of parents with cancer, suffer from "Jargon Trauma." The cold, clinical language of oncology—malignancy, leukocyte, infusion—is terrifying to a child. The lack of age-appropriate, metaphor-driven communication leads to fear-based resistance to treatment.

### 2.5 Regional Inequality and Aid Bureaucracy
In countries like India, financial aid exists (Ayushman Bharat, RAN, PMNRF), but the bureaucracy required to access it is a secondary trauma. Regional inequality is exacerbated by the "Information Gap." Patients in metropolitan centers have social workers; patients in regional Aligarh or rural districts have to navigate the paperwork alone.

---

## 3. LifePal Solution Overview

### 3.1 Role-Based Sanctuary Design
LifePal does not provide a single interface. It provides a specialized environment for five distinct personas. Upon onboarding, the entire system—tone, features, and AI behavior—morphs to suit the specific needs of the user. This ensures that a 7-year-old child and a 45-year-old caregiver never see the same interface, respecting their unique cognitive and emotional requirements.

### 3.2 Offline-First Healthcare Logic
Recognizing that many oncology wards are "connectivity bunkers" and that regional patients may have inconsistent internet access, LifePal utilizes an advanced synchronization model. All critical data—medication logs, symptom shifts, and personal journals—are stored locally and encrypted on the device, ensuring the sanctuary is available even in the absence of a network.

### 3.3 Dignity and Privacy as System Constants
LifePal operates on a principle of data sovereignty. Personal journals and emotional check-ins remain on the local device by default. Cloud synchronization is an opt-in feature for institutional support, ensuring that the patient's most vulnerable moments are never commodified or exposed.

---

## 4. User Personas

### 4.1 Adult Patient: Ramesh (Age 52)
*   **Profile:** Diagnosed with Stage III Colorectal Cancer. Undergoing chemotherapy at JNMCH.
*   **Emotional State:** High anxiety regarding financial stability; "Chemo-brain" causing memory lapses.
*   **Daily Pain Point:** Forgetting if he took his morning anti-emetic; struggling to understand his latest blood report.
*   **LifePal Fit:** Ramesh uses the **Doc Intel Vault** to store his reports. He uses the **Navigator** to identify which government scheme covers his next cycle.

### 4.2 Child Patient: Zoya (Age 8)
*   **Profile:** Undergoing treatment for Leukemia.
*   **Emotional State:** Terrified of the "heavy needles"; misses school and her friends.
*   **Daily Pain Point:** Refusing to eat because food "tastes like metal" (a common side effect).
*   **LifePal Fit:** Zoya enters **Hero HQ**. Her medicine is a "Magic Potion" for her character. She earns stickers for drinking water, turning her clinical struggle into a quest for "Magic Energy."

### 4.3 Caregiver: Anita (Age 45)
*   **Profile:** Spouse of an oncology patient. Primary breadwinner and home-nurse.
*   **Emotional State:** Operating on 4 hours of sleep; suppressing her own grief to "stay strong."
*   **Daily Pain Point:** Managing the schedule of three different doctors and two sets of labs.
*   **LifePal Fit:** Anita uses the **Caregiver Dashboard** to monitor her own burnout levels. The AI suggests when she needs to activate her "Backup Care Circle."

### 4.4 Survivor: Vikram (Age 60)
*   **Profile:** Two years post-remission from Prostate Cancer.
*   **Emotional State:** "Scanxiety"—fear of recurrence with every minor physical symptom.
*   **Daily Pain Point:** Losing touch with the oncology team; feeling abandoned post-treatment.
*   **LifePal Fit:** Vikram uses the **Survivors Hub** for long-term vigilance. He logs minor symptoms, and the AI filters normal aging from potential clinical "Red Flags."

### 4.5 Donor: The Alig Alumnus
*   **Profile:** Professional living abroad, wishing to support his home community in Aligarh.
*   **Emotional State:** Desires impact but distrusts traditional charity overheads.
*   **Daily Pain Point:** Not knowing if his donation actually bought medicine or just paid for administration.
*   **LifePal Fit:** He uses the **Impact Hub** to see real-time, anonymized data on how many "Hero Cycles" were funded this month at JNMCH through his support.

---

## 5. High-Level System Architecture

### Diagram 1: Platform Ecosystem Architecture

```text
[ USER TIER ]
      |
      +--- [ MOBILE/WEB CLIENT ] (React/Vite)
      |         |
      |         +--- [ OFFLINE ENGINE ] (IndexedDB / Sync Manager)
      |
[ GATEWAY TIER ] (Edge Network / Vercel Functions)
      |
      +--- [ SECURE API PROXY ]
      |         |
      |         +--- [ REQUEST SANITIZER ] (Prompt Injection Guard)
      |         +--- [ CONTEXT INJECTOR ] (AMU Protocols / User Role)
      |
[ INTELLIGENCE TIER ] (Google Gemini Ecosystem)
      |
      +--- [ GEMINI 3 PRO ] (Complex Reasoning / Doc Analysis)
      |
      +--- [ GEMINI 3 FLASH ] (Real-time Chat / Navigation)
      |
      +--- [ GEMINI 2.5 FLASH AUDIO ] (Companion Voice)
      |
[ PERSISTENCE & SECURITY TIER ]
      |
      +--- [ AZURE BLOB STORAGE ] (Encrypted Medical Docs)
      |
      +--- [ AZURE KEY VAULT ] (Master Secret Management)
```

### 5.1 Architecture Logic
The architecture is designed for "Graceful Degradation." The User Tier contains the entire application logic and local database, allowing the UI to remain functional even when disconnected from the Gateway Tier. The Gateway Tier acts as a high-security proxy, ensuring that no client-side code interacts directly with AI models or storage buckets, preventing API key exposure.

### 5.2 Trust Boundaries
There is a hard trust boundary between the **Mobile Client** and the **Intelligence Tier**. No sensitive patient identifiers (names, SSNs) are ever sent to the AI models. The Gateway Tier redacts personal info and replaces it with a temporary `SessionUUID`, maintaining absolute patient anonymity in the cloud.

---

## 6. Frontend Architecture

### Diagram 2: Client-Side Structural Model

```text
[ REACT APP ROOT ]
      |
      +--- [ ROUTING LAYER ] (Role-Based Route Protection)
      |
      +--- [ STATE ORCHESTRATOR ] (React Context / Hooks)
      |         |
      |         +--- [ PROFILE STATE ] (User Persona / Level / XP)
      |         +--- [ CLINICAL STATE ] (Meds / Symptoms / Reports)
      |
      +--- [ PERSISTENCE LAYER ]
      |         |
      |         +--- [ SYNC SERVICE ] (Eventual Consistency Logic)
      |         +--- [ INDEXED-DB ] (Local Clinical Archive)
      |
      +--- [ UI ATOMS ] (Tailwind CSS / Lucide Icons)
```

### 6.1 Component Hierarchy
The UI is built using a "Polymorphic Component" pattern. The `Dashboard` component, for instance, does not render a fixed layout. Instead, it queries the `ProfileState` and injects the corresponding `RoleModule`. This reduces code duplication while ensuring that the visual experience for a Child (whimsical, large targets) and a Doctor (data-dense, high-contrast) are distinct.

### 6.2 Local Storage Strategy
We avoid `LocalStorage` for clinical data due to its 5MB limit and lack of binary support. `IndexedDB` is used to store medical report blobs (PDFs/Images) and complex JSON objects for symptom history, providing a robust offline archive that can scale to gigabytes if necessary.

---

## 7. Offline-First Sync Architecture

### Diagram 3: Event-Ledger Sync Flow

```text
[ USER ACTION ] (e.g., Log Symptom)
      |
      v
[ LOCAL EVENT QUEUE ] (Append-only Ledger in IndexedDB)
      |
      v
[ SYNC MANAGER ] <--- [ NETWORK OBSERVER ] (navigator.onLine)
      |
      +--- [ IF ONLINE ] ---> [ ATOMIC BATCH PUSH ] ---> [ CLOUD GATEWAY ]
      |                                                     |
      |                                                     v
      |                                              [ CONFLICT CHECK ]
      |                                                     |
      +--- [ IF OFFLINE ] <---------------------------------+
      |
[ UI OPTIMISTIC UPDATE ] (Immediate visual confirmation)
```

### 7.1 Conflict Resolution Logic
LifePal uses a "Last-Write-Wins" strategy for UI preferences, but a "Causal Chain" (Vector Clocks) for clinical logs. If a caregiver and a patient update the same symptom log from different devices while offline, the Sync Manager merges the entries chronologically, ensuring no medical data point is overwritten.

---

## 8. AI Agent Architecture

### Diagram 4: Multi-Agent Specialization Model

```text
[ ORCHESTRATOR ] (Gemini 3 Pro)
      |
      +--- [ NAVIGATOR AGENT ] (Specialization: Clinical Logistics)
      |         |--- Reads: AMU Protocols / User Reports
      |         |--- Goal: Generate Roadmap
      |
      +--- [ COMPANION AGENT ] (Specialization: Empathy)
      |         |--- Reads: Mood History / Sentiment Logs
      |         |--- Goal: Therapeutic Mirroring
      |
      +--- [ HERO BUDDY ] (Specialization: Pediatrics)
      |         |--- Reads: Child Level / XP / Tasks
      |         |--- Goal: Metaphorical Gamification
```

### 8.1 Agent Isolation
Each agent is provided with a distinct "System Prompt Envelope." The **Hero Buddy** has zero access to the financial aid discovery logic, ensuring that child-facing interactions remain whimsical and free from the stress of clinical costs.

### 8.2 Role Boundaries
The **Navigator Agent** is restricted from providing emotional support. If a user expresses deep sadness during a navigation session, the **Orchestrator** detects the sentiment shift and hands the conversation state over to the **Companion Agent**.

---

## 9. AI Safety & Guardrail Architecture

### Diagram 5: Clinical Guardrail Interlocks

```text
[ USER QUERY ]
      |
      v
[ SAFETY GATEWAY ] (Hardcoded Regex + LLM Classifier)
      |
      +--- [ TRIGGER: "IS THIS CANCER?" ] ---> [ ACTION: BLOCK + ESCALATE ]
      |
[ CONFIDENCE SCORING ] (Is the AI sure about the protocol?)
      |
      +--- [ SCORE < 0.9 ] ---> [ ACTION: REDIRECT TO CLINICIAN ]
      |
[ OUTPUT FILTRATION ] (Post-processing for dosage/diagnosis)
      |
      v
[ USER RESPONSE ]
```

### 9.1 Hallucination Prevention
We utilize "Grounding via Citation." The AI is instructed to never generate a protocol explanation without citing a document in the `Vault` or an `Official Scheme`. If no grounded data is found, the agent must state: "I am unable to verify this with the AMU Radiotherapy guidelines. Please consult your nurse."

### 9.2 The "Diagnosis Wall"
LifePal has a hardcoded refusal mechanism for any diagnostic queries. If the AI detects an attempt to seek a diagnosis, it immediately triggers the "Safe Pivot" protocol: "I am an information companion, not a doctor. I have added 'Discuss physical change' to your next appointment list. Here is the JNMCH desk number: 0571-2700921."

---

## 10. Data Architecture & Storage

### Diagram 6: Tiered Storage Model

```text
[ LOCAL STORAGE ] (Personal Sanctuary)
      |--- Mood History
      |--- Personal Journal
      |--- Symptom Logs
      |--- (Encrypted on Device)
      
[ AZURE BLOB STORAGE ] (Institutional Archive)
      |--- PDF Reports
      |--- Med Scan Images
      |--- (Encrypted at Rest / PII Redacted)

[ AGGREGATED DB ] (Impact Analytics)
      |--- Support Stats (Anonymized)
      |--- Scheme Usage Patterns
      |--- (No PII / GDPR Compliant)
```

### 10.1 Data Minimization
LifePal operates on a "Need-to-Know" basis. The platform does not collect social security numbers, government IDs (unless for scheme application), or addresses. The user's identity is an anonymized `SanctuaryKey` generated upon account creation.

---

## 11. Security & Secrets Management

### Diagram 7: Trust Zone Isolation

```text
[ ZONE 1: PUBLIC ]
      |--- Static Landing Page
      |--- Transparency Hub

[ ZONE 2: LOCAL PRIVACY ]
      |--- User Bio-Metrics
      |--- Key Store (Enclave)

[ ZONE 3: CLOUD INTELLIGENCE ]
      |--- Azure Key Vault (Key Rotation)
      |--- Gemini Safety Filters
```

### 11.1 Key Rotation and Vaulting
We use **Azure Key Vault** with Managed Identities. The application never "sees" the Gemini API Key. Instead, it requests a short-lived token from the identity provider, significantly reducing the blast radius of a potential codebase leak.

---

## 12. Pediatric Experience Architecture

### Diagram 8: Metaphoric Transformation Logic

```text
[ CLINICAL EVENT ] (Chemotherapy)
      |
      v
[ TRANSLATION LAYER ] (Gemini 3 Flash)
      |
      v
[ METAPHORIC OUTPUT ] ("Drinking Magic Juice to power up your Shield")
      |
      v
[ GAMIFIED ACTION ] (XP Reward + New Badge)
```

### 12.1 Child Safety
Pediatric accounts have a "Guardian Interlock." All AI interactions are summarized for the parent in the Caregiver Dashboard, ensuring that the child is receiving helpful, age-appropriate guidance.

---

## 13. Caregiver Burnout Detection Model

### Diagram 9: Resilience Signal Analysis

```text
[ INPUT SIGNALS ]
      |--- Log Frequency
      |--- Sentiment of Journal
      |--- Sleep Metrics (if synced)
      
[ AGGREGATION ENGINE ]
      |--- Resilience Score (1-100)
      
[ ACTION THRESHOLDS ]
      |--- < 20: Mandatory Alert to Backup Circle
      |--- < 50: Suggest Task Hand-off
```

---

## 14. Survivor Lifecycle Architecture

### Diagram 10: Vigilance Monitoring Flow

```text
[ PHASE: REMISSION ]
      |
      v
[ VIGILANCE LOGS ] (Monthly AI-led check-ins)
      |
      v
[ TREND ANALYSIS ] (Are minor symptoms aggregating?)
      |
      v
[ PEACE OF MIND REPORT ] (Generated for next Oncology follow-up)
```

---

## 15. Technology Stack Justification

### 15.1 React / Vite
Chosen for high-performance rendering and the ability to package the application as a PWA (Progressive Web App), which is essential for offline mobile use without the friction of app store updates.

### 15.2 Google Gemini 3 (Multimodal)
Gemini is currently the only model capable of Native Audio and High-Fidelity Vision reasoning in a single context window. This allows LifePal to "read" a handwritten prescription and "talk" to a child about it simultaneously.

### 15.3 Azure Infrastructure
Selected for its robust healthcare compliance framework (HIPAA/GDPR readiness) and the seamless integration of Key Vault for secret management.

---

## 16. Ethical AI Design Principles

1.  **Safety over Capability:** We would rather the AI refuse to answer than provide a potentially dangerous clinical hallucination.
2.  **Explainability:** Every AI-generated summary has a "Why did you say this?" button, showing the source report or protocol.
3.  **Human Supremacy:** The AI is an assistant. The final decision always rests with the Oncologist or the Caregiver.

---

## 17. Scalability & Future Architecture

### 17.1 Modular Role Expansion
The system is architected to allow the addition of roles like "Community Volunteer" or "Palliative Nurse" by creating new state providers and UI atoms.

### 17.2 Hospital API Integration
Future versions will include direct HL7/FHIR integration with JNMCH Aligarh to allow reports to flow directly into the patient's vault, eliminating manual upload errors.

---

## 18. Known Limitations & Tradeoffs

*   **Model Latency:** Multimodal reasoning can take 3-5 seconds. We trade off "instant speed" for "protocol accuracy."
*   **Device Dependency:** As a local-first app, if a user loses their phone and hasn't enabled cloud backup, their local logs are lost. We prioritize privacy over effortless recovery.

---

## 19. Contribution Philosophy

Contributors to LifePal are expected to adhere to the "Sanctuary Code." This means prioritizing user dignity, clinical safety, and data privacy above all performance metrics. We welcome contributions in AI safety research, trauma-informed design, and regional language localization.

---

## 20. Final Vision Statement

LifePal is more than code; it is a promise. It is the promise that no father in Aligarh will have to stare at a medical report he doesn't understand at midnight. It is the promise that no child will think they are being punished when they receive medicine. It is the promise that technology can be as warm as it is intelligent. 

**Stay Brave. Logic is our Weapon, Compassion is our Shield.**