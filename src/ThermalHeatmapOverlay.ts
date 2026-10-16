/**
 * ThermalHeatmapOverlay.ts
 * Manages thermal load visualization and thermal gradient shader transitions on internal wiring.
 * Amber-Hot (68°C) under high load -> Cold Cryo Blue (21°C) when de-energized.
 */
@component
export class ThermalHeatmapOverlay extends BaseScriptComponent {
    @input
    conduitTargetObject: SceneObject;

    private _temperatureCelsius: number = 68.0; // Amber-hot initial
    private _targetTemperature: number = 68.0;
    private _isHighLoad: boolean = true;
    private _thermalColor: any; // MockVec4 or vec4

    public onAwake(): void {
        this._thermalColor = new (globalThis as any).vec4(1.0, 0.4, 0.0, 0.9); // Initial amber-hot
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    public get temperatureCelsius(): number {
        return this._temperatureCelsius;
    }

    public get thermalGradientColor(): any {
        return this._thermalColor;
    }

    public get isHighLoad(): boolean {
        return this._isHighLoad;
    }

    /**
     * Updates electrical load status and sets target cooling/heating temperature
     */
    public setElectricalLoad(voltage: number, isHighLoad: boolean, immediate: boolean = false): void {
        this._isHighLoad = isHighLoad;
        if (isHighLoad && voltage > 100.0) {
            this._targetTemperature = 68.0;
        } else {
            this._targetTemperature = 21.0; // Ambient equilibrium cold
        }
        if (immediate) {
            this._temperatureCelsius = this._targetTemperature;
            this.updateColor();
        }
        print(`[VoltTwin AR Thermal] Electrical load updated: ${voltage}V. Target Temp: ${this._targetTemperature}°C`);
    }

    public updateColor(): void {
        if (!this._thermalColor) return;
        // Interpolate color gradient between Cold Blue (21°C) and Amber-Hot (68°C)
        const factor = Math.max(0.0, Math.min(1.0, (this._temperatureCelsius - 21.0) / (68.0 - 21.0)));

        const r = 0.1 + factor * 0.9;
        const g = 0.55 - factor * 0.15;
        const b = 1.0 - factor * 1.0;
        const a = 0.75 + factor * 0.15;

        this._thermalColor.x = r;
        this._thermalColor.y = g;
        this._thermalColor.z = b;
        this._thermalColor.w = a;

        if (this.conduitTargetObject) {
            const mesh = this.conduitTargetObject.getComponent("Component.RenderMeshVisual");
            if (mesh && mesh.mainMaterial) {
                mesh.mainMaterial.mainPass.baseColor = this._thermalColor;
            }
        }
    }

    private onUpdate(): void {
        const dt = (globalThis as any).getDeltaTime ? (globalThis as any).getDeltaTime() : 0.016;

        // Smooth exponential thermal decay/rise
        const rate = 3.5;
        this._temperatureCelsius += (this._targetTemperature - this._temperatureCelsius) * Math.min(1.0, dt * rate);

        this.updateColor();
    }
}
