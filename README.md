# LogiSec // AI Code Auditor 🛡️

LogiSec AI is a modern, enterprise-grade full-stack security application designed to act as an automated Tier-3 Cyber Security Incident Response Analyst and expert SecOps Code Auditor. It allows developers to safely scan source code snippets for critical architectural flaws, logic errors, and zero-day signatures before deployment.

## 🚀 Core Capabilities

- **Automated Threat Modeling:** Rapidly evaluates code inputs against the OWASP Top 10, CWE elements, improper memory configurations, and exposed secret vectors.
- **Next-Gen AI Analysis:** Utilizes the advanced `@google/genai` SDK (`gemini-2.5-flash`) with strict systemic behavioral guarding for high-precision diagnostic traces.
- **Persistent Audit Trails:** Automatically indexes, categorizes, and records historic scanning sessions to a persistent cloud-native database cluster.
- **Secure Code Remediation:** Generates production-ready, fully mitigative, and securely engineered code alternatives directly within markdown response payloads.

## ⚙️ Tech Stack

- **Backend Infrastructure:** Node.js, Express, TypeScript (ESM)
- **AI Processing Core:** Modern `@google/genai` SDK Core Engine
- **Persistence Layer:** MongoDB Atlas (Mongoose ODM)
- **Version Control & Workflow:** Strict Git Feature-Branch Strategy
