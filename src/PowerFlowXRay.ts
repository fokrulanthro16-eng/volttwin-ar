import { PowerFlowMode } from "./VoltTwinTypes";

/**
 * PowerFlowXRay.ts
 * Manages holographic 3D wire conduits and animated electric current particle flows.
 */
@component
export class PowerFlowXRay extends BaseScriptComponent {
    @input
    mainBusConduitObject: SceneObject;

    @input
    branchB2ConduitObject: SceneObject;

    @input
    subConduitsObject: SceneObject;

    private _mode: PowerFlowMode = PowerFlowMode.LIVE_480V_RED;
    private _flowOffset: number = 0;

    public onAwake(): void {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    public get currentFlowMode(): PowerFlowMode {
        return this._mode;
    }

    /**
     * Switch current flow particle visualization mode
     */
    public setMode(mode: PowerFlowMode): void {
        this._mode = mode;
        print(`[VoltTwin AR] Power Flow Mode updated to: ${mode}`);

        switch (mode) {
            case PowerFlowMode.LIVE_480V_RED:
                this.setConduitColors(new vec4(1.0, 0.1, 0.1, 0.85)); // Dangerous crimson
                break;
            case PowerFlowMode.RESIDUAL_AMBER:
                this.setConduitColors(new vec4(1.0, 0.7, 0.0, 0.75)); // Residual warning amber
                break;
            case PowerFlowMode.ZERO_ENERGY_OFF:
                this.setConduitColors(new vec4(0.2, 0.2, 0.2, 0.2));  // De-energized off
                break;
            case PowerFlowMode.SAFE_EMERALD:
                this.setConduitColors(new vec4(0.0, 0.9, 0.45, 0.8)); // Safe emerald clearance
                break;
        }
    }

    private setConduitColors(color: vec4): void {
        // Update mesh visual material color if present
        const updateObjectColor = (obj: SceneObject) => {
            if (!obj) return;
            const mesh = obj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
            if (mesh && mesh.mainMaterial) {
                mesh.mainMaterial.mainPass.baseColor = color;
            }
        };

        updateObjectColor(this.mainBusConduitObject);
        updateObjectColor(this.branchB2ConduitObject);
        updateObjectColor(this.subConduitsObject);
    }

    private onUpdate(): void {
        const dt = getDeltaTime();
        let speed = 0.0;

        if (this._mode === PowerFlowMode.LIVE_480V_RED) {
            speed = 2.0;
        } else if (this._mode === PowerFlowMode.RESIDUAL_AMBER) {
            speed = 0.6;
        }

        if (speed > 0) {
            this._flowOffset = (this._flowOffset + dt * speed) % 1.0;
            // Modulate material texture offset for particle current flow effect
        }
    }
}
