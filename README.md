# AutoVerse

### A virtual world filled with self-driving cars

AutoVerse is a planned autonomous driving simulation environment for building, observing, and evaluating intelligent vehicles in a shared virtual world. Cars will use simulated sensors to understand nearby roads and obstacles, choose driving actions, and improve through repeated experiments.

The long-term vision is a world where many autonomous cars navigate together, respond to traffic, and reach destinations. Development will begin with a smaller, measurable challenge: getting one car to drive reliably on a simple road.

> **Status: Planning and initial documentation.** There is no runnable simulation yet. The features, architecture, and milestones below describe the proposed implementation.

## Why build AutoVerse?

Autonomous driving brings perception, decision-making, and motion together. A controller must turn incomplete observations into useful actions while the environment continues to change. A virtual world gives us a practical setting for exploring that relationship.

AutoVerse is intended to make those experiments understandable and repeatable:

- **Make decisions visible.** Sensor overlays and vehicle telemetry will help explain why a car steers, slows down, or collides.
- **Learn through experimentation.** Adjustable scenarios will let us investigate how road layouts, obstacles, and controller settings affect driving.
- **Compare approaches fairly.** Shared scenarios and recorded configurations will provide a consistent basis for comparing controllers.
- **Build complexity gradually.** Starting with a simple road will make individual failures easier to diagnose before adding interacting vehicles and intersections.

The intended audience includes students learning autonomous systems, developers experimenting with driving controllers, and anyone interested in watching intelligent behavior emerge in a simulated world.

## Project objectives

1. Create a virtual road environment with predictable vehicle movement and collision rules.
2. Connect simulated observations to steering, acceleration, and braking.
3. Explore neural networks and evolutionary learning as an initial approach to autonomous control.
4. Evaluate driving using explicit metrics across multiple scenarios.
5. Extend the environment toward multiple vehicles and richer traffic interactions.

AutoVerse is intended as an educational and experimental simulator. Its results will describe performance within its modeled environment; they will not establish readiness for real-world driving.

## Planned capabilities

| Component | Proposed behavior | Purpose |
| --- | --- | --- |
| Road environment | Lanes, boundaries, obstacles, and configurable layouts | Define repeatable driving challenges |
| Vehicle model | Position, heading, speed, steering, acceleration, and braking | Translate controller actions into movement |
| Simulated sensors | Distance readings for road edges and nearby obstacles | Give each controller a limited view of its surroundings |
| Driving controllers | Manual control, a simple baseline, and neural network experiments | Compare learned behavior against understandable starting points |
| Evolutionary learning | Population evaluation, selection, mutation, and saved controllers | Explore improvement across generations |
| Shared traffic | Multiple vehicles occupying and navigating the same roads | Study interactions beyond isolated driving |
| Inspection tools | Sensor overlays, selected-car telemetry, and experiment statistics | Make failures and progress easier to understand |

These capabilities are planned. The technology stack and implementation details remain open.

## Proposed system design

The simulation will separate the world, vehicle behavior, and learning process so each can be developed and checked independently.

```text
World state
    |
    v
Simulated sensors
    |
    v
Driving controller
    |
    v
Steering / acceleration / braking
    |
    v
Vehicle movement and collision checks
    |
    v
Updated world state --> Metrics and experiment results
```

The controller will act on the observations it is given. The simulation will handle movement and collisions, while the evaluation layer records performance. This separation will allow different controllers to be tested within the same environment.

## Initial learning approach

The first learning experiments will explore neuroevolution: searching for useful neural network parameters through selection and mutation.

1. Initialize a population of driving controllers.
2. Run their vehicles under comparable scenario conditions.
3. Supply sensor readings and apply each controller's actions.
4. Evaluate progress, collisions, and road adherence.
5. Retain promising controllers and create mutated variants.
6. Repeat across generations and evaluate saved controllers on additional scenarios.

This approach provides a concrete starting point for observing how controller changes affect behavior. Network size, sensor count, mutation settings, and scoring weights will be chosen during prototyping.

A higher training score alone will not be treated as proof of better driving. Evaluation should also include roads or obstacle arrangements that were not used to select the controller.

## Measuring progress

The proposed evaluation will report individual metrics alongside any combined fitness score.

| Metric | What it helps assess |
| --- | --- |
| Forward progress or route completion | Whether a car makes useful progress toward its goal |
| Collision rate | How frequently driving attempts end in contact |
| Time or distance outside road boundaries | Whether the controller stays within the drivable area |
| Completion time | How efficiently a successful run reaches its goal |
| Variation across repeated runs | Whether performance is consistent |
| Performance on unseen scenarios | Whether behavior extends beyond the training layout |

Scoring will need to discourage shortcuts such as remaining stationary to avoid collisions or leaving the road to gain distance. Target values and baseline results will be documented once the prototype can produce measurements.

## Development roadmap

| Milestone | Planned work | Completion check |
| --- | --- | --- |
| 1. Basic world | Render a road and implement a manually controlled vehicle | A user can steer, accelerate, brake, and reset |
| 2. Perception and collisions | Add boundaries, obstacles, sensors, and collision detection | Sensor readings respond to geometry and collisions are recorded |
| 3. Autonomous baseline | Connect observations to a simple driving policy | A vehicle navigates a defined basic scenario without manual input |
| 4. Learning loop | Add neural controllers, evaluation, selection, and mutation | Generations run and controller results can be saved and compared |
| 5. Evaluation | Record configurations and test additional scenarios | Saved controllers can be evaluated under documented conditions |
| 6. Shared traffic | Introduce multiple interacting vehicles | Vehicles detect and respond to other cars in a shared scenario |
| 7. Richer world | Explore intersections, routes, and inspection controls | More complex scenarios have documented behavior and metrics |

The first priority is a small working simulation with clear behavior and useful measurements. Larger environments will follow as the foundations become reliable.

## Getting started

Clone the repository:

```bash
git clone https://github.com/Anaghh/AutoVerse-Autonomous-Driving-Simulation-Environment.git
cd AutoVerse-Autonomous-Driving-Simulation-Environment
```

The repository currently contains project documentation. Installation steps, dependencies, launch commands, and controls will be added when the first runnable prototype is available.

## Contributing

Ideas and implementation proposals are welcome through [GitHub Issues](https://github.com/Anaghh/AutoVerse-Autonomous-Driving-Simulation-Environment/issues).

Useful early contributions include defining the vehicle model, designing road scenarios, proposing sensor behavior, and specifying evaluation metrics. For a proposed change, describe the problem, expected behavior, and how the result can be checked. Keep contributions focused on a roadmap milestone and document any new setup requirements.

## License

A license has not been selected yet.
