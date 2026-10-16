import { PowerFlowMode } from "./VoltTwinTypes";

/**
 * ArcFlashSafetyShield.ts
 * Manages the 3D Hazard Bounding Cage, 1-meter NFPA 70E Arc-Flash Floor Perimeter Ring,
 * and Volumetric Arc-Flash Plasma Particle Blast upon proximity breach.
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

    @input
    plasmaBlastObject: SceneObject;

    @input
    plasmaCrackleTrack: AudioTrackAsset;

    private _isStrobeActive: boolean = false;
    private _isPlasmaActive: boolean = false;
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

    public get isPlasmaActive(): boolean {
        return this._isPlasmaActive;
    }

    public getHazardCenter(): any {
        if (this.hazardCageObject) {
            return this.hazardCageObject.getTransform().getWorldPosition();
        }
        return new (globalThis as any).vec3(0, 12, -85);
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
        this._isPlasmaActive = false;
    }

    /**
     * Triggers the emergency proximity strobe and volumetric arc-flash plasma blast
     */
    public triggerBreachStrobe(active: boolean): void {
        this._isStrobeActive = active;
        this._isPlasmaActive = active && this._currentMode === PowerFlowMode.LIVE_480V_RED;

        if (this.strobeLightObject) {
            this.strobeLightObject.enabled = active;
        }
        if (this.plasmaBlastObject) {
            this.plasmaBlastObject.enabled = this._isPlasmaActive;
        }

        if (this._isPlasmaActive && this.plasmaCrackleTrack) {
            const audioComp = this.getSceneObject().createComponent("Component.AudioComponent");
            audioComp.audioTrack = this.plasmaCrackleTrack;
            audioComp.play(1);
        }
    }

    private onUpdate(): void {
        const dt = (globalThis as any).getDeltaTime ? (globalThis as any).getDeltaTime() : 0.016;
        this._pulseTimer += dt * 2.5;

        // Animate hazard cage pulsing
        if (this.hazardCageObject && this.hazardCageObject.enabled) {
            const scaleFactor = 1.0 + 0.03 * Math.sin(this._pulseTimer);
            this.hazardCageObject.getTransform().setLocalScale(new (globalThis as any).vec3(scaleFactor, scaleFactor, scaleFactor));
        }

        // Animate perimeter ring pulsation
        if (this.perimeterRingObject && this.perimeterRingObject.enabled) {
            const ringScale = 1.0 + 0.015 * Math.cos(this._pulseTimer * 0.8);
            this.perimeterRingObject.getTransform().setLocalScale(new (globalThis as any).vec3(ringScale, 1.0, ringScale));
        }

        // Handle proximity breach strobe flashing
        if (this._isStrobeActive && this.strobeLightObject) {
            this._strobeTimer += dt * 18.0;
            this.strobeLightObject.enabled = Math.sin(this._strobeTimer) > 0.0;
        }
    }
}
