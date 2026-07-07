# Smart Bharat – AI-Powered Civic Companion

Smart Bharat is a full-stack, AI-powered civic accessibility platform designed to simplify governance, streamline public grievance reporting, and democratize access to welfare schemes for Indian citizens. 

By leveraging cutting-edge multimodal generative AI, localized voice processing, and real-time structured data parsing, the platform bridges the gap between public administration and everyday citizens, particularly targeting rural and semi-urban populations.

---

## 📌 Chosen Vertical & Target Persona
* **Vertical:** Citizen Services, Civic Governance, and Public Welfare.
* **Target Audience:** Indian citizens, local municipal bodies, community leaders, and demographics facing language or technological barriers (e.g., farmers, small-business owners).

---

## 🧠 Approach, Core Logic & Architecture

Smart Bharat separates presentation logic from intelligence generation using an asynchronous, lightweight full-stack design optimized for performance and resource efficiency.

```text
+-------------------+              +-------------------------+              +------------------------+
|   React Frontend  | --(b64/Text)-->| Vercel Serverless Node  | --(Payload)-->|   Gemini 2.5 Flash API |
| (Voice/Vision/UI) | <---(JSON)---- |     (Backend API)       | <---(Result)--|  (Reasoning Engine)    |
+-------------------+                +-------------------------+              +------------------------+
          |                                                                                |
          +---> LocalStorage Memory (Persistent History Persistence)                        +---> System Instructions