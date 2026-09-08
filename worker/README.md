# Distribution Worker

Collects, and hands back, how everyone did on a given question — four counters
per question, one per scoring band.

No guess, no answer, no identifier, no play timestamp. The only thing a
submission says is *"someone landed in this band on this question"*.

Deploy steps, the data shape, and the known limits are in
[../DEVELOPING.md](../DEVELOPING.md#comparison-chart).

```bash
node worker.test.mjs    # endpoint logic against an in-memory stand-in for D1
```
