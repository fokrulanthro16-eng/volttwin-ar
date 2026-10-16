import { ArcFlashSafetyShield } from "./ArcFlashSafetyShield";

/**
 * ProximitySensor.ts
 * Real-time distance tracking between technician hands and high-voltage hazard volume.
 * Triggers NFPA 70E breach warning if distance <= 15.0 cm while live.
 */
@component
export class ProximitySensor extends BaseScriptComponent {
    @input
    safetyShield: ArcFlashSafetyShield;

    @input
    handTrackingAnchor: SceneObject; // Palm or index finger joint tracker

    @input
    warningAudioTrack: AudioTrackAsset;

    public warningThresholdCm: number = 15.0;
    public isArmed: boolean = false;

    private _isBreached: boolean = false;
    private _audioComponent: AudioComponent;

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
        this._audioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
        if (this.warningAudioTrack) {
            this._audioComponent.audioTrack = this.warningAudioTrack;
        }
    }

    public get isBreached(): boolean {
        return this._isBreached;
    }

    /**
     * Set sensor armed status (e.g., active during State 2)
     */
    public setArmed(armed: boolean): void {
        this.isArmed = armed;
        if (!armed && this._isBreached) {
            this.clearBreach();
        }
    }

    private clearBreach(): void {
        this._isBreached = false;
        if (this.safetyShield) {
            this.safetyShield.triggerBreachStrobe(false);
        }
    }

    private onUpdate(): void {
        if (!this.isArmed || !this.safetyShield || !this.handTrackingAnchor) {
            return;
        }

        const handPos = this.handTrackingAnchor.getTransform().getWorldPosition();
        const hazardPos = this.safetyShield.getHazardCenter();
        const distanceCm = handPos.distance(hazardPos);

        if (distanceCm <= this.warningThresholdCm) {
            if (!this._isBreached) {
                this._isBreached = true;
                this.safetyShield.triggerBreachStrobe(true);
                if (this._audioComponent && this.warningAudioTrack) {
                    this._audioComponent.play(1);
                }
                print(`[VoltTwin AR ALERT] Hand Proximity Breach! Distance: ${distanceCm.toFixed(1)} cm <= 15.0 cm`);
            }
        } else {
            if (this._isBreached) {
                this.clearBreach();
            }
        }
    }
}
