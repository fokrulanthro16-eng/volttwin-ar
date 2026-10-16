/**
 * SpatialObjectDetection.ts
 * Real-time computer vision / optical tracking bounding box simulator for Panel #HV-402.
 * Simulates object detection scanning grid with confidence rating (99.4%).
 */
@component
export class SpatialObjectDetection extends BaseScriptComponent {
    @input
    trackingBoxObject: SceneObject;

    @input
    hudTextComponent: Text;

    private _isScanning: boolean = true;
    private _isLocked: boolean = false;
    private _targetLabel: string = "Panel #HV-402";
    private _confidenceScore: number = 0.0;
    private _scanTimer: number = 0;

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    public get isLocked(): boolean {
        return this._isLocked;
    }

    public get confidenceScore(): number {
        return this._confidenceScore;
    }

    public get targetLabel(): string {
        return this._targetLabel;
    }

    public get hudStatusText(): string {
        return this.hudTextComponent ? this.hudTextComponent.text : "";
    }

    /**
     * Start optical detection scan
     */
    public startScan(): void {
        this._isScanning = true;
        this._isLocked = false;
        this._confidenceScore = 0.0;
        this._scanTimer = 0;
        if (this.hudTextComponent) {
            this.hudTextComponent.text = "OPTICAL CV: SCANNING TARGET...";
        }
        print("[VoltTwin AR CV] Scanning environment for high-voltage panel geometry...");
    }

    /**
     * Locks onto the detected object
     */
    public lockTarget(confidence: number = 0.994): void {
        this._isScanning = false;
        this._isLocked = true;
        this._confidenceScore = confidence;

        const confPercent = (confidence * 100).toFixed(1);
        const status = `TARGET: ${this._targetLabel} [CONFIDENCE: ${confPercent}%]`;
        if (this.hudTextComponent) {
            this.hudTextComponent.text = status;
        }

        print(`[VoltTwin AR CV] ${status}`);
    }

    private onUpdate(): void {
        if (!this._isScanning || this._isLocked) return;

        const dt = (globalThis as any).getDeltaTime ? (globalThis as any).getDeltaTime() : 0.016;
        this._scanTimer += dt;

        // Auto-lock after simulated CV scanning duration (e.g. 1.2s)
        if (this._scanTimer >= 1.2) {
            this.lockTarget(0.994);
        }
    }
}
