/**
 * leaf_runtime_mock.ts
 * Lens Studio & LEAF (Lens Evaluation and Automation Framework) Runtime Simulator.
 * Allows deterministic automated execution of LEAF test scenarios in Node.js.
 */

export class MockVec3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    distance(other: MockVec3): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    clone(): MockVec3 {
        return new MockVec3(this.x, this.y, this.z);
    }
}

export class MockVec4 {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

export class MockQuat {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static quatIdentity(): MockQuat {
        return new MockQuat(0, 0, 0, 1);
    }

    static fromEulerVec(vec: MockVec3): MockQuat {
        return new MockQuat(vec.x, vec.y, vec.z, 1);
    }
}

export class MockTransform {
    private _pos: MockVec3 = new MockVec3();
    private _rot: MockQuat = MockQuat.quatIdentity();
    private _scale: MockVec3 = new MockVec3(1, 1, 1);

    getWorldPosition(): MockVec3 { return this._pos; }
    setWorldPosition(p: MockVec3): void { this._pos = p; }
    getWorldRotation(): MockQuat { return this._rot; }
    setWorldRotation(r: MockQuat): void { this._rot = r; }
    setWorldScale(s: MockVec3): void { this._scale = s; }
    getLocalScale(): MockVec3 { return this._scale; }
    setLocalScale(s: MockVec3): void { this._scale = s; }
    setLocalRotation(r: MockQuat): void { this._rot = r; }
}

export class MockSceneObject {
    public enabled: boolean = true;
    public name: string = "";
    private _transform: MockTransform = new MockTransform();
    private _components: Map<string, any> = new Map();

    constructor(name: string = "") {
        this.name = name;
    }

    getTransform(): MockTransform {
        return this._transform;
    }

    createComponent(type: string): any {
        const comp: any = { type, audioTrack: null, play: (c: number) => {} };
        this._components.set(type, comp);
        return comp;
    }

    getComponent(type: string): any {
        return this._components.get(type) || null;
    }

    registerComponent(type: string, comp: any): void {
        this._components.set(type, comp);
    }
}

export class MockBaseScriptComponent {
    private _sceneObject: MockSceneObject = new MockSceneObject();
    private _events: Map<string, Array<() => void>> = new Map();

    getSceneObject(): MockSceneObject {
        return this._sceneObject;
    }

    createEvent(eventName: string): { bind: (fn: () => void) => void } {
        return {
            bind: (fn: () => void) => {
                if (!this._events.has(eventName)) {
                    this._events.set(eventName, []);
                }
                this._events.get(eventName)!.push(fn);
            }
        };
    }

    triggerEvent(eventName: string): void {
        const handlers = this._events.get(eventName);
        if (handlers) {
            for (const h of handlers) h();
        }
    }
}

// Attach globals for Lens Studio TypeScript compatibility
(globalThis as any).vec3 = MockVec3;
(globalThis as any).vec4 = MockVec4;
(globalThis as any).quat = MockQuat;
(globalThis as any).BaseScriptComponent = MockBaseScriptComponent;
(globalThis as any).component = (target: any) => target;
(globalThis as any).input = (target: any, key: string) => {};
(globalThis as any).getDeltaTime = () => 0.016;
(globalThis as any).print = (...args: any[]) => console.log(...args);

// LEAF Test Framework Simulator
export interface LEAFContext {
    findSceneObject: (name: string) => MockSceneObject;
    findComponent: (name: string) => any;
    sik: {
        simulatePinch: (options: { target?: MockSceneObject; durationMs?: number }) => Promise<void>;
        simulateHandMove: (options: { position: MockVec3; durationMs?: number }) => Promise<void>;
    };
    wait: (ms: number) => Promise<void>;
}

export class LEAFTestRunner {
    private _tests: Array<{ suite: string; name: string; fn: (ctx: LEAFContext) => Promise<void> }> = [];

    describe(suiteName: string, defineSuite: () => void): void {
        defineSuite();
    }

    it(testName: string, fn: (ctx: LEAFContext) => Promise<void>): void {
        this._tests.push({ suite: "LEAF", name: testName, fn });
    }

    expect(actual: any) {
        return {
            toBe: (expected: any) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected}, but got ${actual}`);
                }
            },
            toBeCloseTo: (expected: number, delta: number = 0.1) => {
                if (Math.abs(actual - expected) > delta) {
                    throw new Error(`Expected ${actual} to be close to ${expected} (delta: ${delta})`);
                }
            },
            toContain: (expectedSubstring: string) => {
                if (typeof actual !== "string" || !actual.includes(expectedSubstring)) {
                    throw new Error(`Expected "${actual}" to contain "${expectedSubstring}"`);
                }
            }
        };
    }

    get tests() {
        return this._tests;
    }
}
