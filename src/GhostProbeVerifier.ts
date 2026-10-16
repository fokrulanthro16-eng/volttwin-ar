import { VoltageVerificationData } from "./VoltTwinTypes";

/**
 * GhostProbeVerifier.ts
 * Manages 3D translucent multimeter ghost probes and automated zero-energy discharge countdown.
 */
@component
export class GhostProbeVerifier extends BaseScriptComponent {
    @input
    redProbeObject: SceneObject;

    @input
    blackProbeObject: SceneObject;

    @input
    voltageDisplayPillObject: SceneObject;

    @input
    voltageTextComponent: Text;

    private _probesVisible: boolean = false;
    private _isDischarging: boolean = false;
    private _dischargeTimer: number = 0;
    private _voltageData: VoltageVerificationData = {
        initialVoltage: 480.0,
        intermediateVoltage: 42.0,
        finalVoltage: 0.0,
        currentReading: 480.0,
        isVerified: false
    };

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    public get probesVisible(): boolean {
        return this._probesVisible;
    }

    public get measuredVoltage(): number {
        return this._voltageData.currentReading;
    }

    public get isZeroEnergyVerified(): boolean {
        return this._voltageData.isVerified;
    }

    /**
     * Show ghost probes and start voltage discharge countdown
     */
    public startVerification(): void {
        this._probesVisible = true;
        this._isDischarging = true;
        this._dischargeTimer = 0;
        this._voltageData.currentReading = 480.0;
        this._voltageData.isVerified = false;

        if (this.redProbeObject) this.redProbeObject.enabled = true;
        if (this.blackProbeObject) this.blackProbeObject.enabled = true;
        if (this.voltageDisplayPillObject) this.voltageDisplayPillObject.enabled = true;

        this.updateVoltageUI();
    }

    /**
     * Hide probes upon completion
     */
    public completeVerification(): void {
        this._isDischarging = false;
        this._voltageData.currentReading = 0.0;
        this._voltageData.isVerified = true;

        if (this.redProbeObject) this.redProbeObject.enabled = false;
        if (this.blackProbeObject) this.blackProbeObject.enabled = false;

        this.updateVoltageUI();
        print("[VoltTwin AR] Zero-Energy Verified: 0.0V across terminals T1-T2.");
    }

    private updateVoltageUI(): void {
        if (!this.voltageTextComponent) return;

        if (this._voltageData.isVerified) {
            this.voltageTextComponent.text = "0.0V (VERIFIED SAFE)";
        } else if (this._voltageData.currentReading > 0) {
            this.voltageTextComponent.text = `DISCHARGING: ${this._voltageData.currentReading.toFixed(1)}V`;
        }
    }

    private onUpdate(): void {
        if (!this._isDischarging || this._voltageData.isVerified) return;

        const dt = getDeltaTime();
        this._dischargeTimer += dt;

        // Exponential discharge curve simulation over 2.5 seconds
        if (this._dischargeTimer < 1.0) {
            this._voltageData.currentReading = 480.0 - 240.0 * this._dischargeTimer;
        } else if (this._dischargeTimer < 2.0) {
            this._voltageData.currentReading = 240.0 - 198.0 * (this._dischargeTimer - 1.0);
        } else if (this._dischargeTimer < 2.5) {
            this._voltageData.currentReading = 42.0 - 42.0 * ((this._dischargeTimer - 2.0) / 0.5);
        } else {
            this._voltageData.currentReading = 0.0;
            this.completeVerification();
        }

        this.updateVoltageUI();
    }
}
