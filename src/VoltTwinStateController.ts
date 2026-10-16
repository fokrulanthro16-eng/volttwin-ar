import { LOTOState, PowerFlowMode } from "./VoltTwinTypes";
import { SpatialCalibration } from "./SpatialCalibration";
import { ArcFlashSafetyShield } from "./ArcFlashSafetyShield";
import { ProximitySensor } from "./ProximitySensor";
import { PowerFlowXRay } from "./PowerFlowXRay";
import { GhostProbeVerifier } from "./GhostProbeVerifier";
import { CryptographicTagout } from "./CryptographicTagout";
import { SimulatedPanelHardware } from "./SimulatedPanelHardware";
import { ThermalHeatmapOverlay } from "./ThermalHeatmapOverlay";
import { GazeDwellInterlock } from "./GazeDwellInterlock";
import { SpatialObjectDetection } from "./SpatialObjectDetection";
import { ExplodedViewController } from "./ExplodedViewController";
import { RemoteSupervisorTelemetry } from "./RemoteSupervisorTelemetry";

/**
 * VoltTwinStateController.ts
 * Master finite state machine orchestrator for VoltTwin AR v2.0 on Snap SPECS.
 */
@component
export class VoltTwinStateController extends BaseScriptComponent {
    @input
    spatialCalibration: SpatialCalibration;

    @input
    safetyShield: ArcFlashSafetyShield;

    @input
    proximitySensor: ProximitySensor;

    @input
    powerFlowXRay: PowerFlowXRay;

    @input
    ghostProbeVerifier: GhostProbeVerifier;

    @input
    cryptographicTagout: CryptographicTagout;

    @input
    panelHardware: SimulatedPanelHardware;

    @input
    thermalOverlay: ThermalHeatmapOverlay;

    @input
    gazeInterlock: GazeDwellInterlock;

    @input
    objectDetection: SpatialObjectDetection;

    @input
    explodedController: ExplodedViewController;

    @input
    remoteSupervisor: RemoteSupervisorTelemetry;

    @input
    stateInstructionPill: SceneObject;

    @input
    stateInstructionText: Text;

    private _currentState: LOTOState = LOTOState.SPATIAL_CALIBRATION;

    public onAwake(): void {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    }

    public get currentState(): LOTOState {
        return this._currentState;
    }

    private onStart(): void {
        this.setState(LOTOState.SPATIAL_CALIBRATION);
    }

    /**
     * Transition to a target LOTO state
     */
    public setState(targetState: LOTOState): void {
        this._currentState = targetState;
        print(`[VoltTwin AR FSM] Entering State: ${targetState}`);

        switch (targetState) {
            case LOTOState.SPATIAL_CALIBRATION:
                this.enterStateCalibration();
                break;
            case LOTOState.LIVE_ARC_FLASH:
                this.enterStateLiveArcFlash();
                break;
            case LOTOState.MECHANICAL_ISOLATION:
                this.enterStateMechanicalIsolation();
                break;
            case LOTOState.ZERO_ENERGY_VERIFICATION:
                this.enterStateZeroEnergyVerification();
                break;
            case LOTOState.CRYPTOGRAPHIC_TAGOUT:
                this.enterStateCryptographicTagout();
                break;
        }
    }

    /**
     * Advances to the next sequential state
     */
    public nextStep(): void {
        switch (this._currentState) {
            case LOTOState.SPATIAL_CALIBRATION:
                this.setState(LOTOState.LIVE_ARC_FLASH);
                break;
            case LOTOState.LIVE_ARC_FLASH:
                this.setState(LOTOState.MECHANICAL_ISOLATION);
                break;
            case LOTOState.MECHANICAL_ISOLATION:
                this.setState(LOTOState.ZERO_ENERGY_VERIFICATION);
                break;
            case LOTOState.ZERO_ENERGY_VERIFICATION:
                this.setState(LOTOState.CRYPTOGRAPHIC_TAGOUT);
                break;
            case LOTOState.CRYPTOGRAPHIC_TAGOUT:
                print("[VoltTwin AR] LOTO Workflow already complete.");
                break;
        }
    }

    // --- State Handlers ---

    private enterStateCalibration(): void {
        this.updateInstructionUI("STEP 0: LOOK AT PANEL & AIR-PINCH TO SYNC TWIN");
        if (this.spatialCalibration) {
            this.spatialCalibration.startCalibration();
        }
        if (this.objectDetection) {
            this.objectDetection.startScan();
        }
        if (this.safetyShield) {
            this.safetyShield.setShieldActive(false);
        }
        if (this.proximitySensor) {
            this.proximitySensor.setArmed(false);
        }
        if (this.explodedController) {
            this.explodedController.setExploded(false);
        }
    }

    private enterStateLiveArcFlash(): void {
        this.updateInstructionUI("DANGER: 480V LIVE BUSBARS | 1.0M ARC-FLASH PERIMETER");
        if (this.spatialCalibration) {
            this.spatialCalibration.lockAnchor();
        }
        if (this.objectDetection) {
            this.objectDetection.lockTarget(0.994);
        }
        if (this.safetyShield) {
            this.safetyShield.setShieldActive(true, PowerFlowMode.LIVE_480V_RED);
        }
        if (this.proximitySensor) {
            this.proximitySensor.setArmed(true);
        }
        if (this.powerFlowXRay) {
            this.powerFlowXRay.setMode(PowerFlowMode.LIVE_480V_RED);
        }
        if (this.thermalOverlay) {
            this.thermalOverlay.setElectricalLoad(480.0, true, true);
        }
    }

    private enterStateMechanicalIsolation(): void {
        this.updateInstructionUI("STEP 1: ISOLATE BREAKER B2 (PINCH OR SAY 'TOGGLE B2')");
        if (this.proximitySensor) {
            this.proximitySensor.setArmed(false);
        }
        if (this.panelHardware) {
            this.panelHardware.setBreakerB2State(false);
        }
        if (this.powerFlowXRay) {
            this.powerFlowXRay.setMode(PowerFlowMode.RESIDUAL_AMBER);
        }
        if (this.thermalOverlay) {
            this.thermalOverlay.setElectricalLoad(180.0, true, true);
        }
    }

    private enterStateZeroEnergyVerification(): void {
        this.updateInstructionUI("STEP 2: GAZE 1.5s AT T1 & VERIFY 0.0V");
        if (this.ghostProbeVerifier) {
            this.ghostProbeVerifier.startVerification();
        }
        if (this.thermalOverlay) {
            this.thermalOverlay.setElectricalLoad(0.0, false, false);
        }
    }

    private enterStateCryptographicTagout(): void {
        this.updateInstructionUI("SAFE: DIGITAL PADLOCK ENGAGED | LOTO-HASH-994A");
        if (this.powerFlowXRay) {
            this.powerFlowXRay.setMode(PowerFlowMode.SAFE_EMERALD);
        }
        if (this.safetyShield) {
            this.safetyShield.setShieldActive(true, PowerFlowMode.SAFE_EMERALD);
        }
        if (this.cryptographicTagout) {
            this.cryptographicTagout.engageLockout();
        }
        if (this.thermalOverlay) {
            this.thermalOverlay.setElectricalLoad(0.0, false, false);
        }
    }

    private updateInstructionUI(text: string): void {
        if (this.stateInstructionText) {
            this.stateInstructionText.text = text;
        }
        if (this.stateInstructionPill) {
            this.stateInstructionPill.enabled = true;
        }
    }
}
