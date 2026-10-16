#!/usr/bin/env python3
"""
Generate Studio-Quality Neural Speech for VoltTwin AR v2.0
Voice: en-US-ChristopherNeural (rate: -10%)
Outputs:
  - public/demo-narration.mp3
  - demo-narration.mp3
  - public/demo-narration.json
"""

import asyncio
import json
import os
import re
import shutil
import subprocess
import sys

try:
    import edge_tts
except ImportError:
    print("[ERROR] edge-tts is not installed. Run: pip install edge-tts")
    sys.exit(1)

VOICE = "en-US-ChristopherNeural"
RATE = "-10%"

SEGMENTS = [
    {
        "id": 1,
        "state": 1,
        "action": "state_1_init",
        "title": "State 1: Calibration & Optical CV Lock",
        "text": "Welcome to VoltTwin AR v2.0 for Snap SPECS glasses. In State 1, real-time computer vision scans the room and locks onto Panel HV-402 with 99.4% confidence.",
        "pause_after": 0.8
    },
    {
        "id": 2,
        "state": 2,
        "action": "state_2_hazard",
        "title": "State 2: Live Arc-Flash Hazard & 68°C Thermal Conduits",
        "text": "State 2: A pulsing crimson hazard cage and 1-meter floor perimeter ring appear. Conduits glow amber-hot at 68 degrees Celsius.",
        "pause_after": 0.8
    },
    {
        "id": 3,
        "action": "proximity_breach",
        "title": "Proximity Warning & Plasma Arc Blast",
        "text": "Warning! The proximity interlock detects the technician hand entering 15 centimeters. Watch the volumetric plasma spark burst and high-voltage acoustic discharge!",
        "pause_after": 1.2
    },
    {
        "id": 4,
        "state": 3,
        "action": "state_3_isolation",
        "title": "State 3: Hands-Free Mechanical Isolation",
        "text": "State 3: The technician issues hands-free speech command: Toggle B2. Breaker B2 isolates.",
        "pause_after": 0.8
    },
    {
        "id": 5,
        "action": "explode_view",
        "title": "3D Exploded-View & Audio Occlusion Unmasking",
        "text": "The technician says 'Explode View', expanding 3D cabinet modules outward. Notice spatial acoustic occlusion unmasking the raw 60 Hertz transformer hum from -12dB to full unattenuated volume.",
        "pause_after": 1.2
    },
    {
        "id": 6,
        "state": 4,
        "action": "state_4_verification",
        "title": "State 4: Gaze Dwell & Ghost Probe Zero-Energy Verification",
        "text": "State 4: OSHA zero-energy verification. The technician locks head-gaze on Terminal T1 for 1.5 seconds. Translucent 3D ghost probes align at 45 degrees as voltage drops to zero point zero volts.",
        "pause_after": 1.0
    },
    {
        "id": 7,
        "state": 5,
        "action": "state_5_tagout",
        "title": "State 5: Immutable Cryptographic Tagout & Audit Export",
        "text": "State 5: Tagout complete! All perimeters turn emerald green, a glowing digital padlock snaps over the breaker, electrical hum is silenced, and cryptographic audit log LOTO-HASH-994A is automatically exported. Safe to work!",
        "pause_after": 1.0
    }
]

TEMP_DIR = os.path.join("audio_output", "studio_segments")
PUBLIC_DIR = "public"
OUTPUT_MP3 = os.path.join(PUBLIC_DIR, "demo-narration.mp3")
OUTPUT_JSON = os.path.join(PUBLIC_DIR, "demo-narration.json")
ROOT_MP3 = "demo-narration.mp3"

def get_mp3_duration(path: str) -> float:
    cmd = ["ffmpeg", "-i", path]
    proc = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True, check=False)
    # Search for "Duration: 00:00:10.50"
    match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", proc.stderr)
    if match:
        h, m, s = match.groups()
        return int(h) * 3600 + int(m) * 60 + float(s)
    raise RuntimeError(f"Could not parse duration from {path}")

async def synthesize_all():
    os.makedirs(TEMP_DIR, exist_ok=True)
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    print(f"[1/4] Synthesizing {len(SEGMENTS)} speech segments using {VOICE} ({RATE})...")
    for seg in SEGMENTS:
        out_file = os.path.join(TEMP_DIR, f"seg_{seg['id']}.mp3")
        print(f"  -> Seg {seg['id']}: \"{seg['text'][:40]}...\"")
        comm = edge_tts.Communicate(seg["text"], VOICE, rate=RATE)
        await comm.save(out_file)

    print("[2/4] Measuring segment durations and generating timeline cues...")
    current_time = 0.0
    timeline = []
    concat_files = []

    for i, seg in enumerate(SEGMENTS):
        seg_file = os.path.abspath(os.path.join(TEMP_DIR, f"seg_{seg['id']}.mp3"))
        duration = get_mp3_duration(seg_file)
        start_time = round(current_time, 2)
        end_time = round(start_time + duration, 2)

        cue = {
            "id": seg["id"],
            "title": seg["title"],
            "action": seg["action"],
            "startTime": start_time,
            "endTime": end_time,
            "duration": round(duration, 2),
            "text": seg["text"]
        }
        if "state" in seg:
            cue["state"] = seg["state"]

        timeline.append(cue)
        concat_files.append(seg_file)
        print(f"  -> Seg {seg['id']} [{start_time:05.2f}s - {end_time:05.2f}s] ({duration:.2f}s)")

        # Create silence file for pause_after if not the last segment
        pause = seg.get("pause_after", 0.0)
        if pause > 0 and i < len(SEGMENTS) - 1:
            silence_file = os.path.abspath(os.path.join(TEMP_DIR, f"silence_{seg['id']}.mp3"))
            cmd = [
                "ffmpeg", "-y", "-f", "lavfi", "-i",
                "anullsrc=r=24000:cl=mono",
                "-t", str(pause),
                "-c:a", "libmp3lame", "-b:a", "128k",
                silence_file
            ]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            concat_files.append(silence_file)
            current_time = end_time + pause
        else:
            current_time = end_time

    total_duration = round(current_time, 2)
    print(f"  Total Master Narration Duration: {total_duration}s")

    print("[3/4] Concatenating segments into studio master MP3...")
    concat_list_file = os.path.join(TEMP_DIR, "concat_list.txt")
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for cf in concat_files:
            # ffmpeg concat demuxer requires forward slashes or escaped backslashes
            safe_path = cf.replace("\\", "/")
            f.write(f"file '{safe_path}'\n")

    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", concat_list_file,
        "-c:a", "libmp3lame", "-b:a", "192k",
        OUTPUT_MP3
    ]
    subprocess.run(cmd, check=True)

    # Also copy to root for flexible access
    shutil.copyfile(OUTPUT_MP3, ROOT_MP3)
    print(f"  -> Saved master audio: {OUTPUT_MP3} & {ROOT_MP3}")

    print("[4/4] Writing timeline cue metadata to JSON...")
    output_meta = {
        "voice": VOICE,
        "rate": RATE,
        "totalDuration": total_duration,
        "cues": timeline
    }
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output_meta, f, indent=2)
    print(f"  -> Saved timeline cues: {OUTPUT_JSON}")

    print("\n================================================================================")
    print(" Studio Neural Narration Generation Complete!")
    print(f" File: {OUTPUT_MP3} ({os.path.getsize(OUTPUT_MP3)} bytes, {total_duration}s)")
    print("================================================================================\n")

if __name__ == "__main__":
    asyncio.run(synthesize_all())
