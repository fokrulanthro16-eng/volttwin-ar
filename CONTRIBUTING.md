# Contributing to VoltTwin AR v2.0

Thank you for your interest in contributing to **VoltTwin AR v2.0**! We welcome contributions from spatial computing engineers, electrical safety experts, and TypeScript developers.

---

## Code of Conduct

All contributors and maintainers are expected to adhere to professional standards of mutual respect, safety consciousness, and technical rigor.

---

## Development Setup & Workflow

### Prerequisites
* **Node.js:** v18.0.0 or higher (v20+ recommended)
* **Python:** 3.10+ (for neural audio synthesis and automated screen recorder)
* **FFmpeg:** Installed and on your system `PATH`
* **Snap Lens Studio:** 5.24+ (configured with Spectacles Interaction Kit v1.4+)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/fokrulanthro16-eng/volttwin-ar.git
   cd volttwin-ar
   ```

2. Run the automated LEAF test suite:
   ```bash
   npx tsx tests/run_leaf_tests.ts
   ```

3. Start the local 3D spatial web simulator:
   ```bash
   npx serve . -p 3000
   ```

---

## Contribution Guidelines & Principles

### 1. The Three Spatial AR Pillars Are Non-Negotiable
* **Shares Your View:** All safety overlays must align with the user's optical perspective.
* **Draws in the World at 1:1 Scale:** Never introduce floating 2D browser windows in the sky. All cages, conduits, and padlocks must be spatially anchored at true metric centimeter scale.
* **Leaves Hands 100% Free:** No feature may mandate touch interaction. Always provide voice command and gaze dwell fallbacks.

### 2. Zero Test Regressions (12/12 LEAF Tests)
Before submitting a pull request, you must execute the automated verification suite:
```bash
npx tsx tests/run_leaf_tests.ts
```
All 12 LEAF test criteria (`LEAF-01` through `LEAF-12`) must report `[PASS]`. If you introduce a new safety-critical feature, you must author a corresponding LEAF automated test case.

---

## Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Commit your changes using Conventional Commits:
   ```bash
   git commit -m "feat: add FLIR Lepton sidecar camera streaming support"
   ```
3. Push to your branch and open a PR against `main`.
4. Ensure all continuous integration checks and automated LEAF tests pass.
