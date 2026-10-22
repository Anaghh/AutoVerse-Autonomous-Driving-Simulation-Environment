# AutoVerse

### A virtual world filled with self-driving cars

AutoVerse is an autonomous driving simulation playground. The first foundation is a browser-based 3D highway where a population of neural controllers senses road boundaries and obstacles, steers, and evolves over successive generations.

**Status:** Runnable early prototype. This is the starting point for a larger virtual world; city roads, intersections, destination routing, and independently navigating traffic are future work.

## Why build AutoVerse?

Autonomous driving combines perception, decisions, and movement. AutoVerse makes that loop visible so we can inspect failures, change controller behavior, and measure progress in a virtual environment.

Starting with a highway keeps the initial problem small enough to debug. The simulation separates road geometry, vehicle movement, sensors, controllers, and training so these parts can be extended independently.

## What works now

- A Three.js highway with five lanes and recycled traffic obstacles.
- A population of 40 cars with independent neural controllers.
- Five forward sensor rays and two sideways rays, providing road, obstacle, heading, and lane-position inputs.
- A **9 → 5 → 5 → 2** neural network producing left/right steering decisions. Forward acceleration is automatic.
- Selection and mutation of the best controller, with one unmutated candidate retained.
- Automatic generation rollover when all cars stop or after 30 simulated seconds.
- A live network diagram, active-car count, generation count, and progress metrics.
- Pause/resume, save-best, reset-training, and orbit/zoom camera controls.
- Browser-local checkpoint persistence with validation of loaded data.
- Fixed 60 Hz simulation updates and disposal of replaced vehicle resources.

## Run locally

Use **Node.js 22.12 or newer** and npm. A browser with WebGL support is required.

```bash
git clone https://github.com/Anaghh/AutoVerse-Autonomous-Driving-Simulation-Environment.git
cd AutoVerse-Autonomous-Driving-Simulation-Environment
npm ci
npm run dev
```

Open the local URL printed by Vite, normally [http://127.0.0.1:5173](http://127.0.0.1:5173).

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` or `npm start` | Start the development server |
| `npm run build` | Check TypeScript and build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Compile and run simulation regression tests |

### Controls

| Control | Behavior |
| --- | --- |
| Drag the scene | Orbit the camera |
| Scroll over the scene | Zoom |
| Pause / Resume | Stop or continue simulation updates |
| Save best | Save the current population's leading controller if it beats the saved best |
| Reset training | Clear the saved controller and start a fresh population |

Best controllers are also saved automatically at generation boundaries. Checkpoints belong to the current browser and origin. If browser storage is unavailable, training continues in memory.

## How training works

1. Create 40 networks, or clone the saved best network into a new population.
2. Retain one unchanged candidate and mutate the remaining candidates by a factor of 0.1.
3. Feed sensor observations into each controller and apply its steering outputs.
4. Stop a car when it collides or produces conflicting left/right commands.
5. Rank the population by forward progress.
6. Save an improvement and begin the next generation.

The score is measured in **simulation units**, without a calibrated conversion to meters. A higher score indicates more progress in this highway scenario; it does not establish safe or general driving ability.

## Project structure

```text
index.html                         Application interface
src/main.ts                        Rendering, controls, fixed-step loop
src/style.css                      Responsive application styles
src/app/evolution/
  road.ts                          Highway and recycled obstacles
  car.ts                           Movement and vehicle appearance
  car-brain.ts                     Sensor inputs and controller outputs
  controls.ts                      Vehicle action state
  sensors-front.ts                 Forward sensing and collisions
  sensors-sides.ts                 Boundary and lane sensing
  neural-network.ts                Inference and mutation
  engine-ml.ts                     Population and generation lifecycle
  checkpoint.ts                    Persistence validation and population cloning
  resources.ts                     Three.js resource disposal
  visualizer.ts                    Network diagram
tests/simulation.test.ts           Regression tests
```

The foundation uses TypeScript, Vite, and Three.js. Rendering and application controls are independent of a frontend framework.

## Current limitations

- Traffic cars act as recycled obstacles in a scrolling highway, rather than autonomous agents with their own routes.
- Candidate cars do not collide with one another; they are parallel training attempts.
- Sensors and collision checks use simplified geometry. Vehicle dynamics are intentionally basic.
- Training and traffic placement are random; seeded, reproducible scenarios are not implemented yet.
- Progress is the only fitness metric. The simulation does not yet evaluate comfort, traffic-rule compliance, or unseen road layouts.
- There is no manual-driving mode, city map, backend, or shared online simulation.

## Next milestones

| Milestone | Completion check |
| --- | --- |
| Reproducible scenarios | A recorded seed recreates the same obstacle sequence |
| Evaluation suite | Saved controllers can be compared on fixed unseen scenarios |
| Better driving objectives | Report collisions, lane adherence, and progress separately |
| Vehicle dynamics and manual control | A user can drive, brake, and compare against learned behavior |
| Independent traffic | Other vehicles follow their own motion and collision rules |
| A larger virtual world | Add road segments, intersections, destinations, and routing |

## Contributing

Use [GitHub Issues](https://github.com/Anaghh/AutoVerse-Autonomous-Driving-Simulation-Environment/issues) to propose changes or report a reproducible problem. Include the scenario, expected behavior, and a way to check the result.

Before contributing code, run `npm test` and `npm run build`. Keep changes focused on a milestone and document new controls or dependencies.

## License

MIT. See [LICENSE](LICENSE) for terms and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for source provenance and applicable notices.

