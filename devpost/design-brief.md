---
status: approved
---

# Design brief: VoltTwin AR v2.0

## The one spatial moment
A high-voltage electrical technician stands in front of a live 480V industrial breaker panel with hands 100% free to hold physical multimeters and insulated tools, seeing a spatial 3D pulsing arc-flash hazard cage and holographic X-ray current flow lines directly anchored at 1:1 scale onto the physical cabinet, guiding them step-by-step through hands-free mechanical isolation, 3D ghost-probe zero-energy verification, and digital cryptographic tagout.

## Why it belongs on glasses
- Uses: shares your view, draws in the world, leaves your body free
- Why it's better than the phone or laptop version: High-voltage technicians must hold heavy, insulated voltage probes and screwdrivers with both hands while adhering to strict OSHA NFPA 70E safety boundaries. Having to look away at a 2D tablet, laptop, or paper schematic breaks situational awareness, causing fatal arc-flash explosions and misidentified live breakers. Snap SPECS glasses project 1:1 real-scale 3D hazard boundaries, internal X-ray wire conduits, and exact probe placement angles directly onto the physical hardware while keeping the technician's hands completely unencumbered.

## Product or overlay
- Type: overlay: it responds to something real
- What the real version would sense: Physical industrial electrical breaker panel (`Panel #HV-402`), breaker toggle switch orientations, and the 3D position of the technician's hands relative to live conductor surfaces.
- Stand-in for the preview: A simulated 3D electrical panel cabinet (`Panel #HV-402`, 60 cm wide x 80 cm tall x 25 cm deep) instantiated 90 cm in front of the camera, equipped with interactive main breaker, B2 branch switch, and T1/T2 copper terminal pins. A spatial "Sync Spatial Twin" calibration prompt and SIK button trigger the LiDAR-style coordinate alignment.

## Where things live
- Where the user is looking during the main task: Directly forward and 10°–15° downward toward the electrical panel breakers and terminal busbars (arm's length distance, ~80–90 cm).
- Physical/Stand-in Electrical Panel: Sits 90 cm directly ahead, centered 10 cm below eye level (60 cm wide x 80 cm tall x 25 cm deep).
- 3D Hazard Bounding Cage: Spatially anchored directly encasing the 480V Main Breaker (18 cm wide x 12 cm tall x 10 cm deep), pulsing warning crimson red when energized.
- 1-Meter 3D Arc-Flash Perimeter Ring: Spatially projected onto the floor plane centered beneath the panel, radius 100 cm, pulsing warning red and displaying `NFPA 70E ARC FLASH BOUNDARY: 1.0M`.
- 3D X-Ray Internal Wire Conduits: Spatially aligned inside the panel casing connecting Main Breaker to Breakers B1–B4 (1.2 cm diameter holographic cylindrical conduits with animated particle flows).
- 3D Ghost Multimeter Probes: Spatially positioned 5 cm directly in front of Terminal Pins T1 and T2 at a 45° angle of attack, translucent red (Probe +) and black (Probe -), 15 cm probe length.
- Floating Spatial Status Pill: Floats 10 cm directly above the active target component (Breaker B2 during Step 1; Terminals T1–T2 during Step 2), 24 cm wide x 8 cm tall, always billboarded toward user eye level.
- 3D Cryptographic Padlock & Compliance Badge: Spatially locked over Breaker B2's isolated handle (10 cm x 14 cm glowing emerald padlock) alongside a floating compliance badge (`20 cm x 6 cm`, displaying `LOTO-HASH-994A | CLEARED FOR MAINTENANCE`).

## Hands and input
- Air-Pinch / Mouse Click: Standard SIK pinch gesture (or interactive preview mouse click) to trigger Spatial Calibration, confirm Breaker B2 Isolation, and confirm 0.0V Zero-Energy Verification.
- Spatial Hand-Proximity Breach Trigger: SIK hand-tracking distance tracker calculates distance between hand joint transforms and the 3D live hazard cage. Breaching within 15 cm triggers an instant flashing red boundary warning and high-priority spatial audio alarm.
- Large targets: Breaker B2 toggle handle (10 cm x 10 cm target area) and Step Confirmation pills (24 cm x 8 cm) with intuitive hover state highlights and audio feedback.
- Voice: None required; all interactions operate completely hands-free via Air-Pinch and spatial proximity triggers.

## When things show
- Spatial Calibration Wireframe: Visible during State 1 (Spatial Twin Sync); fades out once surface lock is confirmed.
- 3D Hazard Bounding Cage & 1m Perimeter Ring: Appears intensely in State 2 (Live 480V); transitions to pulsing amber in State 3 (Residual Capacitor Charge); turns off or turns emerald green in State 5 (Safe to Work).
- Proximity Breach Alert: Appears only when the technician's hand enters the 15 cm danger buffer around live conductors.
- 3D Directional Arrow & Ghost Lever: Appears during State 3 pointing directly at Breaker B2; disappears immediately when B2 is toggled to OFF.
- 3D Ghost Multimeter Probes: Appears during State 4 at Terminals T1 and T2; disappears once 0.0V verification is confirmed.
- 3D Glowing Digital Padlock & Compliance Badge: Appears in State 5 over the isolated B2 handle, permanently locking the state to verify audit clearance.
- Attention hint: If the technician turns away while a live hazard is active, a subtle directional arrow at the viewport edge and a directional 3D audio ping points back to `Panel #HV-402`.

## Done criteria
Each one can be checked in Lens Studio's preview:
1. Spatial Twin Sync & Calibration: In Interactive Preview, clicking the calibration prompt anchors the 3D electrical panel stand-in and displays a LiDAR scan grid locking to coordinate (0, -10, -90) cm.
2. Live Arc-Flash Hazard & Hand Proximity Alert: State 2 displays a pulsing red 3D hazard cage over the main breaker and a 1-meter floor perimeter ring; moving the simulated hand within 15 cm of the cage triggers an immediate red warning flash and audio alarm.
3. Guided Mechanical Isolation: State 3 displays a pulsing 3D directional arrow and ghost lever over Breaker B2; clicking B2 switches it to OFF, causing internal holographic current particles to transition from bright live Red to pulsing Amber (Residual Capacitor Charge warning).
4. Ghost-Probe Zero-Energy Verification: State 4 renders translucent red and black 3D ghost multimeter probes aligned at 45° to terminals T1/T2, with a floating pill running a live discharge countdown (`480V -> 42V -> 0.0V VERIFIED`); clicking confirms zero energy.
5. Immutable Cryptographic Tagout: State 5 transitions all hazard rings to Emerald Green, locks a glowing 3D digital padlock over Breaker B2, and renders the immutable audit tag (`LOTO-HASH-994A | CLEARED FOR MAINTENANCE`).

## Out of scope
- Multi-user remote peer sharing (Connected Lenses).
- Real camera machine-learning recognition of arbitrary unknown electrical panels.
- Direct live SAP/Maximo cloud ERP database synchronization (simulated locally via cryptographic SHA-256 hash stamp).

## Risks and open questions
- Real hand tracking noise when wearing thick 1000V insulated rubber electrical gloves (tested cleanly with SIK mouse/hand simulation in Preview; labeled "feel unproven" on physical high-voltage rubber gloves).
- Ambient factory acoustic noise masking audio alarms (compensated with high-visibility pulsing volumetric spatial lighting and perimeter floor flashes).

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
