#!/usr/bin/env python3
"""
Automated High-Resolution Video Recorder for VoltTwin AR v2.0
Synchronized with Studio Neural Audio (public/demo-narration.mp3 + spatial audio)
Duration: 111.58s (Exact match with audio track)
Output:
  - demo-submission.mp4 (1080p60 H.264 High Profile, AAC Stereo)
  - thumbnail_exploded.jpg
  - thumbnail_tagout.jpg
"""

import glob
import os
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

TOTAL_DURATION = 111.58

def run_studio_video_recording():
    output_video_dir = os.path.abspath("raw_recordings")
    os.makedirs(output_video_dir, exist_ok=True)

    # Clean old webm recordings
    for f in glob.glob(os.path.join(output_video_dir, "*.webm")):
        try:
            os.remove(f)
        except Exception:
            pass

    # Ensure master soundtrack exists
    master_soundtrack = "audio_output/studio_demo_soundtrack.wav"
    if not os.path.exists(master_soundtrack):
        import build_studio_soundtrack
        build_studio_soundtrack.build_studio_soundtrack()

    print("================================================================================")
    print("[START] STUDIO NEURAL VIDEO RECORDER: VoltTwin AR v2.0")
    print(f"   Target: 1080p60 H.264 | Duration: {TOTAL_DURATION}s")
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
        page.wait_for_timeout(1500)

        # Inject camera manipulation helpers
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

        print(f"Triggering Auto-Play Judge Demo at T = 0.0s...")
        page.click("#autoPlayBtn")
        start_time = time.time()

        def wait_until(target_t):
            now = time.time() - start_time
            sleep_duration = target_t - now
            if sleep_duration > 0:
                time.sleep(sleep_duration)

        # --- Choreography matching the 111.58s timeline ---

        # Sequence 1: State 1 CV Lock (0s - 17.38s)
        print("  -> [0.0s - 17.38s] State 1: Spatial Twin Calibration & CV Lock")
        for t_step in range(1, 17):
            wait_until(float(t_step))
            drift_x = 10.0 * (t_step / 17.0)
            drift_z = 120.0 - 5.0 * (t_step / 17.0)
            page.evaluate(f"setCam({drift_x:.1f}, 15, {drift_z:.1f})")

        # Sequence 2: State 2 Hazard Cage & Thermal Conduits (17.38s - 29.92s)
        print("  -> [17.38s - 29.92s] State 2: 480V Live Hazard Cage & 68°C Thermal Conduits")
        for t_step in range(18, 30):
            wait_until(float(t_step))
            ang = (t_step - 17.0) / 12.0
            cam_x = 10.0 + 18.0 * ang
            cam_y = 15.0 + 5.0 * ang
            cam_z = 115.0 - 15.0 * ang
            page.evaluate(f"setCam({cam_x:.1f}, {cam_y:.1f}, {cam_z:.1f})")

        # Sequence 3: Proximity Hand Breach & Plasma Arc Blast (29.92s - 44.66s)
        print("  -> [29.92s - 44.66s] Proximity Breach: Hand moves within 15cm & Plasma Arc Blast")
        for t_step in range(30, 44):
            wait_until(float(t_step))
            # Close focus on terminal and hand
            if 31 <= t_step <= 37:
                page.evaluate("setCamTarget(15, 8, 85, 0, 5, 0)")
            else:
                page.evaluate("setCam(10, 12, 100)")

        # Sequence 4: State 3 Mechanical Isolation (44.66s - 54.99s)
        print("  -> [44.66s - 54.99s] State 3: Hands-Free Mechanical Isolation (Breaker B2 Isolated)")
        for t_step in range(45, 55):
            wait_until(float(t_step))
            cam_x = -15.0 * ((t_step - 44.0) / 10.0)
            page.evaluate(f"setCam({cam_x:.1f}, 15, 105)")

        # Sequence 5: 3D Exploded-View Architecture (54.99s - 72.44s)
        print("  -> [54.99s - 72.44s] 3D Exploded-View: Expanding Modules Outward (+25cm)")
        for t_step in range(55, 72):
            wait_until(float(t_step))
            orbit_ang = ((t_step - 55.0) / 17.0) * 3.14159
            cam_x = -25.0 * float(1 - 2 * (t_step - 55.0) / 17.0)
            cam_y = 22.0
            cam_z = 110.0 - 10.0 * float(t_step - 55.0) / 17.0
            page.evaluate(f"setCam({cam_x:.1f}, {cam_y:.1f}, {cam_z:.1f})")

        # Sequence 6: State 4 Gaze Dwell & Ghost Probes (72.44s - 91.82s)
        print("  -> [72.44s - 91.82s] State 4: Gaze Dwell Lock on T1 & Translucent Ghost Probes (0.0V)")
        for t_step in range(73, 91):
            wait_until(float(t_step))
            ang = (t_step - 72.0) / 19.0
            cam_x = 5.0 * ang
            cam_y = 10.0 + 3.0 * ang
            cam_z = 88.0 + 8.0 * ang
            page.evaluate(f"setCam({cam_x:.1f}, {cam_y:.1f}, {cam_z:.1f})")

        # Sequence 7: State 5 Emerald Digital Padlock & Audit Export (91.82s - 111.58s)
        print("  -> [91.82s - 111.58s] State 5: Emerald Digital Padlock Latch & LOTO-HASH-994A Audit Export")
        for t_step in range(92, 106):
            wait_until(float(t_step))
            orbit = (t_step - 91.0) / 14.0
            cam_x = 20.0 * float(1 - orbit)
            cam_y = 15.0
            cam_z = 105.0 + 10.0 * orbit
            page.evaluate(f"setCam({cam_x:.1f}, {cam_y:.1f}, {cam_z:.1f})")

        # Final showcase of LEAF test matrix & sign-off
        print("  -> [106.0s - 111.58s] Closing Heroic Spatial Orbit & 12/12 LEAF Test Suite")
        page.evaluate("window.scrollBy({ top: 350, behavior: 'smooth' })")
        wait_until(TOTAL_DURATION)

        print(f"Recording complete at T = {TOTAL_DURATION}s. Finalizing context...")
        page.close()
        context.close()
        browser.close()

    # Find the newly created webm file
    webm_files = glob.glob(os.path.join(output_video_dir, "*.webm"))
    if not webm_files:
        print("[ERROR] No recorded webm file found in raw_recordings.")
        sys.exit(1)
    raw_video = webm_files[0]
    print(f"Raw video recorded: {raw_video} ({os.path.getsize(raw_video)} bytes)")

    # ----------------------------------------------------------------------
    # FFmpeg Muxing & Transcoding into Master 1080p60 H.264
    # ----------------------------------------------------------------------
    final_output = "demo-submission.mp4"
    print("================================================================================")
    print(f"[ENCODING] RENDER FINAL 1080p60 BROADCAST MASTER: {final_output}")
    print(f"   Video Source: {raw_video}")
    print(f"   Audio Source: {master_soundtrack}")
    print("================================================================================")

    cmd_encode = [
        "ffmpeg", "-y",
        "-i", raw_video,
        "-i", master_soundtrack,
        "-c:v", "libx264",
        "-profile:v", "high",
        "-preset", "slow",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        "-r", "60",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "48000",
        "-shortest",
        "-t", str(TOTAL_DURATION),
        final_output
    ]
    subprocess.run(cmd_encode, check=True)
    video_size = os.path.getsize(final_output)

    print("================================================================================")
    print(f"[SUCCESS] FINAL STUDIO VIDEO READY: {os.path.abspath(final_output)} ({video_size / (1024*1024):.2f} MB)")
    print("================================================================================")

    # Generate fresh video thumbnails
    print("Extracting high-resolution thumbnails...")
    subprocess.run(["ffmpeg", "-y", "-ss", "00:01:02", "-i", final_output, "-frames:v", "1", "-q:v", "2", "thumbnail_exploded.jpg"], check=True)
    subprocess.run(["ffmpeg", "-y", "-ss", "00:01:40", "-i", final_output, "-frames:v", "1", "-q:v", "2", "thumbnail_tagout.jpg"], check=True)
    print("Thumbnails generated: thumbnail_exploded.jpg & thumbnail_tagout.jpg")

if __name__ == "__main__":
    run_studio_video_recording()
