/**
 * run_leaf_tests.ts
 * Executes the complete LEAF automated test suite for VoltTwin AR v2.0.
 */

import {
    LEAFTestRunner,
    LEAFContext,
    MockSceneObject,
    MockVec3
} from "./leaf_runtime_mock.ts";

import { LOTOState, PowerFlowMode } from "../src/VoltTwinTypes.ts";
import { SpatialCalibration } from "../src/SpatialCalibration.ts";
import { ArcFlashSafetyShield } from "../src/ArcFlashSafetyShield.ts";
import { ProximitySensor } from "../src/ProximitySensor.ts";
import { PowerFlowXRay } from "../src/PowerFlowXRay.ts";
import { GhostProbeVerifier } from "../src/GhostProbeVerifier.ts";
import { CryptographicTagout } from "../src/CryptographicTagout.ts";
import { SimulatedPanelHardware } from "../src/SimulatedPanelHardware.ts";
import { VoltTwinStateController } from "../src/VoltTwinStateController.ts";

// Set up Scene Hierarchy
const sceneObjects = new Map<string, MockSceneObject>();
const components = new Map<string, any>();

function createScene(): LEAFContext {
    const panelAnchor = new MockSceneObject("PanelAnchor");
    const lidarGrid = new MockSceneObject("LidarGrid");
    const calibrationPill = new MockSceneObject("CalibrationPill");
    const calibrationButton = new MockSceneObject("CalibrationButton");
    const hazardCage = new MockSceneObject("HazardCage");
    const perimeterRing = new MockSceneObject("PerimeterRing");
    const hazardLabel = new MockSceneObject("HazardLabel");
    const strobeLight = new MockSceneObject("StrobeLight");
    const handTrackingAnchor = new MockSceneObject("HandTrackingAnchor");
    const breakerB2Switch = new MockSceneObject("BreakerB2Switch");
    const redProbe = new MockSceneObject("RedProbe");
    const blackProbe = new MockSceneObject("BlackProbe");
    const voltagePill = new MockSceneObject("VoltagePill");
    const digitalPadlock = new MockSceneObject("DigitalPadlock");
    const complianceBadge = new MockSceneObject("ComplianceBadge");
    const instructionPill = new MockSceneObject("InstructionPill");

    sceneObjects.set("PanelAnchor", panelAnchor);
    sceneObjects.set("LidarGrid", lidarGrid);
    sceneObjects.set("CalibrationPill", calibrationPill);
    sceneObjects.set("CalibrationButton", calibrationButton);
    sceneObjects.set("HazardCage", hazardCage);
    sceneObjects.set("PerimeterRing", perimeterRing);
    sceneObjects.set("HazardLabel", hazardLabel);
    sceneObjects.set("StrobeLight", strobeLight);
    sceneObjects.set("HandTrackingAnchor", handTrackingAnchor);
    sceneObjects.set("BreakerB2Switch", breakerB2Switch);
    sceneObjects.set("RedProbe", redProbe);
    sceneObjects.set("BlackProbe", blackProbe);
    sceneObjects.set("VoltagePill", voltagePill);
    sceneObjects.set("DigitalPadlock", digitalPadlock);
    sceneObjects.set("ComplianceBadge", complianceBadge);
    sceneObjects.set("InstructionPill", instructionPill);

    // Initial transforms
    panelAnchor.getTransform().setWorldPosition(new MockVec3(0, 0, 0));
    hazardCage.getTransform().setWorldPosition(new MockVec3(0, 12, -85));
    handTrackingAnchor.getTransform().setWorldPosition(new MockVec3(50, 0, -50)); // Safely away initially

    // Instantiate Components
    const spatialCalibration = new SpatialCalibration();
    spatialCalibration.panelAnchorObject = panelAnchor as any;
    spatialCalibration.lidarGridObject = lidarGrid as any;
    spatialCalibration.calibrationPillObject = calibrationPill as any;
    spatialCalibration.onAwake();

    const safetyShield = new ArcFlashSafetyShield();
    safetyShield.hazardCageObject = hazardCage as any;
    safetyShield.perimeterRingObject = perimeterRing as any;
    safetyShield.hazardLabelObject = hazardLabel as any;
    safetyShield.strobeLightObject = strobeLight as any;
    safetyShield.onAwake();

    const proximitySensor = new ProximitySensor();
    proximitySensor.safetyShield = safetyShield;
    proximitySensor.handTrackingAnchor = handTrackingAnchor as any;
    proximitySensor.warningThresholdCm = 15.0;
    proximitySensor.onAwake();

    const powerFlowXRay = new PowerFlowXRay();
    powerFlowXRay.onAwake();

    const ghostProbeVerifier = new GhostProbeVerifier();
    ghostProbeVerifier.redProbeObject = redProbe as any;
    ghostProbeVerifier.blackProbeObject = blackProbe as any;
    ghostProbeVerifier.voltageDisplayPillObject = voltagePill as any;
    ghostProbeVerifier.voltageTextComponent = { text: "" } as any;
    ghostProbeVerifier.onAwake();

    const cryptographicTagout = new CryptographicTagout();
    cryptographicTagout.digitalPadlockObject = digitalPadlock as any;
    cryptographicTagout.complianceBadgeObject = complianceBadge as any;
    cryptographicTagout.badgeTextComponent = { text: "" } as any;
    cryptographicTagout.onAwake();

    const panelHardware = new SimulatedPanelHardware();
    panelHardware.breakerB2SwitchObject = breakerB2Switch as any;
    panelHardware.onAwake();

    const stateController = new VoltTwinStateController();
    stateController.spatialCalibration = spatialCalibration;
    stateController.safetyShield = safetyShield;
    stateController.proximitySensor = proximitySensor;
    stateController.powerFlowXRay = powerFlowXRay;
    stateController.ghostProbeVerifier = ghostProbeVerifier;
    stateController.cryptographicTagout = cryptographicTagout;
    stateController.panelHardware = panelHardware;
    stateController.stateInstructionPill = instructionPill as any;
    stateController.stateInstructionText = { text: "" } as any;
    stateController.onAwake();

    components.set("SpatialCalibration", spatialCalibration);
    components.set("ArcFlashSafetyShield", safetyShield);
    components.set("ProximitySensor", proximitySensor);
    components.set("PowerFlowXRay", powerFlowXRay);
    components.set("GhostProbeVerifier", ghostProbeVerifier);
    components.set("CryptographicTagout", cryptographicTagout);
    components.set("SimulatedPanelHardware", panelHardware);
    components.set("VoltTwinStateController", stateController);

    return {
        findSceneObject: (name: string) => sceneObjects.get(name)!,
        findComponent: (name: string) => components.get(name),
        sik: {
            simulatePinch: async (options: { target?: MockSceneObject; durationMs?: number }) => {
                if (options.target?.name === "CalibrationButton") {
                    spatialCalibration.lockAnchor();
                } else if (options.target?.name === "BreakerB2Switch") {
                    panelHardware.toggleBreakerB2();
                    if (!panelHardware.isBreakerB2Closed) {
                        powerFlowXRay.setMode(PowerFlowMode.RESIDUAL_AMBER);
                    }
                }
            },
            simulateHandMove: async (options: { position: MockVec3; durationMs?: number }) => {
                handTrackingAnchor.getTransform().setWorldPosition(options.position);
                (proximitySensor as any).triggerEvent("UpdateEvent");
                (safetyShield as any).triggerEvent("UpdateEvent");
            }
        },
        wait: async (ms: number) => {
            // Fast-forward simulated delta updates
            const steps = Math.max(1, Math.floor(ms / 16));
            for (let i = 0; i < steps; i++) {
                (ghostProbeVerifier as any).triggerEvent("UpdateEvent");
            }
        }
    };
}

async function runAllTests() {
    console.log("================================================================================");
    console.log("⚡ LEAF TEST EXECUTION: VoltTwin AR v2.0 (Learn AR with SPECS)");
    console.log("================================================================================\n");

    const leaf = new LEAFTestRunner();
    const context = createScene();

    // LEAF-01
    leaf.describe("LEAF-01: Spatial Twin Sync", () => {
        leaf.it("LEAF-01: Spatial Twin Sync & Coordinate Anchoring", async (ctx) => {
            const calibration = ctx.findComponent("SpatialCalibration");
            const panelAnchor = ctx.findSceneObject("PanelAnchor");

            leaf.expect(calibration.isCalibrated).toBe(false);

            await ctx.sik.simulatePinch({
                target: ctx.findSceneObject("CalibrationButton"),
                durationMs: 250
            });

            leaf.expect(calibration.isCalibrated).toBe(true);
            const pos = panelAnchor.getTransform().getWorldPosition();
            leaf.expect(pos.z).toBeCloseTo(-90.0, 5.0);
            leaf.expect(pos.y).toBeCloseTo(-10.0, 5.0);
        });
    });

    // LEAF-02
    leaf.describe("LEAF-02: Live Arc-Flash Hazard & Proximity Breach", () => {
        leaf.it("LEAF-02: 3D Hazard Bounding Cage & 15cm Hand Proximity Breach Alert", async (ctx) => {
            const shield = ctx.findComponent("ArcFlashSafetyShield");
            const proximity = ctx.findComponent("ProximitySensor");
            const stateCtrl = ctx.findComponent("VoltTwinStateController");

            stateCtrl.setState(LOTOState.LIVE_ARC_FLASH);
            leaf.expect(shield.hazardCageVisible).toBe(true);
            leaf.expect(shield.perimeterRingVisible).toBe(true);
            leaf.expect(proximity.isArmed).toBe(true);

            // Breach proximity (< 15 cm)
            const hazardPos = shield.getHazardCenter();
            await ctx.sik.simulateHandMove({
                position: new MockVec3(hazardPos.x, hazardPos.y, hazardPos.z + 10.0), // 10 cm away
                durationMs: 300
            });

            leaf.expect(proximity.isBreached).toBe(true);
            leaf.expect(shield.isStrobeActive).toBe(true);
        });
    });

    // LEAF-03
    leaf.describe("LEAF-03: Guided Mechanical Isolation", () => {
        leaf.it("LEAF-03: Guided Mechanical Isolation & Residual Amber Power Flow", async (ctx) => {
            const stateCtrl = ctx.findComponent("VoltTwinStateController");
            const panel = ctx.findComponent("SimulatedPanelHardware");
            const powerFlow = ctx.findComponent("PowerFlowXRay");

            stateCtrl.setState(LOTOState.MECHANICAL_ISOLATION);
            leaf.expect(panel.isBreakerB2Closed).toBe(false);
            leaf.expect(powerFlow.currentFlowMode).toBe(PowerFlowMode.RESIDUAL_AMBER);
        });
    });

    // LEAF-04
    leaf.describe("LEAF-04: Ghost-Probe Zero-Energy Verification", () => {
        leaf.it("LEAF-04: 3D Ghost Multimeter Probes & 480V -> 0.0V Discharge Countdown", async (ctx) => {
            const stateCtrl = ctx.findComponent("VoltTwinStateController");
            const probeVerifier = ctx.findComponent("GhostProbeVerifier");

            stateCtrl.setState(LOTOState.ZERO_ENERGY_VERIFICATION);
            leaf.expect(probeVerifier.probesVisible).toBe(true);

            // Simulate elapsed discharge countdown
            await ctx.wait(3000);
            leaf.expect(probeVerifier.measuredVoltage).toBe(0.0);
            leaf.expect(probeVerifier.isZeroEnergyVerified).toBe(true);
        });
    });

    // LEAF-05
    leaf.describe("LEAF-05: Immutable Cryptographic Tagout", () => {
        leaf.it("LEAF-05: 3D Glowing Digital Padlock & LOTO-HASH-994A Compliance Badge", async (ctx) => {
            const stateCtrl = ctx.findComponent("VoltTwinStateController");
            const tagout = ctx.findComponent("CryptographicTagout");
            const powerFlow = ctx.findComponent("PowerFlowXRay");

            stateCtrl.setState(LOTOState.CRYPTOGRAPHIC_TAGOUT);
            leaf.expect(tagout.isPadlockLocked).toBe(true);
            leaf.expect(tagout.complianceBadgeText).toContain("LOTO-HASH-994A");
            leaf.expect(tagout.isPermitCleared).toBe(true);
            leaf.expect(powerFlow.currentFlowMode).toBe(PowerFlowMode.SAFE_EMERALD);
        });
    });

    // Execute Tests
    let passCount = 0;
    let failCount = 0;

    for (const test of leaf.tests) {
        try {
            await test.fn(context);
            console.log(`[PASS] ✓ ${test.name}`);
            passCount++;
        } catch (err: any) {
            console.error(`[FAIL] ✗ ${test.name}: ${err.message}`);
            failCount++;
        }
    }

    console.log("\n--------------------------------------------------------------------------------");
    console.log(`LEAF Test Summary: ${passCount} Passed, ${failCount} Failed (Total: ${leaf.tests.length})`);
    console.log("--------------------------------------------------------------------------------");

    if (failCount === 0) {
        console.log("🎉 ALL 5 DONE CRITERIA AUTOMATED LEAF TESTS PASSED SUCCESSFULLY!");
    } else {
        process.exit(1);
    }
}

runAllTests().catch((err) => {
    console.error("Test execution error:", err);
    process.exit(1);
});
