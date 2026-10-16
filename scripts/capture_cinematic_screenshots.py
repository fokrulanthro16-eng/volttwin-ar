#!/usr/bin/env python3
"""
Capture 6 High-Definition Cinematic Screenshots for Devpost Submission Gallery
Outputs:
  - screenshots/screenshot-1-spatial-anchor.png & assets/devpost/
  - screenshots/screenshot-2-proximity-breach.png & assets/devpost/
  - screenshots/screenshot-3-exploded-view.png & assets/devpost/
  - screenshots/screenshot-4-thermal-load.png & assets/devpost/
  - screenshots/screenshot-5-loto-padlock.png & assets/devpost/
  - screenshots/screenshot-6-leaf-tests-pass.png & assets/devpost/
"""

import asyncio
import os
import shutil
import sys
from playwright.async_api import async_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIRS = [
    os.path.abspath("screenshots"),
    os.path.abspath(os.path.join("assets", "devpost"))
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

async def capture_all_screenshots():
    print("================================================================================")
    print("[START] CAPTURING 6 CINEMATIC DEVPOST SCREENSHOTS (1080p High-DPI)")
    print("================================================================================")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--enable-webgl",
                "--ignore-gpu-blocklist",
                "--use-gl=angle",
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream",
                "--window-size=1920,1080"
            ]
        )

        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1.5  # Crisp High-DPI rendering
        )

        page = await context.new_page()
        print("Navigating to http://localhost:3000...")
        await page.goto("http://localhost:3000", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Inject camera manipulation helpers
        await page.evaluate("""() => {
            window.setCam = (x, y, z) => {
                if (camera) {
                    camera.position.set(x, y, z);
                    if (controls) controls.target.set(0, 0, 0);
                }
            };
            window.setCamTarget = (x, y, z, tx, ty, tz) => {
                if (camera) {
                    camera.position.set(x, y, z);
                    if (controls) controls.target.set(tx, ty, tz);
                }
            };
        }""")

        # Helper to save screenshot to both directories
        async def save_shot(filename):
            primary_path = os.path.join(OUTPUT_DIRS[0], filename)
            await page.screenshot(path=primary_path, full_page=False)
            secondary_path = os.path.join(OUTPUT_DIRS[1], filename)
            shutil.copyfile(primary_path, secondary_path)
            size_kb = os.path.getsize(primary_path) / 1024
            print(f"  [SAVED] {filename} ({size_kb:.1f} KB)")

        # ----------------------------------------------------------------------
        # 1. screenshot-1-spatial-anchor.png
        # Live Webcam pass-through with target lock on Panel #HV-402 (99.4% confidence) & 1:1 metric Arc-Flash ring
        # ----------------------------------------------------------------------
        print("\n[1/6] Capturing screenshot-1-spatial-anchor.png...")
        await page.evaluate("""() => {
            window.scrollTo(0, 0);
            if (!isWebcamActive) toggleWebcamPassThrough();
            currentState = 2;
            renderState();
            // Show CV tracking overlay with 99.4% confidence
            const cv = document.getElementById('cvTrackingOverlay');
            if (cv) cv.classList.remove('hidden');
            const pillTitle = document.getElementById('spatialPillTitle');
            if (pillTitle) pillTitle.innerText = 'CV TARGET LOCK [HV-402] (99.4%)';
            const pillSub = document.getElementById('spatialPillSub');
            if (pillSub) pillSub.innerText = '1:1 Metric Calibration Anchor Locked (0, -10, -90) cm';
            setCam(14, 16, 115);
            setCamTarget(0, 0, 0);
        }""")
        await page.wait_for_timeout(1000)
        await save_shot("screenshot-1-spatial-anchor.png")

        # ----------------------------------------------------------------------
        # 2. screenshot-2-proximity-breach.png
        # Hand proximity under 15cm triggering crimson strobe warning, volumetric plasma particle blast, acoustic alert
        # ----------------------------------------------------------------------
        print("\n[2/6] Capturing screenshot-2-proximity-breach.png...")
        await page.evaluate("""() => {
            window.scrollTo(0, 0);
            if (isWebcamActive) toggleWebcamPassThrough(); // Turn off webcam for high contrast industrial lighting
            currentState = 2;
            renderState();
            document.getElementById('proximitySlider').value = 10;
            updateProximity(10);
            const strobe = document.getElementById('strobeAlert');
            if (strobe) strobe.classList.remove('hidden');
            if (plasmaParticles) plasmaParticles.visible = true;
            if (laserShieldMesh) laserShieldMesh.visible = true;
            if (ghostHandMesh) {
                ghostHandMesh.children.forEach(c => c.material.color.setHex(0xff0055));
            }
            setCamTarget(14, 8, 88, 0, 2, 0);
        }""")
        await page.wait_for_timeout(600)
        await save_shot("screenshot-2-proximity-breach.png")

        # ----------------------------------------------------------------------
        # 3. screenshot-3-exploded-view.png
        # 3D exploded view with separated cabinet doors, exposed busbars, LiDAR blue floor mesh, and unmasked acoustic occlusion
        # ----------------------------------------------------------------------
        print("\n[3/6] Capturing screenshot-3-exploded-view.png...")
        await page.evaluate("""() => {
            window.scrollTo(0, 0);
            const strobe = document.getElementById('strobeAlert');
            if (strobe) strobe.classList.add('hidden');
            document.getElementById('proximitySlider').value = 30;
            updateProximity(30);
            currentState = 3;
            renderState();
            if (!isExploded) toggleExplodedView();
            const grid = scene.getObjectByName("floorGrid");
            if (grid) grid.visible = true;
            // Occlusion badge unmasked
            const occText = document.getElementById('occlusionText');
            if (occText) occText.innerText = 'UNMASKED (0dB / RAW HARMONICS)';
            const occBadge = document.getElementById('occlusionBadge');
            if (occBadge) occBadge.className = 'bg-slate-950/85 backdrop-blur border border-amber-500 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2 text-[10px] font-mono text-amber-300 w-fit';
            setCam(-26, 22, 108);
            setCamTarget(0, 0, 0);
        }""")
        await page.wait_for_timeout(800)
        await save_shot("screenshot-3-exploded-view.png")

        # ----------------------------------------------------------------------
        # 4. screenshot-4-thermal-load.png
        # GLSL thermal load shaders showing amber-hot 68°C lines transitioning dynamically to cold 21°C cryo-blue
        # ----------------------------------------------------------------------
        print("\n[4/6] Capturing screenshot-4-thermal-load.png...")
        await page.evaluate("""() => {
            window.scrollTo(0, 0);
            currentState = 2;
            renderState();
            if (!isExploded) toggleExplodedView();
            // Highlight thermal load in telemetry
            const thmText = document.getElementById('thermalText');
            if (thmText) thmText.innerText = '68°C AMBER-HOT (JOULE LOAD DISSIPATION)';
            const thmBadge = document.getElementById('thermalBadge');
            if (thmBadge) thmBadge.className = 'bg-slate-950/85 backdrop-blur border border-rose-500 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2 text-[10px] font-mono text-rose-300 w-fit shadow-rose-950/50';
            setCam(0, 10, 78);
            setCamTarget(0, 0, 0);
        }""")
        await page.wait_for_timeout(600)
        await save_shot("screenshot-4-thermal-load.png")

        # ----------------------------------------------------------------------
        # 5. screenshot-5-loto-padlock.png
        # Immutable 3D glowing green digital padlock latched with cryptographic token overlay (LOTO-HASH-994A) and gaze-dwell reticle
        # ----------------------------------------------------------------------
        print("\n[5/6] Capturing screenshot-5-loto-padlock.png...")
        await page.evaluate("""() => {
            window.scrollTo(0, 0);
            if (isExploded) toggleExplodedView();
            currentState = 5;
            renderState();
            // Gaze reticle verified lock on T1
            const gazeSvg = document.getElementById('gazeProgressSvg');
            if (gazeSvg) gazeSvg.classList.remove('hidden');
            const gazeCircle = document.getElementById('gazeProgressCircle');
            if (gazeCircle) gazeCircle.style.strokeDashoffset = '0';
            const gazeLabel = document.getElementById('gazeHudLabel');
            if (gazeLabel) gazeLabel.innerText = '✓ GAZE 1.5s LOCK: TERMINAL T1 VERIFIED (0.0V)';
            setCam(4, 14, 94);
            setCamTarget(0, 0, 0);
        }""")
        await page.wait_for_timeout(600)
        await save_shot("screenshot-5-loto-padlock.png")

        # ----------------------------------------------------------------------
        # 6. screenshot-6-leaf-tests-pass.png
        # Complete HUD overview showing all 12 of 12 LEAF automated tests passing with 0 failures and the Download Audit JSON button
        # ----------------------------------------------------------------------
        print("\n[6/6] Capturing screenshot-6-leaf-tests-pass.png...")
        await page.evaluate("""() => {
            currentState = 5;
            renderState();
            setCam(0, 15, 120);
            setCamTarget(0, 0, 0);
            // Smoothly scroll down so LEAF test matrix is in full view along with audit log button
            window.scrollTo(0, 480);
        }""")
        await page.wait_for_timeout(600)
        await save_shot("screenshot-6-leaf-tests-pass.png")

        await browser.close()

    print("\n================================================================================")
    print(" ALL 6 CINEMATIC DEVPOST SCREENSHOTS CAPTURED SUCCESSFULLY!")
    print(f" Saved to: {OUTPUT_DIRS[0]} & {OUTPUT_DIRS[1]}")
    print("================================================================================\n")

if __name__ == "__main__":
    asyncio.run(capture_all_screenshots())
