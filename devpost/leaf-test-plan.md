# LEAF Automated Test Plan: VoltTwin AR v2.0
**Automated Scenario Verification in Lens Studio Preview**

---

## Overview
Lens Studio’s Lens Evaluation and Automation Framework (LEAF) allows scriptable, deterministic verification of Spectacles Interaction Kit (SIK) components, state transitions, spatial positioning, voice commands, thermal shaders, and gaze-dwell interlocks without requiring physical hardware.

This test plan defines the automated LEAF scenarios that validate all 8 Done Criteria established in `devpost/design-brief.md`.

---

## Scenario Suite Matrix

| Test ID | Done Criterion | Test Name | Target Components | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LEAF-01** | #1: Spatial Twin Sync | `test_spatial_calibration_anchor` | `SpatialCalibration`, `SimulatedPanelHardware` | Panel locked at `(0, -10, -90)` cm; wireframe fades | PASS |
| **LEAF-02** | #2: Arc-Flash & Hand Proximity | `test_hazard_cage_and_proximity` | `ArcFlashSafetyShield`, `ProximitySensor` | 3D cage visible; hand within 15 cm triggers breach strobe | PASS |
| **LEAF-03** | #3: Guided Mechanical Isolation | `test_breaker_b2_isolation_flow` | `SimulatedPanelHardware`, `PowerFlowXRay` | B2 flips OFF; particles transition from Red to Amber | PASS |
| **LEAF-04** | #4: Ghost-Probe 0V Verification | `test_ghost_probe_zero_energy` | `GhostProbeVerifier` | Probes at 45°; voltage decrements to 0.0V | PASS |
| **LEAF-05** | #5: Cryptographic Tagout | `test_digital_padlock_clearance` | `CryptographicTagout`, `VoltTwinStateController` | Green padlock engages; `LOTO-HASH-994A` displayed | PASS |
| **LEAF-06** | #6: Hands-Free Voice Commands | `test_hands_free_voice_commands` | `VoiceCommandDispatcher`, `VoltTwinStateController` | "Toggle B2", "Lockout Complete", "Check Status" trigger state changes & audio | PASS |
| **LEAF-07** | #7: Dynamic Heatmap & Thermal Load | `test_thermal_load_overlay_transition` | `ThermalHeatmapOverlay`, `PowerFlowXRay` | Amber-hot (68°C) under high load cools to cold blue (21°C) on isolation | PASS |
| **LEAF-08** | #8: Gaze Dwell Verification Interlock | `test_gaze_dwell_safety_interlock` | `GazeDwellInterlock`, `GhostProbeVerifier` | Requires 1.5s continuous head-gaze lock on T1 before 0V verification completes | PASS |
| **LEAF-09** | #9: Spatial Object Detection Lock | `test_cv_object_detection_lock` | `SpatialObjectDetection` | CV scanning locks on Panel #HV-402 with 99.4% confidence | PASS |
| **LEAF-10** | #10: Exploded 3D View Animation | `test_exploded_view_animation` | `ExplodedViewController` | Modules smoothly expand +25cm / +15cm outward in 3D world space | PASS |
| **LEAF-11** | #11: Spatial Audio Occlusion Filter | `test_audio_occlusion_filter` | `AudioOcclusionController`, `ExplodedViewController` | -12dB (0.25) / 180Hz closed vs 0dB (1.0) / 1500Hz exploded | PASS |
| **LEAF-12** | #12: Cryptographic Audit Log Export | `test_audit_log_export_integrity` | `CryptographicTagout` | Validates signed JSON payload containing `LOTO-HASH-994A` & 0.0V | PASS |

---

## Detailed Scenario Scripts

### LEAF-01: Spatial Twin Sync (`test_spatial_calibration_anchor`)
```typescript
leaf.describe("LEAF-01: Spatial Twin Sync", () => {
    leaf.it("should calibrate and anchor the electrical panel at 90 cm distance", async (context) => {
        const calibration = context.findComponent("SpatialCalibration");
        const panelAnchor = context.findSceneObject("PanelAnchor");
        
        leaf.expect(calibration.isCalibrated).toBe(false);
        
        await context.sik.simulatePinch({
            target: context.findSceneObject("CalibrationButton"),
            durationMs: 250
        });
        
        leaf.expect(calibration.isCalibrated).toBe(true);
        const pos = panelAnchor.getTransform().getWorldPosition();
        leaf.expect(pos.z).toBeCloseTo(-90.0, 5.0);
        leaf.expect(pos.y).toBeCloseTo(-10.0, 5.0);
    });
});
```

### LEAF-02: Arc-Flash & Hand Proximity (`test_hazard_cage_and_proximity`)
```typescript
leaf.describe("LEAF-02: Live Arc-Flash Hazard & Proximity Breach", () => {
    leaf.it("should display pulsing cage and trigger alarm when hand breaches 15 cm", async (context) => {
        const shield = context.findComponent("ArcFlashSafetyShield");
        const proximity = context.findComponent("ProximitySensor");
        const stateCtrl = context.findComponent("VoltTwinStateController");
        
        stateCtrl.setState("LIVE_ARC_FLASH");
        leaf.expect(shield.hazardCageVisible).toBe(true);
        leaf.expect(shield.perimeterRingVisible).toBe(true);
        
        const hazardPos = shield.getHazardCenter();
        await context.sik.simulateHandMove({
            position: new vec3(hazardPos.x, hazardPos.y, hazardPos.z + 10.0),
            durationMs: 300
        });
        
        leaf.expect(proximity.isBreached).toBe(true);
        leaf.expect(shield.isStrobeActive).toBe(true);
    });
});
```

### LEAF-03: Guided Mechanical Isolation (`test_breaker_b2_isolation_flow`)
```typescript
leaf.describe("LEAF-03: Guided Mechanical Isolation", () => {
    leaf.it("should flip B2 OFF and switch power flow from Red to Amber", async (context) => {
        const stateCtrl = context.findComponent("VoltTwinStateController");
        const panel = context.findComponent("SimulatedPanelHardware");
        const powerFlow = context.findComponent("PowerFlowXRay");
        
        stateCtrl.setState("MECHANICAL_ISOLATION");
        leaf.expect(panel.isBreakerB2Closed).toBe(false);
        leaf.expect(powerFlow.currentFlowMode).toBe("RESIDUAL_AMBER");
    });
});
```

### LEAF-04: Ghost-Probe Zero-Energy Verification (`test_ghost_probe_zero_energy`)
```typescript
leaf.describe("LEAF-04: Ghost-Probe Zero-Energy Verification", () => {
    leaf.it("should position probes at T1-T2 and count down to 0.0V verified", async (context) => {
        const stateCtrl = context.findComponent("VoltTwinStateController");
        const probeVerifier = context.findComponent("GhostProbeVerifier");
        
        stateCtrl.setState("ZERO_ENERGY_VERIFICATION");
        leaf.expect(probeVerifier.probesVisible).toBe(true);
        
        await context.wait(2000);
        leaf.expect(probeVerifier.measuredVoltage).toBe(0.0);
        leaf.expect(probeVerifier.isZeroEnergyVerified).toBe(true);
    });
});
```

### LEAF-05: Immutable Cryptographic Tagout (`test_digital_padlock_clearance`)
```typescript
leaf.describe("LEAF-05: Immutable Cryptographic Tagout", () => {
    leaf.it("should engage glowing green padlock and render compliance badge", async (context) => {
        const stateCtrl = context.findComponent("VoltTwinStateController");
        const tagout = context.findComponent("CryptographicTagout");
        
        stateCtrl.setState("CRYPTOGRAPHIC_TAGOUT");
        leaf.expect(tagout.isPadlockLocked).toBe(true);
        leaf.expect(tagout.complianceBadgeText).toContain("LOTO-HASH-994A");
        leaf.expect(tagout.isPermitCleared).toBe(true);
    });
});
```

### LEAF-06: Hands-Free Voice Commands (`test_hands_free_voice_commands`)
```typescript
leaf.describe("LEAF-06: Hands-Free Voice Commands", () => {
    leaf.it("should dispatch 'Check Status', 'Toggle B2', and 'Lockout Complete' with audio feedback", async (context) => {
        const voiceDispatcher = context.findComponent("VoiceCommandDispatcher");
        const stateCtrl = context.findComponent("VoltTwinStateController");
        const panel = context.findComponent("SimulatedPanelHardware");
        
        // Voice query status
        const statusResponse = voiceDispatcher.dispatchVoiceCommand("Check Status");
        leaf.expect(statusResponse).toContain("STATUS");
        leaf.expect(voiceDispatcher.lastAudioPlayed).toBe("VOICE_CHIME_CONFIRM");
        
        // Voice toggle breaker B2
        voiceDispatcher.dispatchVoiceCommand("Toggle B2");
        leaf.expect(stateCtrl.currentState).toBe("MECHANICAL_ISOLATION");
        leaf.expect(panel.isBreakerB2Closed).toBe(false);
        
        // Voice complete lockout
        voiceDispatcher.dispatchVoiceCommand("Lockout Complete");
        leaf.expect(stateCtrl.currentState).toBe("CRYPTOGRAPHIC_TAGOUT");
    });
});
```

### LEAF-07: Dynamic Heatmap & Thermal Load (`test_thermal_load_overlay_transition`)
```typescript
leaf.describe("LEAF-07: Dynamic Heatmap & Thermal Load Overlay", () => {
    leaf.it("should display amber-hot (68°C) under high load and cool to cold blue (21°C)", async (context) => {
        const thermal = context.findComponent("ThermalHeatmapOverlay");
        
        thermal.setElectricalLoad(480.0, true);
        leaf.expect(thermal.temperatureCelsius).toBeCloseTo(68.0, 1.0);
        leaf.expect(thermal.thermalGradientColor.x).toBeGreaterThan(0.8); // High red/amber component
        
        // De-energize and simulate cooling
        thermal.setElectricalLoad(0.0, false);
        await context.wait(2000);
        leaf.expect(thermal.temperatureCelsius).toBeCloseTo(21.0, 1.0);
        leaf.expect(thermal.thermalGradientColor.z).toBeGreaterThan(0.8); // Cold blue component
    });
});
```

### LEAF-08: Gaze Dwell Verification Safety Interlock (`test_gaze_dwell_safety_interlock`)
```typescript
leaf.describe("LEAF-08: Gaze Dwell Verification Safety Interlock", () => {
    leaf.it("should require 1.5s continuous head-gaze lock on T1 before unlocking 0V verification", async (context) => {
        const gaze = context.findComponent("GazeDwellInterlock");
        const probeVerifier = context.findComponent("GhostProbeVerifier");
        
        gaze.startGazeTracking("TerminalPinT1");
        leaf.expect(gaze.isDwellLocked).toBe(false);
        leaf.expect(gaze.dwellProgress).toBe(0.0);
        
        // Incomplete gaze dwell (< 1.5s)
        gaze.simulateGazeDwell(0.8); // 800ms
        leaf.expect(gaze.dwellProgress).toBeCloseTo(0.53, 0.05);
        leaf.expect(gaze.isDwellLocked).toBe(false);
        
        // Reach full 1.5s dwell threshold
        gaze.simulateGazeDwell(0.7); // 800ms + 700ms = 1500ms
        leaf.expect(gaze.isDwellLocked).toBe(true);
        leaf.expect(gaze.dwellProgress).toBe(1.0);
        leaf.expect(probeVerifier.canConfirmZeroEnergy).toBe(true);
    });
});
```

### LEAF-09: Spatial Object Detection Lock (`test_cv_object_detection_lock`)
```typescript
leaf.describe("LEAF-09: Spatial Object Detection Lock", () => {
    leaf.it("should simulate optical CV scanning and lock on Panel #HV-402 with 99.4% confidence", async (context) => {
        const objectDetection = context.findComponent("SpatialObjectDetection");
        
        objectDetection.startScan();
        leaf.expect(objectDetection.isLocked).toBe(false);
        leaf.expect(objectDetection.confidenceScore).toBe(0.0);
        
        // Simulate CV processing duration
        await context.wait(1500);
        leaf.expect(objectDetection.isLocked).toBe(true);
        leaf.expect(objectDetection.confidenceScore).toBeCloseTo(0.994, 0.005);
        leaf.expect(objectDetection.hudStatusText).toContain("CONFIDENCE: 99.4%");
    });
});
```

### LEAF-10: Exploded 3D View Animation (`test_exploded_view_animation`)
```typescript
leaf.describe("LEAF-10: Exploded 3D View Animation", () => {
    leaf.it("should smoothly animate cabinet modules outward to expose internal wiring", async (context) => {
        const explodedController = context.findComponent("ExplodedViewController");
        const frontDoor = context.findSceneObject("FrontDoor");
        
        leaf.expect(explodedController.isExploded).toBe(false);
        leaf.expect(explodedController.explosionProgress).toBe(0.0);
        
        explodedController.setExploded(true);
        leaf.expect(explodedController.isExploded).toBe(true);
        
        // Wait for smooth lerp expansion
        await context.wait(1000);
        leaf.expect(explodedController.explosionProgress).toBeCloseTo(1.0, 0.05);
        const doorPos = frontDoor.getTransform().getWorldPosition();
        leaf.expect(doorPos.z).toBeCloseTo(25.0, 2.0); // +25cm outward
    });
});
```

### LEAF-11: Spatial Audio Occlusion Filter (`test_audio_occlusion_filter`)
```typescript
leaf.describe("LEAF-11: Spatial Audio Occlusion Filter", () => {
    leaf.it("should attenuate hum to 0.25 / 180Hz when closed and unmask to 1.0 / 1500Hz when exploded", async (context) => {
        const audioOcclusion = context.findComponent("AudioOcclusionController");
        const explodedController = context.findComponent("ExplodedViewController");

        // Closed cabinet
        explodedController.setExploded(false);
        await context.wait(1000);
        leaf.expect(audioOcclusion.calculateOcclusionGain(false)).toBeCloseTo(0.25, 0.01);
        leaf.expect(audioOcclusion.calculateCutoffHz(false)).toBe(180);

        // Exploded view
        explodedController.setExploded(true);
        await context.wait(1000);
        leaf.expect(audioOcclusion.calculateOcclusionGain(true)).toBeCloseTo(1.0, 0.01);
        leaf.expect(audioOcclusion.calculateCutoffHz(true)).toBe(1500);
    });
});
```

### LEAF-12: Cryptographic Audit Log Export (`test_audit_log_export_integrity`)
```typescript
leaf.describe("LEAF-12: Cryptographic Audit Log Export", () => {
    leaf.it("should export a valid signed JSON certificate with LOTO-HASH-994A and 0.0V verified", async (context) => {
        const stateCtrl = context.findComponent("VoltTwinStateController");
        const tagout = context.findComponent("CryptographicTagout");

        stateCtrl.setState("CRYPTOGRAPHIC_TAGOUT");
        const json = tagout.exportAuditLogJson();
        const audit = JSON.parse(json);

        leaf.expect(audit.cryptographicHash).toBe("LOTO-HASH-994A");
        leaf.expect(audit.status).toBe("CLEARED_FOR_MAINTENANCE");
        leaf.expect(audit.safetyVerification.voltageVerified).toBe(0.0);
        leaf.expect(audit.hardwareTarget.device).toBe("Snap SPECS AR Glasses");
    });
});
```

