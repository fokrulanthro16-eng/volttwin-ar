import { LOTOState, SpatialAnchorConfig } from "./VoltTwinTypes";

/**
 * SpatialCalibration.ts
 * Manages spatial surface anchoring and LiDAR calibration wireframe for Panel #HV-402.
 */
@component
export class SpatialCalibration extends BaseScriptComponent {
    @input
    panelAnchorObject: SceneObject;

    @input
    lidarGridObject: SceneObject;

    @input
    calibrationPillObject: SceneObject;

    @input
    audioFeedbackTrack: AudioTrackAsset;

    private _isCalibrated: boolean = false;
    private _pulseTimer: number = 0;
    private _anchorConfig: SpatialAnchorConfig = {
        panelId: "Panel #HV-402",
        defaultPosition: new vec3(0.0, -10.0, -90.0),
        defaultRotation: quat.quatIdentity(),
        defaultScale: new vec3(1.0, 1.0, 1.0),
        isLocked: false
    };

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    public get isCalibrated(): boolean {
        return this._isCalibrated;
    }

    /**
     * Initializes calibration mode (State 1)
     */
    public startCalibration(): void {
        this._isCalibrated = false;
        this._anchorConfig.isLocked = false;
        
        if (this.lidarGridObject) {
            this.lidarGridObject.enabled = true;
        }
        if (this.calibrationPillObject) {
            this.calibrationPillObject.enabled = true;
        }
    }

    /**
     * Locks the spatial twin to the target physical panel coordinate system.
     * Invoked via SIK Air-Pinch gesture or Preview click.
     */
    public lockAnchor(): void {
        if (this._isCalibrated) return;

        this._isCalibrated = true;
        this._anchorConfig.isLocked = true;

        if (this.panelAnchorObject) {
            const transform = this.panelAnchorObject.getTransform();
            transform.setWorldPosition(this._anchorConfig.defaultPosition);
            transform.setWorldRotation(this._anchorConfig.defaultRotation);
            transform.setWorldScale(this._anchorConfig.defaultScale);
        }

        // Animate grid fade-out
        if (this.lidarGridObject) {
            this.lidarGridObject.enabled = false;
        }
        if (this.calibrationPillObject) {
            this.calibrationPillObject.enabled = false;
        }

        // Play spatial calibration confirmation chime
        if (this.audioFeedbackTrack) {
            const audioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            audioComponent.audioTrack = this.audioFeedbackTrack;
            audioComponent.play(1);
        }

        print("[VoltTwin AR] Spatial Twin locked to Panel #HV-402 at (0, -10, -90) cm.");
    }

    private onUpdate(): void {
        if (!this._isCalibrated && this.lidarGridObject && this.lidarGridObject.enabled) {
            // Pulse the cyan LiDAR grid material intensity
            this._pulseTimer += getDeltaTime() * 3.0;
            const pulse = 0.6 + 0.4 * Math.sin(this._pulseTimer);
            const gridTransform = this.lidarGridObject.getTransform();
            gridTransform.setLocalScale(new vec3(1.0 + 0.02 * pulse, 1.0 + 0.02 * pulse, 1.0));
        }
    }
}
