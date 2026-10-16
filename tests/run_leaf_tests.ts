/**
 * run_leaf_tests.ts
 * Executes the complete LEAF automated test suite for VoltTwin AR v2.0.
 * Validates all 10 Done Criteria:
 *   LEAF-01: Spatial Twin Sync (Calibration & 90cm Anchor)
 *   LEAF-02: Live Arc-Flash Hazard & 15cm Hand Proximity Breach
 *   LEAF-03: Guided Mechanical Isolation (Breaker B2 Toggle & Residual Amber Flow)
 *   LEAF-04: Ghost-Probe Zero-Energy Verification (T1-T2 480V -> 0.0V Discharge)
 *   LEAF-05: Immutable Cryptographic Tagout (Glowing Padlock & LOTO-HASH-994A)
 *   LEAF-06: Hands-Free Voice Commands ("Check Status", "Toggle B2", "Lockout Complete")
 *   LEAF-07: Dynamic Heatmap & Thermal Load Overlay (Amber-hot 68°C to Cold-blue 21°C)
 *   LEAF-08: Gaze Dwell Verification Safety Interlock (1.5s lock on T1)
 *   LEAF-09: Real-Time Spatial Object Detection Simulation (99.4% confidence lock)
 *   LEAF-10: 3D Exploded-View Architecture (+25cm / +15cm expansion)
 *   LEAF-11: Spatial Audio Occlusion Filter (-12dB / 0.25 Closed vs 0dB / 1.0 Exploded)
 *   LEAF-12: Cryptographic Audit Log Export (LOTO-HASH-994A Certificate JSON)
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
import { VoiceCommandDispatcher } from "../src/VoiceCommandDispatcher.ts";
import { ThermalHeatmapOverlay } from "../src/ThermalHeatmapOverlay.ts";
import { GazeDwellInterlock } from "../src/GazeDwellInterlock.ts";
import { SpatialObjectDetection } from "../src/SpatialObjectDetection.ts";
import { ExplodedViewController } from "../src/ExplodedViewController.ts";
import { RemoteSupervisorTelemetry } from "../src/RemoteSupervisorTelemetry.ts";
import { AudioOcclusionController } from "../src/AudioOcclusionController.ts";

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
    const gazeRadialRing = new MockSceneObject("GazeRadialRing");
    const terminalPinT1 = new MockSceneObject("TerminalPinT1");

    // 3D Exploded View Objects
    const frontDoor = new MockSceneObject("FrontDoor");
    const busbarModule = new MockSceneObject("BusbarModule");
    const terminalModule = new MockSceneObject("TerminalModule");

    // CV Tracking Object
    const cvTrackingBox = new MockSceneObject("CVTrackingBox");

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
    sceneObjects.set("GazeRadialRing", gazeRadialRing);
    sceneObjects.set("TerminalPinT1", terminalPinT1);
    sceneObjects.set("FrontDoor", frontDoor);
    sceneObjects.set("BusbarModule", busbarModule);
    sceneObjects.set("TerminalModule", terminalModule);
    sceneObjects.set("CVTrackingBox", cvTrackingBox);

    // Initial transforms
    panelAnchor.getTransform().setWorldPosition(new MockVec3(0, 0, 0));
    frontDoor.getTransform().setWorldPosition(new MockVec3(0, 0, 0));
    busbarModule.getTransform().setWorldPosition(new MockVec3(0, 18, 14));
    terminalModule.getTransform().setWorldPosition(new MockVec3(14, -14, 14));
    hazardCage.getTransform().setWorldPosition(new MockVec3(0, 12, -85));
    handTrackingAnchor.getTransform().setWorldPosition(new MockVec3(50, 0, -50));
    terminalPinT1.getTransform().setWorldPosition(new MockVec3(14, -18, -85));

    // Instantiate Subsystems
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
    safetyShield.plasmaBlastObject = new MockSceneObject("PlasmaBlast") as any;
    safetyShield.onAwake();

    const proximitySensor = new ProximitySensor();
    proximitySensor.safetyShield = safetyShield;
    proximitySensor.handTrackingAnchor = handTrackingAnchor as any;
    proximitySensor.warningThresholdCm = 15.0;
    proximitySensor.onAwake();

    const powerFlowXRay = new PowerFlowXRay();
    powerFlowXRay.onAwake();

    const thermalOverlay = new ThermalHeatmapOverlay();
    thermalOverlay.conduitTargetObject = new MockSceneObject("ConduitMesh");
    thermalOverlay.onAwake();

    const gazeInterlock = new GazeDwellInterlock();
    gazeInterlock.terminalT1Target = terminalPinT1 as any;
    gazeInterlock.gazeRadialRingObject = gazeRadialRing as any;
    gazeInterlock.onAwake();

    const ghostProbeVerifier = new GhostProbeVerifier();
    ghostProbeVerifier.redProbeObject = redProbe as any;
    ghostProbeVerifier.blackProbeObject = blackProbe as any;
    ghostProbeVerifier.voltageDisplayPillObject = voltagePill as any;
    ghostProbeVerifier.voltageTextComponent = { text: "" } as any;
    ghostProbeVerifier.gazeInterlock = gazeInterlock;
    ghostProbeVerifier.onAwake();

    const cryptographicTagout = new CryptographicTagout();
    cryptographicTagout.digitalPadlockObject = digitalPadlock as any;
    cryptographicTagout.complianceBadgeObject = complianceBadge as any;
    cryptographicTagout.badgeTextComponent = { text: "" } as any;
    cryptographicTagout.onAwake();

    const panelHardware = new SimulatedPanelHardware();
    panelHardware.breakerB2SwitchObject = breakerB2Switch as any;
    panelHardware.onAwake();

    const objectDetection = new SpatialObjectDetection();
    objectDetection.trackingBoxObject = cvTrackingBox as any;
    objectDetection.hudTextComponent = { text: "" } as any;
    objectDetection.onAwake();

    const explodedController = new ExplodedViewController();
    explodedController.frontDoorObject = frontDoor as any;
    explodedController.busbarModuleObject = busbarModule as any;
    explodedController.terminalModuleObject = terminalModule as any;
    explodedController.onAwake();

    const remoteSupervisor = new RemoteSupervisorTelemetry();
    remoteSupervisor.supervisorNameText = { text: "" } as any;
    remoteSupervisor.linkStatusText = { text: "" } as any;
    remoteSupervisor.onAwake();

    const audioOcclusionController = new AudioOcclusionController();
    audioOcclusionController.explodedController = explodedController;
    audioOcclusionController.onAwake();

    const stateController = new VoltTwinStateController();
    stateController.spatialCalibration = spatialCalibration;
    stateController.safetyShield = safetyShield;
    stateController.proximitySensor = proximitySensor;
    stateController.powerFlowXRay = powerFlowXRay;
    stateController.ghostProbeVerifier = ghostProbeVerifier;
    stateController.cryptographicTagout = cryptographicTagout;
    stateController.panelHardware = panelHardware;
    stateController.thermalOverlay = thermalOverlay;
    stateController.gazeInterlock = gazeInterlock;
    stateController.objectDetection = objectDetection;
    stateController.explodedController = explodedController;
    stateController.remoteSupervisor = remoteSupervisor;
    stateController.audioOcclusionController = audioOcclusionController;
    stateController.stateInstructionPill = instructionPill as any;
    stateController.stateInstructionText = { text: "" } as any;
    stateController.onAwake();

    const voiceDispatcher = new VoiceCommandDispatcher();
    voiceDispatcher.stateController = stateController;
    voiceDispatcher.panelHardware = panelHardware;
    voiceDispatcher.explodedController = explodedController;
    voiceDispatcher.onAwake();

    components.set("SpatialCalibration", spatialCalibration);
    components.set("ArcFlashSafetyShield", safetyShield);
    components.set("ProximitySensor", proximitySensor);
    components.set("PowerFlowXRay", powerFlowXRay);
    components.set("ThermalHeatmapOverlay", thermalOverlay);
    components.set("GazeDwellInterlock", gazeInterlock);
    components.set("GhostProbeVerifier", ghostProbeVerifier);
    components.set("CryptographicTagout", cryptographicTagout);
    components.set("SimulatedPanelHardware", panelHardware);
    components.set("SpatialObjectDetection", objectDetection);
    components.set("ExplodedViewController", explodedController);
    components.set("RemoteSupervisorTelemetry", remoteSupervisor);
    components.set("AudioOcclusionController", audioOcclusionController);
    components.set("VoltTwinStateController", stateController);
    components.set("VoiceCommandDispatcher", voiceDispatcher);

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
                        thermalOverlay.setElectricalLoad(180.0, true, true);
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
            const steps = Math.max(1, Math.floor(ms / 16));
            for (let i = 0; i < steps; i++) {
                (ghostProbeVerifier as any).triggerEvent("UpdateEvent");
                (thermalOverlay as any).triggerEvent("UpdateEvent");
                (gazeInterlock as any).triggerEvent("UpdateEvent");
                (objectDetection as any).triggerEvent("UpdateEvent");
                (explodedController as any).triggerEvent("UpdateEvent");
                (audioOcclusionController as any).triggerEvent("UpdateEvent");
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

    // LEAF-01: Spatial Twin Sync
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

    // LEAF-02: Live Arc-Flash Hazard & Proximity Breach
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
            leaf.expect(shield.isPlasmaActive).toBe(true);
        });
    });

    // LEAF-03: Guided Mechanical Isolation
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

    // LEAF-04: Ghost-Probe Zero-Energy Verification
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

    // LEAF-05: Immutable Cryptographic Tagout
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

    // LEAF-06: Hands-Free Voice Commands
    leaf.describe("LEAF-06: Hands-Free Voice Commands", () => {
        leaf.it("LEAF-06: Hands-Free Voice Commands ('Check Status', 'Toggle B2', 'Lockout Complete')", async (ctx) => {
            const voiceDispatcher = ctx.findComponent("VoiceCommandDispatcher");
            const stateCtrl = ctx.findComponent("VoltTwinStateController");
            const panel = ctx.findComponent("SimulatedPanelHardware");

            // Voice: "Check Status"
            const statusResponse = voiceDispatcher.dispatchVoiceCommand("Check Status");
            leaf.expect(statusResponse).toContain("CURRENT STATUS");
            leaf.expect(voiceDispatcher.lastAudioPlayed).toBe("VOICE_CHIME_CONFIRM");

            // Voice: "Toggle B2"
            voiceDispatcher.dispatchVoiceCommand("Toggle B2");
            leaf.expect(stateCtrl.currentState).toBe(LOTOState.MECHANICAL_ISOLATION);
            leaf.expect(panel.isBreakerB2Closed).toBe(false);
            leaf.expect(voiceDispatcher.lastAudioPlayed).toBe("BREAKER_TRIP_AUDIO");

            // Voice: "Lockout Complete"
            voiceDispatcher.dispatchVoiceCommand("Lockout Complete");
            leaf.expect(stateCtrl.currentState).toBe(LOTOState.CRYPTOGRAPHIC_TAGOUT);
            leaf.expect(voiceDispatcher.lastAudioPlayed).toBe("LOCK_ENGAGE_AUDIO");
        });
    });

    // LEAF-07: Dynamic Heatmap & Thermal Load Overlay
    leaf.describe("LEAF-07: Dynamic Heatmap & Thermal Load", () => {
        leaf.it("LEAF-07: Dynamic Heatmap & Thermal Load Overlay (Amber-hot to Cold Cryo-blue)", async (ctx) => {
            const thermal = ctx.findComponent("ThermalHeatmapOverlay");

            // Initial high load state (480V, high current)
            thermal.setElectricalLoad(480.0, true, true);
            leaf.expect(thermal.temperatureCelsius).toBeCloseTo(68.0, 1.0);
            leaf.expect(thermal.thermalGradientColor.x).toBeGreaterThan(0.7); // High red/amber

            // De-energize to zero load and simulate thermal decay
            thermal.setElectricalLoad(0.0, false);
            await ctx.wait(2000);

            // Cold cryo-blue temperature
            leaf.expect(thermal.temperatureCelsius).toBeCloseTo(21.0, 1.5);
            leaf.expect(thermal.thermalGradientColor.z).toBeGreaterThan(0.7); // High blue component
        });
    });

    // LEAF-08: Gaze Dwell Verification Safety Interlock
    leaf.describe("LEAF-08: Gaze Dwell Safety Interlock", () => {
        leaf.it("LEAF-08: Gaze Dwell Verification Safety Interlock (1.5s lock on Terminal Pin T1)", async (ctx) => {
            const gaze = ctx.findComponent("GazeDwellInterlock");
            const probeVerifier = ctx.findComponent("GhostProbeVerifier");

            gaze.startGazeTracking("TerminalPinT1");
            leaf.expect(gaze.isDwellLocked).toBe(false);
            leaf.expect(gaze.dwellProgress).toBe(0.0);

            // Incomplete dwell: 0.8s (< 1.5s threshold)
            gaze.simulateGazeDwell(0.8);
            leaf.expect(gaze.dwellProgress).toBeCloseTo(0.53, 0.05);
            leaf.expect(gaze.isDwellLocked).toBe(false);

            // Complete dwell: +0.7s (total 1.5s)
            gaze.simulateGazeDwell(0.7);
            leaf.expect(gaze.isDwellLocked).toBe(true);
            leaf.expect(gaze.dwellProgress).toBe(1.0);
            leaf.expect(probeVerifier.canConfirmZeroEnergy).toBe(true);
        });
    });

    // LEAF-09: Real-Time Spatial Object Detection Simulation
    leaf.describe("LEAF-09: Spatial Object Detection Lock", () => {
        leaf.it("LEAF-09: Spatial Object Detection Simulation (99.4% confidence lock on Panel #HV-402)", async (ctx) => {
            const objectDetection = ctx.findComponent("SpatialObjectDetection");

            objectDetection.startScan();
            leaf.expect(objectDetection.isLocked).toBe(false);
            leaf.expect(objectDetection.confidenceScore).toBe(0.0);

            // Simulate CV processing duration (1.5s)
            await ctx.wait(1500);
            leaf.expect(objectDetection.isLocked).toBe(true);
            leaf.expect(objectDetection.confidenceScore).toBeCloseTo(0.994, 0.005);
            leaf.expect(objectDetection.hudStatusText).toContain("CONFIDENCE: 99.4%");
        });
    });

    // LEAF-10: 3D Exploded-View Architecture
    leaf.describe("LEAF-10: Exploded 3D View Animation", () => {
        leaf.it("LEAF-10: 3D Exploded-View Architecture (+25cm / +15cm expansion of cabinet modules)", async (ctx) => {
            const explodedController = ctx.findComponent("ExplodedViewController");
            const frontDoor = ctx.findSceneObject("FrontDoor");

            leaf.expect(explodedController.isExploded).toBe(false);
            leaf.expect(explodedController.explosionProgress).toBe(0.0);

            explodedController.setExploded(true);
            leaf.expect(explodedController.isExploded).toBe(true);

            // Wait for smooth lerp expansion
            await ctx.wait(1000);
            leaf.expect(explodedController.explosionProgress).toBeCloseTo(1.0, 0.05);
            const doorPos = frontDoor.getTransform().getWorldPosition();
            leaf.expect(doorPos.z).toBeCloseTo(25.0, 2.0); // +25cm outward
        });
    });

    // LEAF-11: Spatial Audio Occlusion Filter
    leaf.describe("LEAF-11: Spatial Audio Occlusion Filter", () => {
        leaf.it("LEAF-11: Spatial Audio Occlusion Filter (-12dB / 0.25 Closed vs 0dB / 1.0 Exploded)", async (ctx) => {
            const audioOcclusion = ctx.findComponent("AudioOcclusionController");
            const explodedController = ctx.findComponent("ExplodedViewController");

            // Closed cabinet state
            explodedController.setExploded(false);
            await ctx.wait(1000);
            leaf.expect(explodedController.isExploded).toBe(false);
            leaf.expect(audioOcclusion.calculateOcclusionGain(false)).toBeCloseTo(0.25, 0.01);
            leaf.expect(audioOcclusion.calculateCutoffHz(false)).toBe(180);
            leaf.expect(audioOcclusion.currentGain).toBeCloseTo(0.25, 0.05);

            // Explode cabinet -> unmasks raw hum
            explodedController.setExploded(true);
            await ctx.wait(1000);
            leaf.expect(explodedController.isExploded).toBe(true);
            leaf.expect(audioOcclusion.calculateOcclusionGain(true)).toBeCloseTo(1.0, 0.01);
            leaf.expect(audioOcclusion.calculateCutoffHz(true)).toBe(1500);
            leaf.expect(audioOcclusion.currentGain).toBeCloseTo(1.0, 0.05);
        });
    });

    // LEAF-12: Cryptographic Audit Log Export
    leaf.describe("LEAF-12: Cryptographic Audit Log Export", () => {
        leaf.it("LEAF-12: Cryptographic Audit Log JSON Generation & LOTO-HASH-994A Integrity", async (ctx) => {
            const stateCtrl = ctx.findComponent("VoltTwinStateController");
            const tagout = ctx.findComponent("CryptographicTagout");

            stateCtrl.setState(LOTOState.CRYPTOGRAPHIC_TAGOUT);
            leaf.expect(tagout.isPadlockLocked).toBe(true);

            const jsonString = tagout.exportAuditLogJson();
            leaf.expect(typeof jsonString).toBe("string");

            const audit = JSON.parse(jsonString);
            leaf.expect(audit.cryptographicHash).toBe("LOTO-HASH-994A");
            leaf.expect(audit.status).toBe("CLEARED_FOR_MAINTENANCE");
            leaf.expect(audit.panelId).toBe("HV-402");
            leaf.expect(audit.safetyVerification.voltageVerified).toBe(0.0);
            leaf.expect(audit.safetyVerification.mechanicalBreakerB2).toBe("OPEN_ISOLATED");
            leaf.expect(audit.safetyVerification.gazeInterlockSatisfied).toBe(true);
            leaf.expect(audit.hardwareTarget.device).toBe("Snap SPECS AR Glasses");
            leaf.expect(audit.hardwareTarget.confidenceScore).toBeCloseTo(0.994, 0.005);
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
        console.log("🎉 ALL 12 DONE CRITERIA AUTOMATED LEAF TESTS PASSED SUCCESSFULLY!");
    } else {
        process.exit(1);
    }
}

runAllTests().catch((err) => {
    console.error("Test execution error:", err);
    process.exit(1);
});
