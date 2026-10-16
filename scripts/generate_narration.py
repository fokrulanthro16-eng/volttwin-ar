import os
import wave
import subprocess
import win32com.client

SCRIPT_SEGMENTS = [
    {
        "id": 1,
        "start_sec": 0.0,
        "rate": 3,
        "text": "Most AR experiences make the fatal mistake of floating flat 2D websites in front of your eyes. But an industrial electrician servicing a live 480-volt switchgear cannot tap floating screens or hold multimeters with occupied hands. Designed natively for Snap SPECS, VoltTwin AR v2.0 turns spatial computing into a hands-free safety copilot: sharing the technician’s view, drawing in the physical world at true 1:1 metric scale, and leaving hands completely free."
    },
    {
        "id": 2,
        "start_sec": 25.0,
        "rate": 1,
        "text": "Engineered from scratch using Snap's CLAD plugin alongside the Lens Studio MCP, our system is driven by a deterministic TypeScript finite state machine. Every spatial transformation, optical luminance threshold, and safety state is calculated in real-time to match Snap SPECS additive waveguide constraints."
    },
    {
        "id": 3,
        "start_sec": 50.0,
        "rate": 1,
        "text": "Powered by Three.js and WebGL, the optical viewport simulates real-time computer vision locking onto panel HV-402 with 99.4% confidence. Notice the 3D Arc-Flash boundary on the floor: when simulated hand proximity breaches the critical 15-centimeter zone, the waveguide triggers an additive crimson strobe warning alongside a volumetric plasma particle blast."
    },
    {
        "id": 4,
        "start_sec": 75.0,
        "rate": 2,
        "text": "Say 'Explode View', and our kinematic solver physically separates the cabinet modules in 3D world space. Behind the scenes, we integrated the Web Audio API with dynamic biquad filter nodes for real-time acoustic occlusion: the 60-Hertz transformer hum stays muffled by -12 decibels when closed, and immediately unmasks raw high harmonics when opened, while custom GLSL shaders visualize an amber-hot 68-degree load on active lines."
    },
    {
        "id": 5,
        "start_sec": 100.0,
        "rate": 2,
        "text": "Hands-free voice triggers like 'Toggle B2' isolate the breaker, decaying voltage to zero and transitioning conduits to a cold 21-degree blue. To prevent fatal oversights, a 1.5-second gaze-dwell interlock is enforced on Terminal Pin T1 before zero-energy status clears. Once verified, an immutable 3D glowing padlock snaps shut, tagged with cryptographic hash LOTO-HASH-994A."
    },
    {
        "id": 6,
        "start_sec": 125.0,
        "rate": 1,
        "text": "Zero-failure compliance is guaranteed: VoltTwin AR passes all 12 automated LEAF end-to-end tests—validating spatial anchors, acoustic biquad filters, and state logic. The complete tamper-proof audit trail can be instantly exported as a signed cryptographic JSON report directly from the HUD."
    },
    {
        "id": 7,
        "start_sec": 145.0,
        "rate": 1,
        "text": "Full-stack spatial intelligence engineered with Snap CLAD, Lens Studio MCP, TypeScript, and Three.js. This is VoltTwin AR v2.0 for Snap SPECS."
    }
]

def generate_segment_audio():
    os.makedirs("audio_output", exist_ok=True)
    speaker = win32com.client.Dispatch("SAPI.SpVoice")
    # Voice 0: David
    voices = speaker.GetVoices()
    speaker.Voice = voices.Item(0)
    print(f"Using Voice: {speaker.Voice.GetDescription()}")

    generated_files = []
    for seg in SCRIPT_SEGMENTS:
        seg_id = seg["id"]
        out_path = os.path.abspath(f"audio_output/segment_{seg_id}.wav")
        if os.path.exists(out_path):
            os.remove(out_path)

        stream = win32com.client.Dispatch("SAPI.SpFileStream")
        # 3 is SSFMCreateForWrite
        stream.Open(out_path, 3)
        speaker.AudioOutputStream = stream
        speaker.Rate = seg["rate"]
        speaker.Volume = 100
        speaker.Speak(seg["text"])
        stream.Close()

        with wave.open(out_path, 'rb') as wf:
            frames = wf.getnframes()
            rate = wf.getframerate()
            duration = frames / float(rate)
            print(f"[Segment {seg_id}] Generated: {duration:.2f}s | Starts at {seg['start_sec']}s")

        generated_files.append((out_path, seg["start_sec"]))

    return generated_files

def mix_master_narration():
    inputs = []
    filter_parts = []
    
    for i, seg in enumerate(SCRIPT_SEGMENTS):
        seg_file = f"audio_output/segment_{seg['id']}.wav"
        inputs.extend(["-i", seg_file])
        delay_ms = int(seg['start_sec'] * 1000)
        filter_parts.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}]")
    
    mix_inputs = "".join(f"[a{i}]" for i in range(len(SCRIPT_SEGMENTS)))
    filter_complex = ";".join(filter_parts) + f";{mix_inputs}amix=inputs={len(SCRIPT_SEGMENTS)}:dropout_transition=0:normalize=0[amix];[amix]apad=whole_dur=155[outa]"
    
    cmd = ["ffmpeg", "-y"] + inputs + [
        "-filter_complex", filter_complex,
        "-map", "[outa]",
        "-t", "155",
        "audio_output/narration_master.wav"
    ]
    
    print("Mixing master narration track with exact timeline synchronization...")
    subprocess.run(cmd, check=True)
    
    with wave.open("audio_output/narration_master.wav", 'rb') as wf:
        frames = wf.getnframes()
        rate = wf.getframerate()
        print(f"Master narration generated successfully: audio_output/narration_master.wav ({frames/float(rate):.1f}s)")

if __name__ == "__main__":
    generate_segment_audio()
    mix_master_narration()
