<div align="center">

# ⚡ VoltTwin AR v2.0
### Enterprise Hands-Free High-Voltage Panel & Server Rack Lockout-Tagout (LOTO) Spatial Copilot for Snap SPECS AR Glasses

[![Hackathon Submission](https://img.shields.io/badge/Devpost-Learn%20AR%20with%20SPECS-FFFC00?style=for-the-badge&logo=snapchat&logoColor=black)](https://devpost.com)
[![LEAF Verification](https://img.shields.io/badge/LEAF%20Tests-12%2F12%20PASSING%20(100%25)-00E676?style=for-the-badge&logo=checkmarx&logoColor=white)](#-leaf-automated-verification-matrix-12-of-12-passing)
[![Platform](https://img.shields.io/badge/Platform-Snap%20SPECS%20%7C%20Lens%20Studio%205.24+-00E5FF?style=for-the-badge&logo=snapchat&logoColor=black)](#)
[![Stack](https://img.shields.io/badge/Stack-TypeScript%20%7C%20CLAD%20%7C%20MCP%20%7C%20Three.js-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

<a href="https://youtu.be/9FeNQ1GQqfs">
  <img src="thumbnail_exploded.jpg" alt="VoltTwin AR v2.0 Demo Video on YouTube" width="900" style="border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"/>
</a>

### 🎬 **[Watch the Full 1080p60 YouTube Demo Video (Click Here)](https://youtu.be/9FeNQ1GQqfs)**
*Narrated with Studio Neural Speech (`en-US-ChristopherNeural -10%`), Web Audio 60Hz hum acoustic occlusion, plasma arc blast, and metallic padlock latch chime.*

</div>

---

## 💡 Executive Summary

Every year, hundreds of industrial electricians and data center technicians suffer fatal electrocutions and catastrophic arc-flash blasts ($>35\text{ cal/cm}^2$). In 480V 3-phase high-voltage switchgear environments, standard Lockout-Tagout (LOTO) safety procedures require holding 1000V-rated insulated test probes and tools with **both hands**.

Yet technicians are forced to juggle flat 2D paper schematics, clipboards, or mobile tablets. A split-second distraction or misidentification leads to fatal accidents—such as flipping breaker B3 instead of B2, or touching an unverified terminal retaining 400V of residual capacitor charge.

**VoltTwin AR v2.0** turns **Snap SPECS AR glasses** into an enterprise spatial safety copilot: anchoring 1:1 metric hazard cages, dynamic thermal heatmaps, translucent ghost multimeter probes, and digital padlocks directly onto the physical hardware in 3D world space—while leaving the technician's hands **100% free**.

---

## 👓 The 3 Snap SPECS Spatial Pillars (Strict Hackathon Compliance)

VoltTwin AR was engineered from the ground up strictly adhering to Snap's three core principles for optical AR glasses:

```mermaid
graph LR
    subgraph P1["1. Shares Your View"]
        direction TB
        A1[Front-Facing Optical Cameras] --> A2[YOLO CV Object Detection 99.4%]
        A2 --> A3[Gaze Raycast Reticle on Terminal T1]
    end

    subgraph P2["2. Draws at 1:1 World Scale"]
        direction TB
        B1[Zero 2D Floating Sky Windows] --> B2[1-Meter NFPA 70E Arc-Flash Ring on Floor]
        B2 --> B3[Holographic Busbars & Translucent Ghost Probes at 45°]
    end

    subgraph P3["3. Leaves Hands 100% Free"]
        direction TB
        C1[Both Hands Hold 1000V Multimeter] --> C2[Voice Commands: 'Toggle B2', 'Explode View']
        C2 --> C3[1.5s Gaze Dwell Verification Interlock]
    end

    P1 --- P2 --- P3
```

1. **Shares Your View:** The camera identifies the physical electrical switchgear (`Panel #HV-402`) with 99.4% optical confidence and tracks continuous 1.5-second head-gaze dwell directly on critical terminal pins.
2. **Draws in the World at 1:1 Metric Scale (Zero 2D Floating Website Clutter):** No rectangular browser windows floating in the sky. Every wire conduit, safety cage, thermodynamic heatmap gradient, multimeter probe, and digital padlock is modeled in 1:1 metric centimeters directly on the physical hardware.
3. **Leaves Hands 100% Free:** Technicians never touch a screen or hold a phone. Hands remain fully dedicated to handling insulated tools and multimeter leads. Step transitions occur via hands-free Voice Commands (*"Toggle B2"*, *"Lockout Complete"*, *"Explode View"*), 1.5s Gaze Dwell Interlocks, and spatial hand-proximity triggers.

---

## 🏛️ System Architecture & MCP Pipeline

The system is powered by Snap's CLAD plugin alongside the Lens Studio Model Context Protocol (MCP) server, driving a deterministic TypeScript state machine and WebGL / Web Audio spatial simulator:

```mermaid
flowchart TD
    subgraph Hardware["Snap SPECS Hardware & Sensors"]
        CAM[Front RGB Cameras]
        GAZE[Eye Tracking / Head Raycast]
        HANDS[SIK 26-Joint Hand Tracking]
        MIC[Waveguide Microphones]
        SPEAKERS[Binaural Waveguide Speakers]
    end

    subgraph MCP["CLAD & Lens Studio MCP Integration"]
        CLAD[Snap CLAD Plugin]
        MCP_SRV[Lens Studio MCP Server]
        LEAF_RUN[LEAF Automated Verification Harness]
        CLAD <--> MCP_SRV
        MCP_SRV --> LEAF_RUN
    end

    subgraph CoreEngine["VoltTwin TypeScript Core Engine"]
        FSM[VoltTwinStateController.ts<br/><i>Finite State Machine</i>]
        VOICE[VoiceCommandDispatcher.ts<br/><i>Speech Grammar Engine</i>]
        CV_TRACK[SpatialObjectDetection.ts<br/><i>YOLO 99.4% CV Lock</i>]
        GAZE_ENG[GazeDwellInterlock.ts<br/><i>1.5s Safety Interlock</i>]
        THERM[ThermalHeatmapOverlay.ts<br/><i>GLSL Thermodynamic Shader</i>]
        AUDIO_OCC[SpatialAudioOcclusion.ts<br/><i>Biquad Filter -12dB to 0dB</i>]
    end

    subgraph SpatialRendering["3D Three.js & WebGL Spatial Viewport"]
        CABINET[3D Panel #HV-402 Cabinet]
        RING[1.0m NFPA 70E Arc-Flash Ring]
        PROBES[3D Ghost Probes at 45° Angle]
        PADLOCK[3D Glowing Emerald Padlock]
        PLASMA[Volumetric Plasma Spark Burst]
        CONDUITS[Dynamic Conduits: 68°C Amber -> 21°C Blue]
    end

    subgraph Audit["Enterprise Compliance"]
        CRYPTO[Cryptographic Hash Engine<br/><i>LOTO-HASH-994A</i>]
        JSON_EXP[Signed Work Permit JSON]
    end

    CAM --> CV_TRACK
    GAZE --> GAZE_ENG
    HANDS --> FSM
    MIC --> VOICE

    VOICE --> FSM
    CV_TRACK --> FSM
    GAZE_ENG --> FSM
    FSM --> THERM
    FSM --> AUDIO_OCC
    FSM --> CRYPTO

    FSM --> SpatialRendering
    THERM --> CONDUITS
    AUDIO_OCC --> SPEAKERS
    CRYPTO --> JSON_EXP
```

---

## 🔄 Deterministic Finite State Machine (FSM)

```mermaid
stateDiagram-v2
    [*] --> IDLE_SCANNING: Glasses Boot / Looking at Room
    IDLE_SCANNING --> STATE_1_SPATIAL_SYNC: Optical Detection Lock on #HV-402 (99.4%)
    STATE_1_SPATIAL_SYNC --> STATE_2_LIVE_HAZARD: Air-Pinch Sync / 1:1 World Anchor Locked
    
    state STATE_2_LIVE_HAZARD {
        [*] --> ArmedSafeZone: Hand > 15cm
        ArmedSafeZone --> CrimsonStrobeAlert: Hand <= 15cm
        CrimsonStrobeAlert --> PlasmaArcBurst: High-Voltage Discharge
        PlasmaArcBurst --> ArmedSafeZone: Hand Retracted (>15cm)
    }

    STATE_2_LIVE_HAZARD --> STATE_3_MECHANICAL_ISOLATION: Voice "Toggle B2" (Breaker Trips OFF)

    state STATE_3_MECHANICAL_ISOLATION {
        [*] --> ResidualCapacitorWarning: 45°C Amber Conduits
        ResidualCapacitorWarning --> Exploded3DView: Voice "Explode View" (+25cm outward)
        Exploded3DView --> UnmaskedAudioOcclusion: 60Hz Hum (-12dB -> 0dB)
        UnmaskedAudioOcclusion --> CollapsedCabinet: Voice "Collapse View"
    }

    STATE_3_MECHANICAL_ISOLATION --> STATE_4_ZERO_ENERGY_VERIFICATION: Advance to Verification

    state STATE_4_ZERO_ENERGY_VERIFICATION {
        [*] --> GhostProbesAligned: Translucent Probes Anchor on T1/T2 at 45°
        GhostProbesAligned --> GazeDwellAccumulating: Head Raycast Locks on Terminal T1
        GazeDwellAccumulating --> VoltageDischarging: Countdown 480V -> 180V -> 42V -> 0.0V
        VoltageDischarging --> CryoBlueThermalEquilibrium: Conduits Cool to 21°C
    }

    STATE_4_ZERO_ENERGY_VERIFICATION --> STATE_5_CRYPTOGRAPHIC_TAGOUT: Gaze Locked >= 1.5s & 0.0V Confirmed

    state STATE_5_CRYPTOGRAPHIC_TAGOUT {
        [*] --> MintingLotoToken
        MintingLotoToken --> EmeraldPadlockLocked: Metallic Latch Chime
        EmeraldPadlockLocked --> AuditLogExportReady: LOTO-HASH-994A Verified
    }

    STATE_5_CRYPTOGRAPHIC_TAGOUT --> [*]: Work Cleared for Maintenance
```

---

## 📸 Devpost Submission Image Gallery

The following 6 high-definition cinematic screenshots showcase the complete end-to-end spatial workflow:

| 1. Spatial Twin Anchor & Optical CV Lock | 2. Arc-Flash Plasma Blast Hazard Breach |
| :---: | :---: |
| <img src="screenshots/screenshot-1-spatial-anchor.png" width="440" alt="Spatial Twin Anchor"/> | <img src="screenshots/screenshot-2-proximity-breach.png" width="440" alt="Proximity Breach"/> |
| *Pass-through optical detection locking onto Panel #HV-402 (99.4%) with 1.0m NFPA 70E floor Arc-Flash perimeter ring.* | *Hand within 15cm triggers flashing crimson HUD strobe, volumetric plasma particle burst, and acoustic alarm.* |

| 3. 3D Exploded-View Architecture | 4. GLSL Dynamic Thermal Load Shaders |
| :---: | :---: |
| <img src="screenshots/screenshot-3-exploded-view.png" width="440" alt="3D Exploded View"/> | <img src="screenshots/screenshot-4-thermal-load.png" width="440" alt="GLSL Thermal Shader"/> |
| *Voice command "Explode View" disassembles cabinet doors (+25cm) exposing internal copper busbars and unmasking 60Hz hum.* | *Thermodynamic Joule heating visualization ($68^\circ\text{C}$ amber-hot) transitioning to cold cryo-blue ($21^\circ\text{C}$).* |

| 5. Immutable Cryptographic LOTO Padlock | 6. LEAF Automated Verification Matrix |
| :---: | :---: |
| <img src="screenshots/screenshot-5-loto-padlock.png" width="440" alt="LOTO Padlock"/> | <img src="screenshots/screenshot-6-leaf-tests-pass.png" width="440" alt="LEAF Tests 12/12 Passing"/> |
| *Glowing emerald digital padlock locked over Breaker B2, 1.5s gaze-dwell reticle verified on T1, and compliance token `LOTO-HASH-994A`.* | *Full overview of the 12/12 passing automated test suite, remote expert HUD telemetry, and cryptographic JSON export.* |

---

## ⚡ LEAF Automated Verification Matrix (12 of 12 PASSING)

Every functional requirement and Done Criterion is continuously validated via the **Lens Studio Automated Verification (LEAF)** test runner:

| Test ID | Test Scenario | Verified Done Criteria | Status |
| :--- | :--- | :--- | :---: |
| **`LEAF-01`** | **Spatial Twin Sync & Anchor** | Coordinate frame anchors to Panel #HV-402 at $(0, -10, -90)\text{ cm}$ within $\pm 1\text{ cm}$ tolerance. | ![PASS](https://img.shields.io/badge/LEAF--01-PASS-00E676?style=flat-square) |
| **`LEAF-02`** | **Arc-Flash Hazard & 15cm Breach** | Volumetric red hazard cage activates; hand proximity $\le 15\text{ cm}$ triggers crimson strobe and acoustic alarm. | ![PASS](https://img.shields.io/badge/LEAF--02-PASS-00E676?style=flat-square) |
| **`LEAF-03`** | **Guided Mechanical Isolation** | Voice command *"Toggle B2"* flips Breaker B2 lever to OFF ($-\pi/4\text{ rad}$); conduits shift to residual amber. | ![PASS](https://img.shields.io/badge/LEAF--03-PASS-00E676?style=flat-square) |
| **`LEAF-04`** | **3D Ghost Multimeter Probes** | Red/Black ghost test leads project onto pins T1/T2 at 45°; voltage discharges $480\text{V} \to 0.0\text{V}$. | ![PASS](https://img.shields.io/badge/LEAF--04-PASS-00E676?style=flat-square) |
| **`LEAF-05`** | **Digital Padlock & Compliance Tag** | Glowing green 3D digital padlock snaps shut with metallic chime; stamps immutable `LOTO-HASH-994A`. | ![PASS](https://img.shields.io/badge/LEAF--05-PASS-00E676?style=flat-square) |
| **`LEAF-06`** | **Hands-Free Voice Engine** | Speech triggers (*"Check Status"*, *"Toggle B2"*, *"Lockout Complete"*) process reliably with audio confirmations. | ![PASS](https://img.shields.io/badge/LEAF--06-PASS-00E676?style=flat-square) |
| **`LEAF-07`** | **Dynamic Thermal Heatmap** | GLSL thermodynamic gradient transitions from $68^\circ\text{C}$ amber-hot down to $21^\circ\text{C}$ cryo-blue equilibrium. | ![PASS](https://img.shields.io/badge/LEAF--07-PASS-00E676?style=flat-square) |
| **`LEAF-08`** | **1.5s Gaze Dwell Interlock** | Head raycast must dwell continuously on Terminal Pin T1 for $\ge 1.5\text{s}$ before zero-energy unlocks. | ![PASS](https://img.shields.io/badge/LEAF--08-PASS-00E676?style=flat-square) |
| **`LEAF-09`** | **Optical CV Object Detection** | YOLO spatial vision model locks onto target geometry with $99.4\%$ confidence and bounding bracket HUD. | ![PASS](https://img.shields.io/badge/LEAF--09-PASS-00E676?style=flat-square) |
| **`LEAF-10`** | **3D Exploded-View Architecture** | Front panel and busbar modules separate outward ($+25\text{ cm} / +15\text{ cm}$) in 3D world coordinates. | ![PASS](https://img.shields.io/badge/LEAF--10-PASS-00E676?style=flat-square) |
| **`LEAF-11`** | **Spatial Audio Occlusion Filter** | Closed cabinet muffles 60Hz hum to $-12\text{ dB}$ ($180\text{ Hz}$); exploded view unmasks raw $0\text{ dB}$ harmonics. | ![PASS](https://img.shields.io/badge/LEAF--11-PASS-00E676?style=flat-square) |
| **`LEAF-12`** | **Cryptographic Audit JSON Export** | Generates tamper-proof SHA-256 work-permit certificate (`LOTO-HASH-994A.json`) ready for enterprise ERP. | ![PASS](https://img.shields.io/badge/LEAF--12-PASS-00E676?style=flat-square) |

---

## 🚀 Quick Start & Local Reproduction

You can run the complete automated test suite and launch the interactive 3D spatial web simulator in under 60 seconds:

### 1. Clone the Repository
```bash
git clone https://github.com/fokrulanthro16-eng/volttwin-ar.git
cd volttwin-ar
```

### 2. Execute Automated LEAF Verification (12/12 Tests)
```bash
npx tsx tests/run_leaf_tests.ts
```
Expected output:
```
================================================================================
⚡ LEAF TEST EXECUTION: VoltTwin AR v2.0 (Learn AR with SPECS)
================================================================================
[PASS] ✓ LEAF-01: Spatial Twin Sync & Coordinate Anchoring
[PASS] ✓ LEAF-02: 3D Hazard Bounding Cage & 15cm Hand Proximity Breach Alert
...
[PASS] ✓ LEAF-12: Cryptographic Audit Log JSON Generation & LOTO-HASH-994A Integrity
--------------------------------------------------------------------------------
LEAF Test Summary: 12 Passed, 0 Failed (Total: 12)
🎉 ALL 12 DONE CRITERIA AUTOMATED LEAF TESTS PASSED SUCCESSFULLY!
```

### 3. Launch Local 3D Spatial Simulator
```bash
npx serve . -p 3000
```
Open your browser at **`http://localhost:3000`** and click:
* **`▶ AUTO-PLAY JUDGE DEMO (STUDIO NEURAL MP3)`** to experience the full synchronized 1080p demo with high-definition neural narration.
* **`📷 Live Webcam AR Pass-Through`** to project the 3D breaker cabinet into your physical room.
* **`💥 Explode Cabinet`** to animate module disassembly and hear acoustic occlusion unmasking.
* **`📥 Export Audit Log (JSON)`** to download the cryptographically signed work permit (`LOTO-HASH-994A.json`).

---

## 📂 Repository File Structure

```
volttwin-ar/
├── assets/
│   └── devpost/                     # High-DPI screenshots mirror for Devpost
│       ├── screenshot-1-spatial-anchor.png
│       ├── screenshot-2-proximity-breach.png
│       ├── screenshot-3-exploded-view.png
│       ├── screenshot-4-thermal-load.png
│       ├── screenshot-5-loto-padlock.png
│       └── screenshot-6-leaf-tests-pass.png
├── audio_output/                    # Synthesized audio layers & soundtrack
│   ├── complete_soundtrack.wav
│   ├── studio_demo_soundtrack.wav
│   └── studio_hum.wav
├── devpost/                         # Official Devpost Hackathon Documentation
│   ├── architecture.md              # Deep-dive spatial architecture brief
│   ├── design-brief.md              # Official Learn AR with SPECS design brief
│   ├── leaf-test-plan.md            # 12-Point automated test specifications
│   └── submission.md                # Complete Devpost pitch & sequence breakdown
├── public/                          # Static assets served to web simulator
│   ├── demo-narration.json          # Sub-millisecond timeline cues
│   └── demo-narration.mp3           # Studio neural voice master (Christopher -10%)
├── screenshots/                     # 1080p High-DPI screenshots
│   ├── screenshot-1-spatial-anchor.png
│   ├── screenshot-2-proximity-breach.png
│   ├── screenshot-3-exploded-view.png
│   ├── screenshot-4-thermal-load.png
│   ├── screenshot-5-loto-padlock.png
│   └── screenshot-6-leaf-tests-pass.png
├── scripts/                         # Automation & recording pipelines
│   ├── build_studio_soundtrack.py   # Multi-layer spatial audio compositor
│   ├── capture_cinematic_screenshots.py # Headless Playwright screenshot capture
│   ├── generate_studio_narration.py # Neural TTS generator (edge-tts)
│   └── record_studio_demo_video.py  # 1080p60 WebGL broadcast recorder
├── src/                             # Snap Lens Studio TypeScript Core
│   ├── ExplodedViewController.ts    # 3D kinematic module separation
│   ├── GazeDwellInterlock.ts        # 1.5s continuous raycast timer
│   ├── SimulatedPanelHardware.ts    # Virtual hardware test harness
│   ├── SpatialAudioOcclusion.ts     # Dynamic biquad acoustic filter
│   ├── SpatialObjectDetection.ts    # YOLO 99.4% optical tracking model
│   ├── ThermalHeatmapOverlay.ts     # GLSL thermodynamic Joule shader
│   ├── VoiceCommandDispatcher.ts    # Speech trigger processor
│   └── VoltTwinStateController.ts   # Deterministic FSM state machine
├── tests/                           # Automated Verification
│   ├── leaf_runtime_mock.ts         # Lens Studio SIK headless mocks
│   └── run_leaf_tests.ts            # LEAF 12/12 automated test runner
├── ARCHITECTURE.md                  # Enterprise technical reference
├── CONTRIBUTING.md                  # Contribution guidelines
├── demo-narration.mp3               # Root audio mirror
├── demo-submission.mp4              # 1080p60 final broadcast video
├── index.html                       # 3D WebGL simulator & test matrix
├── LICENSE                          # MIT License (2026)
├── README.md                        # Project documentation & overview
├── SECURITY.md                      # Safety disclaimer & vulnerability SLA
├── thumbnail_exploded.jpg           # YouTube cover thumbnail A
└── thumbnail_tagout.jpg             # YouTube cover thumbnail B
```

---

## ⚖️ License & Intellectual Property

VoltTwin AR v2.0 is licensed under the [MIT License](LICENSE) &copy; 2026 Fokrul Islam and Contributors.  
Designed natively for **Snap SPECS** and built for the **Learn AR with SPECS** hackathon on Devpost.
