import subprocess
import os

def build_complete_soundtrack():
    os.makedirs("audio_output", exist_ok=True)
    
    # 1. First ensure narration_master.wav is generated
    narration_path = "audio_output/narration_master.wav"
    if not os.path.exists(narration_path):
        import generate_narration
        generate_narration.generate_segment_audio()
        generate_narration.mix_master_narration()

    # 2. Synthesize High-Voltage 60Hz + 120Hz Hum with dynamic acoustic occlusion
    # Volume:
    # 0s to 10s: 0.0 (calibration)
    # 10s to 75s: 0.12 (closed cabinet, -12dB muffled)
    # 75s to 98s: 0.45 (exploded view, 0dB unoccluded)
    # 98s to 115s: 0.12 (closed cabinet)
    # 115s to 155s: 0.0 (safe de-energized 0V)
    hum_volume_expr = "if(between(t,10,75), 0.14, if(between(t,75,98), 0.50, if(between(t,98,115), 0.14, 0.0)))"
    
    cmd_hum = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", "aevalsrc=0.5*sin(2*PI*60*t) + 0.3*sin(2*PI*120*t) + 0.15*sin(2*PI*180*t):s=44100:d=155",
        "-af", f"volume='{hum_volume_expr}':eval=frame,lowpass=f=450",
        "audio_output/hum_ambient.wav"
    ]
    subprocess.run(cmd_hum, check=True)

    # 3. Synthesize Plasma Spark Crackle Burst (fires at t = 62.0s for 2.5s)
    cmd_plasma = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", "anoisesrc=d=2.2:c=white:r=44100:a=0.35",
        "-af", "bandpass=f=2600:width_type=h:w=1200,volume=0.45,adelay=62000|62000,apad=whole_dur=155",
        "-t", "155",
        "audio_output/plasma_crackle.wav"
    ]
    subprocess.run(cmd_plasma, check=True)

    # 4. Synthesize Padlock Snap Chime at t = 115s
    cmd_chime = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", "sine=f=880:d=0.3",
        "-af", "volume=0.35,adelay=115000|115000,apad=whole_dur=155",
        "-t", "155",
        "audio_output/padlock_snap.wav"
    ]
    subprocess.run(cmd_chime, check=True)

    # 5. Mix all layers with narration as the primary master track (ducking background appropriately)
    cmd_final_mix = [
        "ffmpeg", "-y",
        "-i", "audio_output/narration_master.wav",
        "-i", "audio_output/hum_ambient.wav",
        "-i", "audio_output/plasma_crackle.wav",
        "-i", "audio_output/padlock_snap.wav",
        "-filter_complex", 
        "[0:a]volume=1.0[vocal];"
        "[1:a]volume=0.6[hum];"
        "[2:a]volume=0.8[plasma];"
        "[3:a]volume=0.7[snap];"
        "[vocal][hum][plasma][snap]amix=inputs=4:dropout_transition=0:normalize=0[mix];"
        "[mix]apad=whole_dur=155[outa]",
        "-map", "[outa]",
        "-t", "155",
        "audio_output/complete_soundtrack.wav"
    ]
    subprocess.run(cmd_final_mix, check=True)
    print("Complete synchronized soundtrack generated: audio_output/complete_soundtrack.wav (155s)")

if __name__ == "__main__":
    build_complete_soundtrack()
