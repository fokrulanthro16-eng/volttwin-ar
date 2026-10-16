/**
 * RemoteSupervisorTelemetry.ts
 * Manages remote expert engineer telemetry feed and live communication waveform in the waveguide HUD.
 * Simulates encrypted real-time supervisor field collaboration.
 */
@component
export class RemoteSupervisorTelemetry extends BaseScriptComponent {
    @input
    telemetryHudObject: SceneObject;

    @input
    supervisorNameText: Text;

    @input
    linkStatusText: Text;

    private _isConnected: boolean = true;
    private _supervisorName: string = "ENG-SARAH-CHEN (Lead Safety Engineer)";
    private _linkStatus: string = "ENCRYPTED 5G LINK (LATENCY: 12ms)";
    private _waveformAmplitude: number = 0.5;

    public onAwake(): void {
        this.updateHUD();
    }

    public get isConnected(): boolean {
        return this._isConnected;
    }

    public get supervisorName(): string {
        return this._supervisorName;
    }

    public get linkStatus(): string {
        return this._linkStatus;
    }

    public setConnectionStatus(connected: boolean): void {
        this._isConnected = connected;
        this.updateHUD();
    }

    private updateHUD(): void {
        if (this.supervisorNameText) {
            this.supervisorNameText.text = `REMOTE EXPERT: ${this._supervisorName}`;
        }
        if (this.linkStatusText) {
            this.linkStatusText.text = this._isConnected ? this._linkStatus : "DISCONNECTED";
        }
    }
}
