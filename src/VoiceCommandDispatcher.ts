import { LOTOState } from "./VoltTwinTypes";
import { VoltTwinStateController } from "./VoltTwinStateController";
import { SimulatedPanelHardware } from "./SimulatedPanelHardware";
import { ExplodedViewController } from "./ExplodedViewController";

/**
 * VoiceCommandDispatcher.ts
 * Manages hands-free speech recognition triggers and spatial audio confirmation cues.
 * Supported commands: "Check Status", "Toggle B2", "Lockout Complete", "Explode View", "Collapse View"
 */
@component
export class VoiceCommandDispatcher extends BaseScriptComponent {
    @input
    stateController: VoltTwinStateController;

    @input
    panelHardware: SimulatedPanelHardware;

    @input
    explodedController: ExplodedViewController;

    @input
    confirmChimeTrack: AudioTrackAsset;

    @input
    breakerTripTrack: AudioTrackAsset;

    @input
    lockEngageTrack: AudioTrackAsset;

    private _lastAudioPlayed: string = "";
    private _lastCommand: string = "";

    public onAwake(): void {
        print("[VoltTwin AR] VoiceCommandDispatcher initialized. Ready for speech commands.");
    }

    public get lastAudioPlayed(): string {
        return this._lastAudioPlayed;
    }

    public get lastCommand(): string {
        return this._lastCommand;
    }

    /**
     * Dispatches a voice command string.
     * Can be invoked by native SPECS voice recognition or via Preview UI fallback buttons.
     */
    public dispatchVoiceCommand(phrase: string): string {
        const normalized = phrase.trim().toLowerCase();
        this._lastCommand = phrase;
        print(`[VoltTwin AR Voice] Received Command: "${phrase}"`);

        if (normalized.includes("status") || normalized === "check status") {
            return this.handleCheckStatus();
        } else if (normalized.includes("toggle") || normalized === "toggle b2") {
            return this.handleToggleB2();
        } else if (normalized.includes("lockout") || normalized === "lockout complete") {
            return this.handleLockoutComplete();
        } else if (normalized.includes("explode") || normalized === "explode view") {
            return this.handleExplodeView(true);
        } else if (normalized.includes("collapse") || normalized === "collapse view") {
            return this.handleExplodeView(false);
        } else {
            print(`[VoltTwin AR Voice] Unrecognized command: "${phrase}"`);
            return "UNKNOWN_COMMAND";
        }
    }

    private handleCheckStatus(): string {
        this.playSpatialAudio("VOICE_CHIME_CONFIRM", this.confirmChimeTrack);
        const state = this.stateController ? this.stateController.currentState : LOTOState.SPATIAL_CALIBRATION;
        const response = `CURRENT STATUS: ${state}`;
        print(`[VoltTwin AR Voice] ${response}`);
        return response;
    }

    private handleToggleB2(): string {
        this.playSpatialAudio("BREAKER_TRIP_AUDIO", this.breakerTripTrack);
        if (this.panelHardware) {
            this.panelHardware.toggleBreakerB2();
        }
        if (this.stateController) {
            this.stateController.setState(LOTOState.MECHANICAL_ISOLATION);
        }
        const response = "BREAKER B2 TOGGLED TO ISOLATED";
        print(`[VoltTwin AR Voice] ${response}`);
        return response;
    }

    private handleLockoutComplete(): string {
        this.playSpatialAudio("LOCK_ENGAGE_AUDIO", this.lockEngageTrack);
        if (this.stateController) {
            this.stateController.setState(LOTOState.CRYPTOGRAPHIC_TAGOUT);
        }
        const response = "LOCKOUT COMPLETE - TAGOUT IMMUTABLE";
        print(`[VoltTwin AR Voice] ${response}`);
        return response;
    }

    private handleExplodeView(explode: boolean): string {
        this.playSpatialAudio("VOICE_CHIME_CONFIRM", this.confirmChimeTrack);
        if (this.explodedController) {
            this.explodedController.setExploded(explode);
        }
        const response = explode ? "CABINET 3D EXPLODED VIEW ACTIVATED" : "CABINET VIEW COLLAPSED";
        print(`[VoltTwin AR Voice] ${response}`);
        return response;
    }

    private playSpatialAudio(identifier: string, track?: AudioTrackAsset): void {
        this._lastAudioPlayed = identifier;
        if (track) {
            const audioComp = this.getSceneObject().createComponent("Component.AudioComponent");
            audioComp.audioTrack = track;
            audioComp.play(1);
        }
    }
}
