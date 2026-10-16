/**
 * ExplodedViewController.ts
 * Manages smooth 3D exploded-view expansion of Panel #HV-402 modules
 * to expose internal wiring, capacitors, and terminal busbars.
 */
@component
export class ExplodedViewController extends BaseScriptComponent {
    @input
    frontDoorObject: SceneObject;

    @input
    busbarModuleObject: SceneObject;

    @input
    terminalModuleObject: SceneObject;

    @input
    explodeAudioTrack: AudioTrackAsset;

    private _isExploded: boolean = false;
    private _targetProgress: number = 0.0;
    private _currentProgress: number = 0.0; // 0.0 (collapsed) -> 1.0 (exploded)

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    public get isExploded(): boolean {
        return this._isExploded;
    }

    public get explosionProgress(): number {
        return this._currentProgress;
    }

    /**
     * Toggles 3D exploded view state
     */
    public toggleExploded(): void {
        this.setExploded(!this._isExploded);
    }

    /**
     * Set exploded view state
     */
    public setExploded(exploded: boolean): void {
        this._isExploded = exploded;
        this._targetProgress = exploded ? 1.0 : 0.0;

        if (this.explodeAudioTrack) {
            const audio = this.getSceneObject().createComponent("Component.AudioComponent");
            audio.audioTrack = this.explodeAudioTrack;
            audio.play(1);
        }

        print(`[VoltTwin AR Exploded View] ${exploded ? "EXPANDING modules outward (+Z/+Y)" : "COLLAPSING modules to normal"}`);
    }

    private onUpdate(): void {
        const dt = (globalThis as any).getDeltaTime ? (globalThis as any).getDeltaTime() : 0.016;

        // Smooth lerp toward target progress
        const lerpSpeed = 4.0;
        this._currentProgress += (this._targetProgress - this._currentProgress) * Math.min(1.0, dt * lerpSpeed);

        // Apply 3D spatial module offsets based on explosionProgress
        if (this.frontDoorObject) {
            const zOffset = 25.0 * this._currentProgress; // Moves +25cm outward
            this.frontDoorObject.getTransform().setWorldPosition(new (globalThis as any).vec3(0, 0, zOffset));
        }

        if (this.busbarModuleObject) {
            const yOffset = 10.0 * this._currentProgress;
            const zOffset = 15.0 * this._currentProgress;
            this.busbarModuleObject.getTransform().setWorldPosition(new (globalThis as any).vec3(0, 18 + yOffset, 14 + zOffset));
        }

        if (this.terminalModuleObject) {
            const yOffset = -10.0 * this._currentProgress;
            const zOffset = 10.0 * this._currentProgress;
            this.terminalModuleObject.getTransform().setWorldPosition(new (globalThis as any).vec3(14, -14 + yOffset, 14 + zOffset));
        }
    }
}
