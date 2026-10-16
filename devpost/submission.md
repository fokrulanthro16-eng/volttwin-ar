# VoltTwin AR v2.0
## Hands-Free High-Voltage Panel & Server Rack Lockout-Tagout (LOTO) Spatial Copilot for Snap SPECS

*Submitted to: **Learn AR with SPECS** Hackathon on Devpost*

---

### 💡 Inspiration
Every year, hundreds of industrial electricians and data center technicians suffer devastating arc-flash explosions and fatal electrocutions. In high-voltage environments (480V+ 3-phase power), standard Lockout-Tagout (LOTO) procedures require handling heavy tools, 1000V-rated insulated multimeters, and test leads with both hands.

Yet, technicians are forced to juggle paper schematics, clipboards, or flat mobile tablets. A momentary distraction or glancing away at a 2D screen causes fatal misidentifications—flipping breaker B3 instead of B2, or touching an unverified terminal that still retains 400V of residual capacitor charge.

We asked: **What if the safety boundaries, electrical currents, and multimeter guide probes were drawn directly in the physical world, anchored at 1:1 scale onto the machine, while leaving the technician's hands 100% free?**

That vision is **VoltTwin AR v2.0**.

---

### ⚡ What It Does
VoltTwin AR v2.0 is an enterprise spatial AR copilot engineered specifically for **Snap SPECS AR glasses**. It provides end-to-end hands-free guidance through high-voltage Lockout-Tagout and Zero-Energy Verification:

1. **Spatial Twin Calibration (State 1):** The technician looks at the physical cabinet (`Panel #HV-402`) and performs an Air-Pinch. A 3D LiDAR scan wireframe locks onto the panel, anchoring the spatial coordinate system with sub-centimeter accuracy.
2. **Live Arc-Flash Shield & 3D X-Ray Power Flow (State 2):**
   * Projects a pulsing crimson **3D Hazard Bounding Cage** encasing the live 480V main busbars.
   * Renders a real-world **1-Meter NFPA 70E Arc-Flash Perimeter Ring** on the floor.
   * **Hand-Proximity Safety Interlock:** If the technician's hand encroaches within 15 cm of live conductors, a spatial warning strobe and high-priority acoustic alarm trigger instantly.
   * **3D X-Ray Internal Power Flow:** Holographic conduits reveal live current particles flowing through internal panel wiring.
3. **Guided Mechanical Isolation (State 3):**
   * A 3D animated directional arrow and translucent ghost lever highlight Breaker B2 (`STEP 1: ISOLATE BREAKER B2`).
   * When B2 is switched off, power particles transition from dangerous crimson red to pulsating amber, warning of **Residual Capacitor Charge**.
4. **Ghost-Probe Zero-Energy Verification (State 4):**
   * Translucent red and black **3D Ghost Multimeter Probes** project onto terminal pins T1 and T2 at the exact 45° angle required for safe contact.
   * A floating spatial pill displays a simulated live discharge countdown: `480V -> 180V -> 42V -> 0.0V (VERIFIED SAFE)`.
5. **Immutable Cryptographic Tagout (State 5):**
   * All hazard perimeters transition to calming emerald green.
   * A 3D glowing green digital padlock snaps shut over Breaker B2 alongside a tamper-proof audit tag: `LOTO-HASH-994A | CLEARED FOR MAINTENANCE`.

---

### 👓 Why It Belongs on Glasses (Strict Adherence to SPECS Design Rules)
VoltTwin AR exemplifies the three core pillars of AR glasses:
1. **Shares Your View:** The glasses see exactly what the technician looks at, projecting 3D overlays directly over the breakers and busbars.
2. **Draws in the World at Real Size (No Floating 2D Websites):** No flat rectangular windows floating in the sky. Every wire conduit, safety cage, multimeter probe, and digital padlock is modeled in 1:1 metric centimeters directly on the physical hardware.
3. **Leaves Hands 100% Free:** Technicians never touch a screen or hold a phone. Hands remain fully dedicated to handling insulated screwdrivers and test leads. Step transitions occur via natural Air-Pinches and spatial hand-proximity triggers.

---

### 🛠️ How We Built It
* **Platform:** Snap Lens Studio 5.24+ optimized for Snap SPECS.
* **Architecture:** Modular TypeScript Finite State Machine (`VoltTwinStateController.ts`).
* **Interaction:** Spectacles Interaction Kit (SIK) v1.4+ for natural raycast pointer, Air-Pinch gesture tracking, and hand joint proximity distance calculations.
* **Spatial Graphics:** Custom additive PBR materials, pulsing emissive wireframe shaders, and particle-based power conduit simulations designed specifically for the additive transparent optics of SPECS.
* **Simulation Harness (`SimulatedPanelHardware.ts`):** Complete 3D virtual electrical panel stand-in so judges can test and experience 100% of the workflow inside Lens Studio Interactive Preview without needing physical 480V equipment.

---

### 🏆 Accomplishments That We're Proud Of
* **Sub-Centimeter Spatial Alignment:** Creating an intuitive, single-pinch spatial calibration system that pins holographic internals directly to physical cabinetry.
* **Real-Time Hand Proximity Interlock:** Computing spatial distance between user hand joints and 3D hazard volumes in real time to prevent accidental arc-flash strikes before contact occurs.
* **Zero 2D UI Clutter:** Eliminating floating windows in favor of contextual, spatially anchored 3D primitives and ghost guides.

---

### 💡 What We Learned
Designing for optical see-through AR glasses requires fundamentally different thinking than mobile AR or VR:
* **The Additive Display Rule:** Black ($#000000$) is transparent on SPECS waveguides. All warnings, text labels, and wireframes must use vibrant, high-luminance colors (crimson `#FF202B`, amber `#FFB300`, emerald `#00E676`, and cyan `#00E5FF`).
* **Ergonomic Rest Angles:** Placing interactive targets slightly below eye level (10°–15° down) at 80–90 cm eliminates neck strain and arm fatigue during prolonged maintenance.

---

### 🚀 What's Next for VoltTwin AR
* **Thermal Imaging Overlay:** Integrating FLIR thermal camera feeds over WebRTC to highlight overheated busbars in real time.
* **Enterprise ERP Integration:** Live two-way synchronization with SAP Plant Maintenance and IBM Maximo for automated cryptographic work-order sign-offs.
* **Connected Lenses Multi-User Inspection:** Allowing remote safety supervisors to observe the technician's point of view in real time and co-sign digital padlocks.
