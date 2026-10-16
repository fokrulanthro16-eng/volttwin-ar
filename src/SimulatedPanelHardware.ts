/**
 * SimulatedPanelHardware.ts
 * Stand-in virtual electrical cabinet (Panel #HV-402) for Lens Studio Preview.
 * Allows complete hands-free and LEAF testing without physical 480V hardware.
 */
@component
export class SimulatedPanelHardware extends BaseScriptComponent {
    @input
    panelCabinetObject: SceneObject;

    @input
    breakerB2SwitchObject: SceneObject;

    @input
    terminalPinT1Object: SceneObject;

    @input
    terminalPinT2Object: SceneObject;

    @input
    switchSoundTrack: AudioTrackAsset;

    private _isBreakerB2Closed: boolean = true; // Initially closed (conducting 480V)

    public onAwake(): void {
        this.updateSwitchVisuals();
    }

    public get isBreakerB2Closed(): boolean {
        return this._isBreakerB2Closed;
    }

    /**
     * Toggles Breaker B2 state (ON <-> OFF).
     * Can be invoked via SIK Pinch on the switch object or via script.
     */
    public toggleBreakerB2(): void {
        this.setBreakerB2State(!this._isBreakerB2Closed);
    }

    public setBreakerB2State(closed: boolean): void {
        this._isBreakerB2Closed = closed;
        this.updateSwitchVisuals();

        if (this.switchSoundTrack) {
            const audioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            audioComponent.audioTrack = this.switchSoundTrack;
            audioComponent.play(1);
        }

        print(`[VoltTwin AR Hardware] Breaker B2 is now: ${this._isBreakerB2Closed ? "CLOSED (ON)" : "OPEN (OFF / ISOLATED)"}`);
    }

    private updateSwitchVisuals(): void {
        if (!this.breakerB2SwitchObject) return;

        const transform = this.breakerB2SwitchObject.getTransform();
        // Rotate switch lever: 0 deg when ON, 45 deg downwards when OFF
        const rotAngle = this._isBreakerB2Closed ? 0.0 : -0.785; // ~ -45 degrees in radians
        transform.setLocalRotation(quat.fromEulerVec(new vec3(rotAngle, 0, 0)));
    }
}
