import { PowerFlowMode } from "./VoltTwinTypes";

/**
 * ArcFlashSafetyShield.ts
 * Manages the 3D Hazard Bounding Cage and 1-meter NFPA 70E Arc-Flash Floor Perimeter Ring.
 */
@component
export class ArcFlashSafetyShield extends BaseScriptComponent {
    @input
    hazardCageObject: SceneObject;

    @input
    perimeterRingObject: SceneObject;

    @input
    hazardLabelObject: SceneObject;

    @input
    strobeLightObject: SceneObject;

    private _isStrobeActive: boolean = false;
    private _pulseTimer: number = 0;
    private _strobeTimer: number = 0;
    private _currentMode: PowerFlowMode = PowerFlowMode.LIVE_480V_RED;

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    public get hazardCageVisible(): boolean {
        return this.hazardCageObject ? this.hazardCageObject.enabled : false;
    }

    public get perimeterRingVisible(): boolean {
        return this.perimeterRingObject ? this.perimeterRingObject.enabled : false;
    }

    public get isStrobeActive(): boolean {
        return this._isStrobeActive;
    }

    public getHazardCenter(): vec3 {
        if (this.hazardCageObject) {
            return this.hazardCageObject.getTransform().getWorldPosition();
        }
        return new vec3(0, 12, -85);
    }

    /**
     * Activates or deactivates the safety shield
     */
    public setShieldActive(active: boolean, mode: PowerFlowMode = PowerFlowMode.LIVE_480V_RED): void {
        this._currentMode = mode;
        if (this.hazardCageObject) {
            this.hazardCageObject.enabled = active;
        }
        if (this.perimeterRingObject) {
            this.perimeterRingObject.enabled = active;
        }
        if (this.hazardLabelObject) {
            this.hazardLabelObject.enabled = active;
        }
        this._isStrobeActive = false;
    }

    /**
     * Triggers the emergency proximity strobe when hand encroaches into the 15cm danger zone
     */
    public triggerBreachStrobe(active: boolean): void {
        this._isStrobeActive = active;
        if (this.strobeLightObject) {
            this.strobeLightObject.enabled = active;
        }
    }

    private onUpdate(): void {
        const dt = getDeltaTime();
        this._pulseTimer += dt * 2.5;

        // Animate hazard cage pulsing
        if (this.hazardCageObject && this.hazardCageObject.enabled) {
            const scaleFactor = 1.0 + 0.03 * Math.sin(this._pulseTimer);
            this.hazardCageObject.getTransform().setLocalScale(new vec3(scaleFactor, scaleFactor, scaleFactor));
        }

        // Animate perimeter ring pulsation
        if (this.perimeterRingObject && this.perimeterRingObject.enabled) {
            const ringScale = 1.0 + 0.015 * Math.cos(this._pulseTimer * 0.8);
            this.perimeterRingObject.getTransform().setLocalScale(new vec3(ringScale, 1.0, ringScale));
        }

        // Handle proximity breach strobe flashing
        if (this._isStrobeActive && this.strobeLightObject) {
            this._strobeTimer += dt * 18.0;
            this.strobeLightObject.enabled = Math.sin(this._strobeTimer) > 0.0;
        }
    }
}
