#!/usr/bin/env python3
"""
Build Master Studio Soundtrack for VoltTwin AR v2.0
Duration: 111.58 seconds (Exact match with public/demo-narration.mp3)
Layers:
  1. Christopher Neural Studio Voice (public/demo-narration.mp3)
  2. 60Hz + 120Hz Transformer Hum with Acoustic Occlusion
  3. Volumetric Plasma Spark Crackle Burst (at 31.0s)
  4. Padlock Snap Chime (at 93.5s)
Output:
  - audio_output/studio_demo_soundtrack.wav
"""

import os
import subprocess
import sys

TOTAL_DURATION = 111.58

def build_studio_soundtrack():
    os.makedirs("audio_output", exist_ok=True)
    voice_mp3 = "public/demo-narration.mp3"
    if not os.path.exists(voice_mp3):
        print(f"[ERROR] {voice_mp3} not found. Run scripts/generate_studio_narration.py first.")
        sys.exit(1)

    print(f"[1/4] Synthesizing 60Hz transformer hum with acoustic occlusion ({TOTAL_DURATION}s)...")
    # Hum Volume Envelope:
    # 0s to 17s: 0.06 (State 1)
    # 17s to 55s: 0.12 (State 2 & 3 closed cabinet)
    # 55s to 70s: 0.40 (Exploded-view, unmasked raw 60Hz hum)
    # 70s to 85s: 0.10 (State 4 closed cabinet)
    # 85s to 112s: 0.0 (Zero-energy verified, circuit de-energized)
    hum_volume_expr = "if(between(t,0,17),0.06,if(between(t,17,55),0.12,if(between(t,55,70),0.40,if(between(t,70,85),0.10,0.0))))"
    hum_file = "audio_output/studio_hum.wav"
    cmd_hum = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", f"aevalsrc=0.5*sin(2*PI*60*t) + 0.3*sin(2*PI*120*t) + 0.15*sin(2*PI*180*t):s=44100:d={TOTAL_DURATION}",
        "-af", f"volume='{hum_volume_expr}':eval=frame,lowpass=f=450",
        "-t", str(TOTAL_DURATION),
        hum_file
    ]
    subprocess.run(cmd_hum, check=True)

    print(f"[2/4] Synthesizing plasma arc spark crackle burst at t=31.0s...")
    plasma_file = "audio_output/studio_plasma.wav"
    cmd_plasma = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", "anoisesrc=d=2.5:c=white:r=44100:a=0.35",
        "-af", f"bandpass=f=2600:width_type=h:w=1200,volume=0.45,adelay=31000|31000,apad=whole_dur={TOTAL_DURATION}",
        "-t", str(TOTAL_DURATION),
        plasma_file
    ]
    subprocess.run(cmd_plasma, check=True)

    print(f"[3/4] Synthesizing digital padlock snap chime at t=93.5s...")
    padlock_file = "audio_output/studio_padlock.wav"
    cmd_padlock = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", "sine=f=880:d=0.35",
        "-af", f"volume=0.40,adelay=93500|93500,apad=whole_dur={TOTAL_DURATION}",
        "-t", str(TOTAL_DURATION),
        padlock_file
    ]
    subprocess.run(cmd_padlock, check=True)

    print(f"[4/4] Compositing master studio soundtrack...")
    master_wav = "audio_output/studio_demo_soundtrack.wav"
    cmd_mix = [
        "ffmpeg", "-y",
        "-i", voice_mp3,
        "-i", hum_file,
        "-i", plasma_file,
        "-i", padlock_file,
        "-filter_complex",
        "[0:a]volume=1.0[vocal];"
        "[1:a]volume=0.5[hum];"
        "[2:a]volume=0.75[plasma];"
        "[3:a]volume=0.70[snap];"
        "[vocal][hum][plasma][snap]amix=inputs=4:dropout_transition=0:normalize=0[mix];"
        f"[mix]apad=whole_dur={TOTAL_DURATION}[outa]",
        "-map", "[outa]",
        "-ar", "48000",
        "-t", str(TOTAL_DURATION),
        master_wav
    ]
    subprocess.run(cmd_mix, check=True)
    print(f"[SUCCESS] Master studio soundtrack generated: {master_wav} ({os.path.getsize(master_wav)} bytes, {TOTAL_DURATION}s)")

if __name__ == "__main__":
    build_studio_soundtrack()
