/**
 * VoltTwin AR v2.0 - Core Types and Enums
 * Snap SPECS AR Glasses - Lockout-Tagout (LOTO) Spatial Copilot
 */

export const LOTOState = {
    SPATIAL_CALIBRATION: "SPATIAL_CALIBRATION",       // State 1: LiDAR Grid & Spatial Anchor
    LIVE_ARC_FLASH: "LIVE_ARC_FLASH",                 // State 2: 480V Hazard Cage & Proximity Interlock
    MECHANICAL_ISOLATION: "MECHANICAL_ISOLATION",     // State 3: Guided Breaker B2 Isolation
    ZERO_ENERGY_VERIFICATION: "ZERO_ENERGY_VERIFICATION", // State 4: Ghost-Probe Multimeter 0V Check
    CRYPTOGRAPHIC_TAGOUT: "CRYPTOGRAPHIC_TAGOUT"      // State 5: Immutable Digital Padlock & Clearance
} as const;

export type LOTOState = typeof LOTOState[keyof typeof LOTOState];

export const PowerFlowMode = {
    LIVE_480V_RED: "LIVE_480V_RED",       // Full 480V dangerous live current flow
    RESIDUAL_AMBER: "RESIDUAL_AMBER",     // Isolated switch, residual capacitor charge warning
    ZERO_ENERGY_OFF: "ZERO_ENERGY_OFF",   // Conductor fully discharged (0.0V)
    SAFE_EMERALD: "SAFE_EMERALD"          // Digital clearance, all perimeters green
} as const;

export type PowerFlowMode = typeof PowerFlowMode[keyof typeof PowerFlowMode];

export interface SpatialAnchorConfig {
    panelId: string;
    defaultPosition: any;
    defaultRotation: any;
    defaultScale: any;
    isLocked: boolean;
}

export interface ProximityAlertConfig {
    hazardCenter: any;
    hazardDimensions: any;
    warningThresholdCm: number; // e.g. 15.0 cm
    isArmed: boolean;
}

export interface VoltageVerificationData {
    initialVoltage: number;     // 480.0 V
    intermediateVoltage: number;// 42.0 V
    finalVoltage: number;       // 0.0 V
    currentReading: number;
    isVerified: boolean;
}

export interface LOTOCertificate {
    permitId: string;          // e.g. "LOTO-HV-402-PERMIT"
    cryptographicHash: string; // e.g. "LOTO-HASH-994A"
    technicianId: string;      // e.g. "TECH-SPECS-01"
    timestampUtc: string;
    isCleared: boolean;
}
