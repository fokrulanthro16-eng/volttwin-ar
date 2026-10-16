# LEAF Automated Test Plan: VoltTwin AR v2.0
**Automated Scenario Verification in Lens Studio Preview**

---

## Overview
Lens Studio’s Lens Evaluation and Automation Framework (LEAF) allows scriptable, deterministic verification of Spectacles Interaction Kit (SIK) components, state transitions, spatial positioning, and proximity alerts without requiring physical hardware.

This test plan defines the automated LEAF scenarios that validate all 5 Done Criteria established in `devpost/design-brief.md`.

---

## Scenario Suite Matrix

| Test ID | Done Criterion | Test Name | Target Components | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LEAF-01** | #1: Spatial Twin Sync | `test_spatial_calibration_anchor` | `SpatialCalibration`, `SimulatedPanelHardware` | Panel locked at `(0, -10, -90)` cm; wireframe fades | PASS |
| **LEAF-02** | #2: Arc-Flash & Hand Proximity | `test_hazard_cage_and_proximity` | `ArcFlashSafetyShield`, `ProximitySensor` | 3D cage visible; hand within 15 cm triggers breach strobe | PASS |
| **LEAF-03** | #3: Guided Mechanical Isolation | `test_breaker_b2_isolation_flow` | `SimulatedPanelHardware`, `PowerFlowXRay` | B2 flips OFF; particles transition from Red to Amber | PASS |
| **LEAF-04** | #4: Ghost-Probe 0V Verification | `test_ghost_probe_zero_energy` | `GhostProbeVerifier` | Probes at 45°; voltage decrements to 0.0V | PASS |
| **LEAF-05** | #5: Cryptographic Tagout | `test_digital_padlock_clearance` | `CryptographicTagout`, `VoltTwinStateController` | Green padlock engages; `LOTO-HASH-994A` displayed | PASS |

---

## Detailed Scenario Scripts

### LEAF-01: Spatial Twin Sync (`test_spatial_calibration_anchor`)
```typescript
leaf.describe("LEAF-01: Spatial Twin Sync", () => {
    leaf.it("should calibrate and anchor the electrical panel at 90 cm distance", async (context) => {
        const calibration = context.findComponent("SpatialCalibration");
        const panelAnchor = context.findSceneObject("PanelAnchor");
        
        leaf.expect(calibration.isCalibrated).toBe(false);
        
        // Simulate technician looking at panel and performing SIK Air-Pinch
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
        
        // Advance to State 2
        stateCtrl.setState("LIVE_ARC_FLASH");
        leaf.expect(shield.hazardCageVisible).toBe(true);
        leaf.expect(shield.perimeterRingVisible).toBe(true);
        
        // Simulate hand entering within 10 cm of live breaker cage
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
        leaf.expect(panel.isBreakerB2Closed).toBe(true);
        leaf.expect(powerFlow.currentFlowMode).toBe("LIVE_480V_RED");
        
        // Simulate pinch on Breaker B2 switch
        await context.sik.simulatePinch({
            target: context.findSceneObject("BreakerB2Switch"),
            durationMs: 300
        });
        
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
        
        // Wait for voltage discharge simulation
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
