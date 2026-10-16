# VoltTwin AR v2.0 - System Architecture Specification
**Enterprise Hands-Free High-Voltage Lockout-Tagout (LOTO) Spatial Copilot for Snap SPECS**

---

## 1. Executive Summary & Design Philosophy
VoltTwin AR v2.0 transforms dangerous, error-prone high-voltage electrical maintenance into a zero-fatality, spatially guided workflow. Rather than forcing technicians to balance 2D paper schematics or tablets while handling 1000V insulated probes and screwdrivers, VoltTwin AR leverages Snap SPECS to anchor 1:1 real-world 3D safety perimeters, animated X-ray internal power conduits, and holographic alignment guides directly over physical equipment.

```
+---------------------------------------------------------------------------------------+
|                                    SNAP SPECS AR                                      |
|                                                                                       |
|  [Headset RGB/Depth Sensor]                [Spatial Audio Engine]                     |
|           |                                          |                                |
|           v                                          v                                |
|  [Spatial Calibration]                    [Proximity & Breach Audio]                  |
|  (LiDAR Grid Alignment)                   (NFPA 70E Acoustic Pings)                   |
|           |                                          ^                                |
|           +-------------------+                      |                                |
|                               v                      |                                |
|                     +---------------------------------------+                         |
|                     |     VoltTwin State Machine Controller |                         |
|                     |     - State 1: Spatial Sync           |                         |
|                     |     - State 2: Live Arc-Flash Shield  |                         |
|                     |     - State 3: Guided Isolation       |                         |
|                     |     - State 4: Ghost-Probe 0V Verify  |                         |
|                     |     - State 5: Cryptographic Tagout   |                         |
|                     +---------------------------------------+                         |
|                               |                      |                                |
|            +------------------+                      +-----------------+              |
|            v                                                           v              |
|   [SIK Hand-Tracking Engine]                                  [Spatial Visuals Engine]|
|   - Hand Joint Distance Math                                  - 3D Hazard Bounding Box|
|   - Air-Pinch Gesture Detection                               - 1-Meter Perimeter Ring|
|   - Proximity Breach Boundary (15cm)                          - Holographic Wire Glow |
|                                                               - 3D Translucent Probes |
|                                                               - 3D Glowing Padlock    |
+---------------------------------------------------------------------------------------+
```

---

## 2. The 5-State Finite State Machine (FSM)

VoltTwin AR strictly enforces OSHA 29 CFR 1910.147 and NFPA 70E compliance through an immutable 5-state sequence:

```
[ State 1: Spatial Sync ] 
        | (Air-Pinch / Calibrate)
        v
[ State 2: Live Arc-Flash Shield & Proximity Detection ]
        | (Acknowledge Live 480V Warning)
        v
[ State 3: Guided Mechanical Isolation ]
        | (Flip Breaker B2 -> Residual Amber Warning)
        v
[ State 4: Ghost-Probe Zero-Energy Verification ]
        | (Align Probes to T1-T2 -> 480V -> 42V -> 0.0V Discharge)
        v
[ State 5: Immutable Cryptographic Tagout ]
        | (Generate LOTO-HASH-994A -> Green Padlock Engaged)
        v
[ WORK PERMIT CLEARED ]
```

### State 1: Spatial Twin Sync (Calibration)
* **Objective:** Anchor the spatial reference coordinate system onto physical `Panel #HV-402`.
* **Visuals:** Pulsing cyan LiDAR-style wireframe grid overlaid on the target panel plane.
* **Trigger:** SIK Air-Pinch gesture or Preview click locks the world transform at `(0, -10, -90)` cm relative to initial head pose.
* **Validation:** Coordinate drift damped using exponential smoothing; visual confirmation chime.

### State 2: Live Arc-Flash Shield & 3D X-Ray Power Flow
* **Objective:** Establish the NFPA 70E Arc-Flash Boundary and alert technician to energized 480V conductors.
* **Visuals:**
  * **3D Hazard Bounding Cage:** Semi-transparent crimson cube (`#FF1E27`, alpha 0.45) with pulsing wireframe edges surrounding the main 480V busbars.
  * **1-Meter Floor Perimeter Ring:** Projected circle ($r = 100\text{ cm}$) on the floor around the cabinet, pulsing at 1.2 Hz with animated chevron arrows.
  * **3D Internal X-Ray Wiring:** Cylindrical conduits showing illuminated red particles flowing at 0.5 m/s from Main Bus to Breakers B1–B4.
* **Hand-Proximity Safety Interlock:** Hand tracking monitors euclidean distance $d$ from user palm/index tip to the Hazard Cage:
  $$\text{If } d \le 15\text{ cm} \implies \text{TRIGGER IMMEDIATE STROBE ALARM} + \text{WARNING CHIME}$$

### State 3: Guided Mechanical Isolation
* **Objective:** Guide technician to safely mechanically isolate Breaker B2 without touching neighboring live circuits.
* **Visuals:**
  * 3D pulsating directional chevron pointing at Breaker B2 handle.
  * Translucent Ghost Lever illustrating the downward flip motion (ON $\to$ OFF).
  * Hover highlight on B2 touch target ($10 \times 10\text{ cm}$).
* **Transition Trigger:** Breaker B2 toggled to OFF via Air-Pinch or physical lever action.
* **State Transition:** Power flow downstream of B2 switches from bright Red ($480\text{ V}$) to pulsating Amber ($180\text{ V}$ residual capacitor discharge warning).

### State 4: Ghost-Probe Zero-Energy Verification
* **Objective:** Ensure technician validates zero electrical potential before touching internal contacts.
* **Visuals:**
  * Two translucent 3D multimeter probes appear at $45^\circ$ angle of incidence:
    * **Red Probe (+):** Spatially locked 5 cm above Terminal Pin T1.
    * **Black Probe (-):** Spatially locked 5 cm above Terminal Pin T2.
  * Floating Spatial Pill: Billboards above terminals displaying simulated real-time voltage decay:
    $$\text{Countdown: } 480.0\text{ V} \to 240.2\text{ V} \to 42.8\text{ V} \to 0.0\text{ V (VERIFIED SAFE)}$$
* **Confirmation:** SIK Air-Pinch confirms zero energy verification.

### State 5: Immutable Cryptographic Tagout (Safe to Work)
* **Objective:** Issue digital lockout authorization and mark the workspace safe.
* **Visuals:**
  * All red/amber hazard cages and floor rings transition to soothing **Emerald Green** (`#00E676`).
  * A 3D metallic digital padlock animates into position over Breaker B2 handle, locking with a metallic snap sound effect.
  * Floating tamper-proof compliance badge displays:
    `LOTO-HASH-994A | CLEARED FOR MAINTENANCE | TIMESTAMP: 2026-10-16 14:50 UTC`

---

## 3. Spatial Coordinate & Placement Specification

All dimensions are modeled in 1:1 real-world metric units (centimeters):

| Object / Component | Real-World Dimensions (cm) | Spatial Position relative to Panel Anchor | Orientation | Material / Shader |
| :--- | :--- | :--- | :--- | :--- |
| **Panel Cabinet #HV-402** | $60 \times 80 \times 25$ | $(0, 0, 0)$ cm | $0^\circ, 0^\circ, 0^\circ$ | Matte Dark Charcoal (#1A1A1A) |
| **Main 480V Breaker** | $18 \times 14 \times 10$ | $(0, 22, 5)$ cm | $0^\circ, 0^\circ, 0^\circ$ | High-contrast Danger Yellow/Black |
| **Hazard Bounding Cage** | $22 \times 18 \times 14$ | $(0, 22, 5)$ cm | $0^\circ, 0^\circ, 0^\circ$ | Translucent Red Pulsing Wireframe |
| **Arc-Flash Floor Ring** | Radius $100\text{ cm}$, Thickness $4\text{ cm}$ | $(0, -90, 0)$ cm (Floor) | Flat on XZ plane | Additive Pulsing Emissive Ring |
| **Branch Breaker B2** | $8 \times 12 \times 6$ | $(-14, -5, 5)$ cm | $0^\circ, 0^\circ, 0^\circ$ | Industrial Switch with Hover Glow |
| **Terminal Pins T1 & T2** | $1.5 \times 1.5 \times 4$ each (spacing: 6 cm) | $(14, -18, 5)$ cm | $0^\circ, 0^\circ, 0^\circ$ | Copper Conductive Shader |
| **Ghost Multimeter Probes**| Length $15\text{ cm}$, Diameter $1.2\text{ cm}$ | $(14, -13, 10)$ cm | Angled $45^\circ$ downward | Red/Black Glass Translucent Fresnels |
| **3D Digital Padlock** | $10 \times 14 \times 4$ | $(-14, -5, 12)$ cm | $0^\circ, 0^\circ, 0^\circ$ | Glowing Emerald Chrome (#00E676) |
| **Floating Status Pill** | $24 \times 8 \times 1.5$ | Dynamic: $10\text{ cm}$ above target | Billboard to Headset | Translucent Frosted Glass UI |

---

## 4. Spectacles Interaction Kit (SIK) Integration

### Hands-Free Ergonomics
To ensure compliance with industrial safety codes (NFPA 70E), the technician must never be forced to touch physical screens or hold mobile devices:
1. **Raycast Pointer & Air-Pinch:** SIK Interactor enables natural pinch-to-select targeting from comfortable resting arm positions.
2. **Proximity Trigger Volume:** Real-time distance evaluation using joint tracking:
   ```typescript
   const distance = handJointTransform.getWorldPosition().distance(hazardCageTransform.getWorldPosition());
   if (distance < PROXIMITY_THRESHOLD_CM && isBreakerLive) {
       triggerProximityBreachAlert();
   }
   ```
3. **Ergonomic Viewing Cone:** All interactive elements and visual indicators remain strictly inside the central $32^\circ \times 37^\circ$ field of view (FOV) at an arm's reach distance of $60\text{--}90\text{ cm}$.

---

## 5. Additive Display & Optical Optimization
Snap SPECS feature an additive wave-guide optical display where black ($#000000$) renders as transparent:
* **High Contrast Color Palette:**
  * Hazard Alert: Bright Saturated Crimson (`#FF202B`)
  * Residual Caution: High-Luminance Amber (`#FFB300`)
  * Safe / Verified: Vibrant Emerald Green (`#00E676`)
  * Calibration Grid: Neon Cyan (`#00E5FF`)
* **Text Legibility:** All status typography uses bold, sans-serif high-emissive white text with contrasting tinted pill backing plates.
