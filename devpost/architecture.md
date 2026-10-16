# VoltTwin AR v2.0 - System Architecture Specification
**Enterprise Hands-Free High-Voltage Lockout-Tagout (LOTO) Spatial Copilot for Snap SPECS**

---

## 1. Executive Summary & Design Philosophy
VoltTwin AR v2.0 transforms dangerous, error-prone high-voltage electrical maintenance into a zero-fatality, spatially guided workflow. Rather than forcing technicians to balance 2D paper schematics or tablets while handling 1000V insulated probes and screwdrivers, VoltTwin AR leverages Snap SPECS to anchor 1:1 real-world 3D safety perimeters, animated X-ray internal power conduits, live thermal load gradients, and holographic alignment guides directly over physical equipment.

```
+-----------------------------------------------------------------------------------------------+
|                                        SNAP SPECS AR                                          |
|                                                                                               |
|  [Headset RGB/Depth Sensor]     [Microphone Speech Engine]         [Spatial Audio Engine]     |
|           |                                 |                                 |               |
|           v                                 v                                 v               |
|  [Spatial Calibration]          [Voice Command Dispatcher]        [Proximity & Breach Audio]  |
|  (LiDAR Grid Alignment)         - "Check Status"                  - NFPA 70E Acoustic Pings   |
|           |                     - "Toggle B2"                     - State Chimes & Dwell Cues |
|           |                     - "Lockout Complete"                          ^               |
|           |                                 |                                 |               |
|           +-------------------+             +---------------------------------+               |
|                               v             v                                                 |
|                     +---------------------------------------+                                 |
|                     |     VoltTwin State Machine Controller |                                 |
|                     |     - State 1: Spatial Sync           |                                 |
|                     |     - State 2: Live Arc-Flash Shield  |                                 |
|                     |     - State 3: Guided Isolation       |                                 |
|                     |     - State 4: Ghost-Probe 0V Verify  |                                 |
|                     |     - State 5: Cryptographic Tagout   |                                 |
|                     +---------------------------------------+                                 |
|                               |                     |                                         |
|            +------------------+                     +------------------+                      |
|            v                                                           v                      |
|   [SIK & Safety Interlocks Engine]                            [Spatial Visuals Engine]        |
|   - Hand Joint Proximity Math (15cm)                          - 3D Hazard Bounding Cage       |
|   - Head-Gaze Dwell Interlock (1.5s on T1)                    - 1-Meter Floor Perimeter Ring  |
|   - Air-Pinch Gesture Detection                               - Dynamic Thermal Heatmap Shader|
|                                                               - 3D Translucent Probes         |
|                                                               - 3D Glowing Digital Padlock    |
+-----------------------------------------------------------------------------------------------+
```

---

## 2. The 5-State Finite State Machine (FSM)

VoltTwin AR strictly enforces OSHA 29 CFR 1910.147 and NFPA 70E compliance through an immutable 5-state sequence:

```
[ State 1: Spatial Sync ] 
        | (Air-Pinch / Calibrate)
        v
[ State 2: Live Arc-Flash Shield & Proximity Detection ]
        | (Acknowledge Live 480V Warning / Voice: "Check Status")
        v
[ State 3: Guided Mechanical Isolation ]
        | (Flip Breaker B2 / Voice: "Toggle B2" -> Residual Amber Warning)
        v
[ State 4: Ghost-Probe Zero-Energy Verification ]
        | (1.5s Gaze Dwell on T1 -> Align Probes -> 480V -> 42V -> 0.0V Discharge)
        v
[ State 5: Immutable Cryptographic Tagout ]
        | (Voice: "Lockout Complete" -> Generate LOTO-HASH-994A -> Green Padlock Engaged)
        v
[ WORK PERMIT CLEARED ]
```

### State 1: Spatial Twin Sync (Calibration)
* **Objective:** Anchor the spatial reference coordinate system onto physical `Panel #HV-402`.
* **Visuals:** Pulsing cyan LiDAR-style wireframe grid overlaid on the target panel plane.
* **Trigger:** SIK Air-Pinch gesture or Preview click locks the world transform at `(0, -10, -90)` cm.

### State 2: Live Arc-Flash Shield & 3D X-Ray Power Flow
* **Objective:** Establish the NFPA 70E Arc-Flash Boundary and alert technician to energized 480V conductors.
* **Visuals:**
  * **3D Hazard Bounding Cage:** Semi-transparent crimson cube (`#FF1E27`, alpha 0.45) with pulsing wireframe edges.
  * **1-Meter Floor Perimeter Ring:** Projected circle ($r = 100\text{ cm}$) on the floor around the cabinet, pulsing at 1.2 Hz.
  * **Thermal Load Heatmap:** Conduits glow amber-hot ($68^\circ\text{C}$, `#FF6600`) representing high electrical load.
* **Hand-Proximity Safety Interlock:** Hand tracking monitors distance $d$ from user palm/index tip to the Hazard Cage:
  $$\text{If } d \le 15\text{ cm} \implies \text{TRIGGER IMMEDIATE STROBE ALARM} + \text{WARNING CHIME}$$

### State 3: Guided Mechanical Isolation
* **Objective:** Guide technician to safely mechanically isolate Breaker B2 hands-free.
* **Voice Command:** "Toggle B2" mechanically trips Breaker B2 without physical touch.
* **Transition Trigger:** Breaker B2 toggled to OFF via Voice Command, Air-Pinch, or lever action.
* **State Transition:** Power flow downstream of B2 switches from bright Red ($480\text{ V}$) to pulsating Amber ($180\text{ V}$ residual capacitor discharge warning).

### State 4: Ghost-Probe Zero-Energy Verification & Gaze Dwell Interlock
* **Objective:** Ensure technician validates zero electrical potential with safety verification.
* **Gaze Dwell Safety Interlock:** To prevent false confirmations, technician's head-gaze must lock onto Terminal Pin T1 continuously for $1.5\text{ seconds}$. A circular radial progress reticle fills in real time.
* **Ghost Probes Visuals:**
  * Red Probe (+) locked onto Terminal T1.
  * Black Probe (-) locked onto Terminal T2.
  * Live discharge countdown: $480.0\text{ V} \to 42.0\text{ V} \to 0.0\text{ V (VERIFIED SAFE)}$.
  * Dynamic thermal cooling: Conduits transition from amber-hot to cold blue ($21^\circ\text{C}$, `#1A8CFF`).

### State 5: Immutable Cryptographic Tagout (Safe to Work)
* **Objective:** Issue digital lockout authorization and mark the workspace safe.
* **Voice Command:** "Lockout Complete" finalizes clearance when zero energy is verified.
* **Visuals:**
  * All red/amber hazard cages transition to **Emerald Green** (`#00E676`).
  * 3D glowing green digital padlock snaps over B2 handle with metallic latch audio.
  * Cryptographic compliance badge displays: `LOTO-HASH-994A | CLEARED FOR MAINTENANCE`.

---

## 3. Hands-Free Voice Commands Specification

```typescript
export interface VoiceCommandBinding {
    phrase: string;
    targetState: LOTOState;
    action: () => void;
    confirmationAudio: string;
}
```

| Voice Trigger Phrase | Primary Action | Confirmation Audio Cue | Preview Fallback Button |
| :--- | :--- | :--- | :--- |
| **"Check Status"** | Announces current state & active hazards | `VOICE_CHIME_CONFIRM` (double ping) | Floating UI Status Pill Click |
| **"Toggle B2"** | Isolates Breaker B2 (ON -> OFF) | `BREAKER_TRIP_AUDIO` (mechanical clack) | SIK Breaker B2 Switch Click |
| **"Lockout Complete"** | Engages digital padlock & generates hash | `LOCK_ENGAGE_AUDIO` (metallic snap) | Complete Tagout Pill Click |

---

## 4. Dynamic Thermal Heatmap & Load Overlay

Conduit temperatures are simulated based on Joule heating dissipation ($P = I^2 R$):
$$T(t) = T_{\text{ambient}} + (T_{\text{max}} - T_{\text{ambient}}) \cdot e^{-t / \tau}$$
* **High Load State (Energized 480V):**
  * Temperature: $68.4^\circ\text{C}$
  * Color: Amber-Hot `#FF6600` (`vec4(1.0, 0.4, 0.0, 0.9)`)
  * Shader Effect: High-frequency heat shimmer pulsation
* **De-Energized State (Zero Energy 0.0V):**
  * Temperature: $21.2^\circ\text{C}$ (ambient equilibrium)
  * Color: Cold Cryo Blue `#1A8CFF` (`vec4(0.1, 0.55, 1.0, 0.75)`)
  * Shader Effect: Static translucent cool glow

---

## 5. Gaze Dwell Safety Interlock Engine

To eliminate accidental single-pinch misfires during hazardous electrical testing:
1. **Raycast Origin:** Glasses head pose center vector $\vec{V}_{\text{head}}$.
2. **Target Volume:** Terminal Pin T1 bounding cylinder ($r = 3\text{ cm}$, $h = 5\text{ cm}$).
3. **Dwell Accumulator:**
   $$\text{Progress}(t) = \min\left(1.0, \frac{\Delta t_{\text{locked}}}{1.5\text{ s}}\right)$$
4. **Visual Indicator:** Billboarding radial progress ring fills from $0^\circ$ to $360^\circ$ around Terminal Pin T1.
5. **Interlock Trigger:** Only when $\text{Progress} = 1.0$ is the Zero-Energy confirmation unlocked.

---

## 6. Real-Time Spatial Object Detection Engine
* **Optical CV Bounding Box:** Renders an animated green holographic tracking cube enclosing `Panel #HV-402` during initial targeting.
* **Confidence Rating:** Displays real-time optical confidence verification: `TARGET: Panel #HV-402 [CONFIDENCE: 99.4%]`.
* **Anchor Lock:** Locks coordinate frame upon confidence verification and Air-Pinch confirmation.

---

## 7. 3D Exploded-View Kinematics
* **Smooth Outward Expansion:**
  * Front Door Panel: $\Delta Z = +25.0\text{ cm}$
  * Busbar Module: $\Delta Y = +10.0\text{ cm}, \Delta Z = +15.0\text{ cm}$
  * Terminal Module: $\Delta Y = -10.0\text{ cm}, \Delta Z = +10.0\text{ cm}$
* **Voice Trigger:** "Explode View" and "Collapse View" dispatches smooth lerp interpolation between collapsed and exploded states.

---

## 8. Volumetric Plasma Particle Blast & Remote Expert HUD
* **Arc-Flash Plasma Spark Blast:** Breaching $\le 15\text{ cm}$ in State 2 unleashes dynamic 3D plasma spark particles accompanied by Web Audio synthesized electrical crackle sound.
* **Encrypted Remote Telemetry:** Waveguide HUD displays live supervisor communication waveform: `REMOTE EXPERT: ENG-SARAH-CHEN | ENCRYPTED 5G LINK (12ms)`.
