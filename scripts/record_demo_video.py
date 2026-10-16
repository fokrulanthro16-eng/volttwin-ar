import os
import sys
import time
import glob
import subprocess
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def run_automated_recording():
    output_video_dir = os.path.abspath("raw_recordings")
    os.makedirs(output_video_dir, exist_ok=True)
    
    # Clean previous raw recordings
    for f in glob.glob(os.path.join(output_video_dir, "*.webm")):
        try:
            os.remove(f)
        except Exception:
            pass

    print("================================================================================")
    print("[START] HIGH-RESOLUTION AUTOMATED RECORDER: VoltTwin AR v2.0")
    print("   Target: 1080p60 | Duration: 155.0s (2m 35s)")
    print("================================================================================")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--enable-webgl",
                "--ignore-gpu-blocklist",
                "--use-gl=angle",
                "--autoplay-policy=no-user-gesture-required",
                "--window-size=1920,1080"
            ]
        )

        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=output_video_dir,
            record_video_size={"width": 1920, "height": 1080}
        )

        page = context.new_page()
        print("Navigating to http://localhost:3000...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Helper to smoothly animate camera
        page.evaluate("""
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
        """)

        start_time = time.time()
        print(f"Recording started at T = 0.0s")

        def wait_until(target_t):
            now = time.time() - start_time
            sleep_duration = target_t - now
            if sleep_duration > 0:
                time.sleep(sleep_duration)

        # ----------------------------------------------------------------------
        # SEQUENCE 1 [0:00 - 0:25] Hook & Waveguide Thesis
        # Action: Load 3D WebGL viewport with live pass-through overlay & calibrated Arc-Flash boundary
        # ----------------------------------------------------------------------
        print("[0:00 - 0:25] Sequence 1: Hook & Waveguide Thesis (State 1 -> State 2)")
        
        # Subtle drift in State 1
        for step in range(5):
            angle = step * 0.08
            page.evaluate(f"setCam({15 * angle}, 15, {120 - 5 * angle})")
            time.sleep(1.0)

        # t = 6.0s: Lock coordinate frame
        wait_until(6.0)
        print("  -> T=6.0s: Locking LiDAR Spatial Twin Coordinate Frame")
        page.evaluate("advanceState()") # Locks calibration -> transitions toward State 2

        # t = 10.0s: Enter State 2 (Live Arc-Flash & 1.0m Perimeter Ring)
        wait_until(10.0)
        print("  -> T=10.0s: Entering State 2 (Live 480V Hazard Cage & 1.0m Floor Perimeter Ring)")
        page.evaluate("if (currentState === 1) advanceState();")

        # Smooth camera orbit around live hazard panel
        for t_step in range(11, 25):
            wait_until(float(t_step))
            ang = (t_step - 10) * 0.06
            cam_x = 35.0 * (ang / 1.0)
            cam_z = 120.0 - 15.0 * (ang / 1.0)
            page.evaluate(f"setCam({cam_x:.1f}, 15, {cam_z:.1f})")

        # ----------------------------------------------------------------------
        # SEQUENCE 2 [0:25 - 0:50] Core Stack (CLAD + Lens Studio MCP + TypeScript)
        # Action: Pan over StateController.ts, VoiceDispatcher.ts, and architecture schematics
        # ----------------------------------------------------------------------
        wait_until(25.0)
        print("[0:25 - 0:50] Sequence 2: Core Stack (CLAD + Lens Studio MCP + TypeScript)")
        
        # Switch to Architecture Tab
        page.evaluate("showDoc('arch')")
        page.evaluate("setCam(0, 15, 115)")

        # Smoothly scroll architecture documentation to show FSM and NFPA 70E equations
        for step in range(1, 12):
            wait_until(26.0 + step * 1.5)
            scroll_y = step * 35
            page.evaluate(f"document.getElementById('docViewer').scrollTop = {scroll_y}")

        # Hover quick links
        wait_until(44.0)
        page.evaluate("document.getElementById('docViewer').scrollTop = 280")

        # ----------------------------------------------------------------------
        # SEQUENCE 3 [0:50 - 1:15] Three.js Engine & Arc-Flash Hazard Breach
        # Action: Orbit camera around panel, slide hand proximity under 15cm, trigger crimson strobe & plasma arc blast
        # ----------------------------------------------------------------------
        wait_until(50.0)
        print("[0:50 - 1:15] Sequence 3: Three.js Engine & 15cm Hand Proximity Breach")
        page.evaluate("showDoc('brief')")
        page.evaluate("document.getElementById('docViewer').scrollTop = 0")
        page.evaluate("setCam(20, 15, 105)")

        # Smooth hand approach toward 480V breaker
        wait_until(57.0)
        print("  -> Hand advancing toward live conductors...")
        distances = [30, 26, 22, 18, 14, 11, 8]
        for idx, d in enumerate(distances):
            wait_until(57.0 + idx * 0.7)
            page.evaluate(f"document.getElementById('proximitySlider').value = {d}; updateProximity({d});")

        # t = 62.0s: Hand is at 8cm (<15cm danger threshold) -> Triggering plasma spark burst
        wait_until(62.0)
        print("  -> T=62.0s: BREACH! Volumetric Plasma Particle Blast & Crimson Strobe Warning")
        page.evaluate("triggerPlasmaBurst()")

        # Hold alert for 3 seconds, then retract hand safely
        wait_until(66.0)
        print("  -> Retracting hand to safe distance (30cm)...")
        retract_distances = [12, 18, 24, 30]
        for idx, d in enumerate(retract_distances):
            wait_until(66.0 + idx * 0.8)
            page.evaluate(f"document.getElementById('proximitySlider').value = {d}; updateProximity({d});")

        # ----------------------------------------------------------------------
        # SEQUENCE 4 [1:15 - 1:40] 3D Exploded-View & Web Audio Occlusion
        # Action: Trigger 'Explode View', smoothly animate panel doors and busbars outward, expose raw hum & 68°C thermal load
        # ----------------------------------------------------------------------
        wait_until(75.0)
        print("[1:15 - 1:40] Sequence 4: 3D Exploded-View & Spatial Audio Occlusion")
        print("  -> T=75.5s: Triggering 'Explode View' kinematic solver...")
        page.evaluate("toggleExplodedView()")

        # Orbit camera to inspect exploded modules from 3/4 angle
        for t_step in range(76, 95):
            wait_until(float(t_step))
            ang = (t_step - 76) * 0.1
            cam_x = 40.0 * (1.0 - abs(ang - 1.0))
            cam_z = 100.0 + 10.0 * (ang * 0.5)
            page.evaluate(f"setCam({cam_x:.1f}, 20, {cam_z:.1f})")

        # Collapse cabinet modules back into place
        wait_until(95.0)
        print("  -> T=95.0s: Collapsing cabinet modules back into casing")
        page.evaluate("toggleExplodedView()")
        page.evaluate("setCam(0, 15, 115)")

        # ----------------------------------------------------------------------
        # SEQUENCE 5 [1:40 - 2:05] Hands-Free LOTO & Gaze-Dwell Interlock
        # Action: Issue 'Toggle B2', transition thermal conduits to cryo-blue, complete 1.5s gaze-dwell reticle countdown on T1, latch 3D green digital padlock
        # ----------------------------------------------------------------------
        wait_until(100.0)
        print("[1:40 - 2:05] Sequence 5: Hands-Free Voice Isolation & Gaze-Dwell Interlock")
        print("  -> T=100.5s: Voice Command 'Toggle B2' (Breaker B2 Isolates, Amber Residual Charge)")
        page.evaluate("triggerVoice('Toggle B2')")

        # t = 105.0s: Advance to State 4 (Zero-Energy Verification & Ghost Multimeter Probes)
        wait_until(105.0)
        print("  -> T=105.0s: State 4: Translucent Ghost Probes at 45° & 21°C Cryo-Blue Conduits")
        page.evaluate("advanceState()")
        
        # Zoom camera into Terminal Pin T1 to show gaze dwell reticle countdown
        wait_until(107.0)
        page.evaluate("setCamTarget(14, 2, 70, 14, -4, 0)") # Zoom into T1

        # Gaze dwell finishes around t = 111.0s
        wait_until(112.0)
        print("  -> T=112.0s: Gaze Dwell Interlock Locked! (0.0V Verified)")
        page.evaluate("setCam(0, 15, 115)")

        # t = 115.0s: Advance to State 5 (Cryptographic Tagout)
        wait_until(115.0)
        print("  -> T=115.0s: State 5: Digital Padlock Engaged & LOTO-HASH-994A Minted")
        page.evaluate("advanceState()")

        # ----------------------------------------------------------------------
        # SEQUENCE 6 [2:05 - 2:25] LEAF Verification (12/12) & Cryptographic Audit Export
        # Action: Scroll to reveal 12 of 12 LEAF test badges passing, click and trigger JSON audit report export
        # ----------------------------------------------------------------------
        wait_until(125.0)
        print("[2:05 - 2:25] Sequence 6: LEAF 12/12 Verification & Audit Log Export")
        print("  -> Scrolling page down to highlight all 12 passing LEAF tests...")
        
        # Smoothly scroll main page down to show LEAF test matrix
        for step in range(1, 8):
            wait_until(125.0 + step * 0.8)
            page.evaluate(f"window.scrollTo(0, {step * 60});")

        wait_until(134.0)
        # Scroll back up to viewport toolbar
        page.evaluate("window.scrollTo(0, 0);")

        wait_until(137.0)
        print("  -> T=137.0s: Clicking '📥 Export Audit Log (JSON)' HUD button...")
        page.evaluate("exportAuditLogJson()")

        # ----------------------------------------------------------------------
        # SEQUENCE 7 [2:25 - 2:35] Punchline Sign-off
        # Action: Center full 3D spatial viewport with green compliance badge
        # ----------------------------------------------------------------------
        wait_until(145.0)
        print("[2:25 - 2:35] Sequence 7: Heroic Sign-off & 3D Spatial Center")
        
        # Slow heroic 360-degree orbit around emerald green compliance model
        for t_step in range(145, 155):
            wait_until(float(t_step))
            ang = (t_step - 145) * 0.15
            cam_x = 25.0 * ang
            cam_z = 115.0 - 5.0 * ang
            page.evaluate(f"setCam({cam_x:.1f}, 15, {cam_z:.1f})")

        wait_until(155.0)
        print("T = 155.0s: Recording sequence complete. Closing context...")

        context.close()
        browser.close()

    # Find the generated webm video file
    recorded_files = glob.glob(os.path.join(output_video_dir, "*.webm"))
    if not recorded_files:
        raise RuntimeError("No recorded video file found in output directory!")
    
    raw_video = max(recorded_files, key=os.path.getctime)
    print(f"Raw video recorded: {raw_video}")

    # Final Composite Encoding with FFmpeg
    output_mp4 = os.path.abspath("demo-submission.mp4")
    soundtrack = os.path.abspath("audio_output/complete_soundtrack.wav")

    print("================================================================================")
    print("[ENCODING] FINAL BROADCAST VIDEO: demo-submission.mp4")
    print("   Input Video: " + raw_video)
    print("   Input Audio: " + soundtrack)
    print("================================================================================")

    cmd_encode = [
        "ffmpeg", "-y",
        "-i", raw_video,
        "-i", soundtrack,
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        "-r", "60",
        "-c:a", "aac",
        "-b:a", "320k",
        "-shortest",
        output_mp4
    ]

    subprocess.run(cmd_encode, check=True)
    file_size_mb = os.path.getsize(output_mp4) / (1024 * 1024)
    print("================================================================================")
    print(f"[SUCCESS] FINAL VIDEO READY: {output_mp4} ({file_size_mb:.2f} MB)")
    print("================================================================================")

if __name__ == "__main__":
    run_automated_recording()
