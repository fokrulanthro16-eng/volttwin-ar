/**
 * GazeDwellInterlock.ts
 * Safety interlock requiring continuous 1.5-second head-gaze lock on Terminal Pin T1
 * before permitting Zero-Energy verification to complete.
 */
@component
export class GazeDwellInterlock extends BaseScriptComponent {
    @input
    terminalT1Target: SceneObject;

    @input
    gazeRadialRingObject: SceneObject;

    @input
    dwellSuccessTrack: AudioTrackAsset;

    public requiredDwellDurationSec: number = 1.5;

    private _isTracking: boolean = false;
    private _targetName: string = "TerminalPinT1";
    private _accumulatedDwellSec: number = 0;
    private _isDwellLocked: boolean = false;
    private _dwellProgress: number = 0;

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
        if (this.gazeRadialRingObject) {
            this.gazeRadialRingObject.enabled = false;
        }
    }

    public get isDwellLocked(): boolean {
        return this._isDwellLocked;
    }

    public get dwellProgress(): number {
        return this._dwellProgress;
    }

    public get isTracking(): boolean {
        return this._isTracking;
    }

    /**
     * Start gaze tracking on the target object
     */
    public startGazeTracking(targetName: string = "TerminalPinT1"): void {
        this._isTracking = true;
        this._targetName = targetName;
        this._accumulatedDwellSec = 0;
        this._isDwellLocked = false;
        this._dwellProgress = 0;

        if (this.gazeRadialRingObject) {
            this.gazeRadialRingObject.enabled = true;
        }
        print(`[VoltTwin AR Gaze] Gaze dwell tracking started on: ${targetName}. (1.5s lock required)`);
    }

    /**
     * Simulates or processes gaze dwell duration increment
     */
    public simulateGazeDwell(deltaSeconds: number): void {
        if (!this._isTracking || this._isDwellLocked) return;

        this._accumulatedDwellSec += deltaSeconds;
        this._dwellProgress = Math.min(1.0, this._accumulatedDwellSec / this.requiredDwellDurationSec);

        if (this._accumulatedDwellSec >= this.requiredDwellDurationSec) {
            this.lockDwell();
        }
    }

    /**
     * Resets dwell progress if technician breaks gaze before 1.5s
     */
    public breakGaze(): void {
        if (this._isDwellLocked) return; // Once locked, maintains state
        this._accumulatedDwellSec = 0;
        this._dwellProgress = 0;
        print("[VoltTwin AR Gaze] Gaze broken before 1.5s. Dwell timer reset to 0.");
    }

    private lockDwell(): void {
        this._isDwellLocked = true;
        this._dwellProgress = 1.0;

        if (this.dwellSuccessTrack) {
            const audioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            audioComponent.audioTrack = this.dwellSuccessTrack;
            audioComponent.play(1);
        }

        print("[VoltTwin AR Gaze] Gaze Dwell Locked (1.5s verified on Terminal Pin T1). Safety interlock cleared!");
    }

    private onUpdate(): void {
        if (!this._isTracking || this._isDwellLocked) return;

        // Animate gaze radial ring scale or material progress
        if (this.gazeRadialRingObject && this.gazeRadialRingObject.enabled) {
            const scale = 1.0 + 0.1 * this._dwellProgress;
            this.gazeRadialRingObject.getTransform().setLocalScale(new (globalThis as any).vec3(scale, scale, 1.0));
        }
    }
}
