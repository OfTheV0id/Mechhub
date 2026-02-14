# App Presenter Boundary

`src/app` is the assembly layer.

## Presenter Responsibilities

- Compose feature presenters/views.
- Map hook outputs to view props.
- Do conditional rendering and route-level branching.

## Presenter Non-Responsibilities

- Do not own business rules or permission decision trees.
- Do not implement state machines or side-effect orchestration.
- Do not keep product mock fixtures/constants in presenter files.
- Do not duplicate derivation logic already available in hooks.

## Rule of Thumb

If logic is reusable, stateful, or policy-like, move it to `src/hooks` and consume it from `@hooks` in presenters.
