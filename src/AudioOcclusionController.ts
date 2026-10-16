import { ExplodedViewController } from "./ExplodedViewController";

/**
 * AudioOcclusionController.ts
 * Manages spatial acoustic occlusion filtering for high-voltage panel hum.
 * When panel door/casing is closed, metal attenuates hum by ~12dB (gain 0.25)
 * and muffles high-order harmonics (low-pass cutoff 180 Hz).
 * When cabinet is exploded/opened, unmasks raw unattenuated 60Hz + 120Hz harmonics (gain 1.0, cutoff 1500 Hz).
 */
@component
export class AudioOcclusionController extends BaseScriptComponent {
    @input
    explodedController: ExplodedViewController;

    // Attenuation constants
    public readonly CLOSED_GAIN = 0.25;      // -12 dB attenuation through steel enclosure
    public readonly OPEN_GAIN = 1.0;         // 0 dB unoccluded
    public readonly CLOSED_CUTOFF_HZ = 180;  // Muffled bass resonance
    public readonly OPEN_CUTOFF_HZ = 1500;   // Raw arc/transformer hum harmonics

    private _currentGain: number = 0.25;
    private _currentCutoffHz: number = 180;

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    public get currentGain(): number {
        return this._currentGain;
    }

    public get currentCutoffHz(): number {
        return this._currentCutoffHz;
    }

    /**
     * Calculates the occlusion gain factor for a given exploded state
     */
    public calculateOcclusionGain(isExploded: boolean): number {
        return isExploded ? this.OPEN_GAIN : this.CLOSED_GAIN;
    }

    /**
     * Calculates the low-pass filter cutoff frequency for a given exploded state
     */
    public calculateCutoffHz(isExploded: boolean): number {
        return isExploded ? this.OPEN_CUTOFF_HZ : this.CLOSED_CUTOFF_HZ;
    }

    private onUpdate(): void {
        const progress = this.explodedController ? this.explodedController.explosionProgress : 0.0;
        this._currentGain = this.CLOSED_GAIN + (this.OPEN_GAIN - this.CLOSED_GAIN) * progress;
        this._currentCutoffHz = this.CLOSED_CUTOFF_HZ + (this.OPEN_CUTOFF_HZ - this.CLOSED_CUTOFF_HZ) * progress;
    }
}
