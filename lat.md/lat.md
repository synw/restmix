This directory defines the high-level concepts, business logic, and architecture of this project using markdown. It is managed by lat.md, a tool that anchors source code to these definitions.

- [[api-contracts]] — public surface: every exported type and function with its exact signature
- [[architecture]] — mental model: composable factory, closure state, request pipeline
- [[components]] — per-member behaviour of the client object returned by `useApi`
- [[design-decisions]] — rationale behind the factory pattern, the fetch wrapper, and the CSRF scheme
- [[domain-concepts]] — composable-client, REST, and security domains Restmix bridges
- [[test-specs]] — Jest suite against a live Express mock server: cases, techniques, gaps
