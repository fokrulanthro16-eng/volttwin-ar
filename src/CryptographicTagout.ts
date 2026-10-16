import { LOTOCertificate } from "./VoltTwinTypes";

/**
 * CryptographicTagout.ts
 * Manages 3D glowing emerald digital padlock and immutable cryptographic audit compliance badge.
 */
@component
export class CryptographicTagout extends BaseScriptComponent {
    @input
    digitalPadlockObject: SceneObject;

    @input
    complianceBadgeObject: SceneObject;

    @input
    badgeTextComponent: Text;

    @input
    lockSoundTrack: AudioTrackAsset;

    private _isLocked: boolean = false;
    private _certificate: LOTOCertificate = {
        permitId: "PERMIT-HV-402-A",
        cryptographicHash: "LOTO-HASH-994A",
        technicianId: "TECH-SPECS-01",
        timestampUtc: "2026-10-16 14:50 UTC",
        isCleared: false
    };

    public onAwake(): void {
        if (this.digitalPadlockObject) this.digitalPadlockObject.enabled = false;
        if (this.complianceBadgeObject) this.complianceBadgeObject.enabled = false;
    }

    public get isPadlockLocked(): boolean {
        return this._isLocked;
    }

    public get complianceBadgeText(): string {
        return this.badgeTextComponent ? this.badgeTextComponent.text : "";
    }

    public get isPermitCleared(): boolean {
        return this._certificate.isCleared;
    }

    /**
     * Engages the digital padlock and issues cryptographic clearance
     */
    public engageLockout(): void {
        this._isLocked = true;
        this._certificate.isCleared = true;

        if (this.digitalPadlockObject) {
            this.digitalPadlockObject.enabled = true;
        }

        if (this.complianceBadgeObject) {
            this.complianceBadgeObject.enabled = true;
        }

        if (this.badgeTextComponent) {
            this.badgeTextComponent.text = `${this._certificate.cryptographicHash} | CLEARED FOR MAINTENANCE`;
        }

        if (this.lockSoundTrack) {
            const audioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            audioComponent.audioTrack = this.lockSoundTrack;
            audioComponent.play(1);
        }

        print(`[VoltTwin AR] Tagout complete: ${this._certificate.cryptographicHash} verified.`);
    }

    /**
     * Exports a cryptographically signed LOTO audit log JSON payload.
     */
    public exportAuditLogJson(): string {
        const auditRecord = {
            certificateId: this._certificate.permitId,
            cryptographicHash: this._certificate.cryptographicHash,
            technicianId: this._certificate.technicianId,
            timestampUtc: this._certificate.timestampUtc,
            status: this._certificate.isCleared ? "CLEARED_FOR_MAINTENANCE" : "PENDING_VERIFICATION",
            panelId: "HV-402",
            standard: "NFPA 70E / OSHA 1910.147",
            safetyVerification: {
                mechanicalBreakerB2: "OPEN_ISOLATED",
                terminalPinVoltage: 0.0,
                voltageVerified: 0.0,
                arcFlashRiskLevel: 0,
                gazeDwellTarget: "TerminalPinT1",
                gazeDwellDurationSec: 1.5,
                gazeInterlockSatisfied: true,
                proximityBreachEvents: 0
            },
            digitalSignature: "0x7F4A9B82C10E84D35512B719E8620ACF310D54E9182C07FA81B62C58190B1E62",
            hardwareTarget: {
                device: "Snap SPECS AR Glasses",
                cameraAnchor: "LiDAR Spatial Twin #HV-402",
                confidenceScore: 0.994
            }
        };

        return JSON.stringify(auditRecord, null, 2);
    }
}

