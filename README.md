# AutoVerse
### A virtual world filled with self-driving cars

AutoVerse is a planned autonomous driving simulation environment where cars will sense their surroundings, make driving decisions, and learn to navigate a shared virtual world.

The goal is to make autonomous driving visible and approachable: watch vehicles interact, inspect their decisions, and experiment with how different driving strategies perform.

> **Project status:** Planning and initial documentation. The simulation has not been implemented yet. Features and milestones below describe the intended direction.

## The vision

Start with a car learning to stay on a road. Grow into a world of autonomous vehicles navigating traffic, avoiding collisions, and reaching destinations.

AutoVerse aims to bring together three parts:

- **A virtual world** with roads, lanes, obstacles, and eventually intersections.
- **Autonomous vehicles** that use simulated sensors to choose driving actions.
- **An experimentation loop** for comparing behavior and improving driving policies.

## Planned features

| Area | Intended capabilities |
| --- | --- |
| World | Road layouts, lane boundaries, obstacles, and traffic scenarios |
| Vehicles | Steering, acceleration, braking, and collision detection |
| Perception | Simulated distance sensors for nearby obstacles and road boundaries |
| Driving intelligence | Neural network controllers and experiments with evolutionary learning |
| Shared traffic | Multiple autonomous cars interacting in the same environment |
| Visualization | Sensor overlays and views of vehicle behavior |
| Evaluation | Track progress, collisions, and driving performance |

These capabilities are proposals and may evolve as the first prototype takes shape.

## How learning could work

The initial learning approach will explore a simple evolutionary loop:

1. Spawn a population of cars with variations of a driving controller.
2. Feed each controller readings from its car's simulated sensors.
3. Let the controller choose driving actions.
4. Evaluate each car using a defined driving score.
5. Keep promising controllers, introduce mutations, and run another generation.

The scoring rules, sensor layout, network architecture, and training parameters will be decided during implementation.

## Roadmap

- [ ] **First drive:** Render a basic road and add a manually controlled car.
- [ ] **Perception:** Add simulated sensors, road boundaries, and collision detection.
- [ ] **Autonomy:** Connect sensor readings to a driving controller.
- [ ] **Learning:** Implement evaluation, selection, mutation, and repeated generations.
- [ ] **Traffic:** Introduce multiple vehicles and more varied road scenarios.
- [ ] **Exploration:** Add controls and visualizations for inspecting experiments.
- [ ] **Reproducibility:** Document setup, controls, and how to run experiments.

## Getting started

You can clone the repository now:

```bash
git clone https://github.com/Anaghh/AutoVerse-Autonomous-Driving-Simulation-Environment.git
cd AutoVerse-Autonomous-Driving-Simulation-Environment
```

There is no runnable application yet. The technology stack, dependencies, and installation instructions will be documented when the first prototype is available.

## Contributing

Ideas, design discussions, and implementation proposals are welcome through [GitHub Issues](https://github.com/Anaghh/AutoVerse-Autonomous-Driving-Simulation-Environment/issues).

For a contribution, describe the behavior you want to add and how it supports the roadmap. Keep changes focused, and include instructions for checking any new functionality.

## Inspiration

[Bretto's Evolution](https://github.com/Bretto/evolution) is a reference for this project's direction. It demonstrates neural network driving with evolutionary learning in a Three.js environment.

AutoVerse aims to explore that learning idea within a broader virtual world of autonomous cars. Implementation choices for AutoVerse are still open.

## License

A license has not been selected yet.
