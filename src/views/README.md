# MechHub Views

`src/views` is a pure presentation layer.

Rules:
- Do not use React Hooks in `src/views` (`useState`, `useEffect`, `useMemo`, custom `use*`, or `React.use*`).
- Do not fetch data, call services, or perform side effects in `src/views`.
- Receive all state, derived values, and handlers through props from `src/app/presenters` and `src/hooks`.
