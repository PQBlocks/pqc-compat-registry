# Benchmarks

`@pqblocks/pqc-compat-registry` is a lookup-and-validate data registry, not a performance product: the
spec-defined win condition is **correctness** — every OID lookup and every size validation across all corpus
sizes must succeed and produce output identical to the FIPS reference tables (`successRate=1.0` AND
`outputEqual=true` over corpus sizes 1/3/5/25/100).

## Setup

| Field | Value |
|---|---|
| CPU | Intel(R) Core(TM) i5-10300H CPU @ 2.50GHz (8 threads) |
| Arch / Platform | x64 / linux |
| Node | v26.11.1 |
| OS | 7.2.11-1-cachyos |
| RAM | 23891 MB |
| Host | Linux x64 CI Instance |
| Date | 2026-11-07T19:08:52.498Z |

Protocol: OID registry lookups — `validate_oid` + `parse_oid` + `get_oid_by_algorithm` per corpus entry.
Algorithms covered: 8. Corpus sizes: 1 / 3 / 5 / 25 / 100. Concurrency: 1. Output-equality: every lookup
compares `get_oid_by_algorithm(algo)` against the registry's dotted OID; any mismatch sets `outputEqual=false`.
(source: bench/benchmark-card.md)

## Results

| Metric | Value |
|---|---|
| Overall success rate | 1 |
| Overall output-equal | true |
| Total lookups | 134 |
| Successful lookups | 134 |
| Corpus sizes covered | 1 / 3 / 5 / 25 / 100 |

(source: bench/benchmark-card.md)

### Per-corpus-size

| Run file | Size | successRate | outputEqual | lookups | successful |
|---|---|---|---|---|---|
| runs/run-1.json | 1 | 1 | true | 1 | 1 |
| runs/run-100.json | 100 | 1 | true | 100 | 100 |
| runs/run-25.json | 25 | 1 | true | 25 | 25 |
| runs/run-3.json | 3 | 1 | true | 3 | 3 |
| runs/run-5.json | 5 | 1 | true | 5 | 5 |

(source: bench/benchmark-card.md)

Latency and throughput numbers are **not measured**: no timing data was collected for this package, and the
benchmark card carries only correctness metrics (successRate, outputEqual) computed from raw per-lookup
results (source: bench/benchmark-card.md, Notes section).

## Losing cases and caveats

None recorded: all corpus sizes hit `successRate=1.0` and `outputEqual=true`
(source: bench/benchmark-card.md).

Caveats:

- These results are from an in-process lookup workload (validate → parse → get, per entry). They say nothing
  about network-serving deployments; this package performs no I/O.
- The benchmark covers the 8 algorithms wired into the bench corpus. The full registry exposes 26 algorithms
  (6 ML-KEM, 8 ML-DSA, 12 SLH-DSA); the 18 non-bench entries are exercised by the unit-test suite instead
  (source: tests/registry.test.js, testreport/results-summary.json).
- No timing claims are made anywhere in this document (source: bench/benchmark-card.md notes).

## How to reproduce

```bash
cd <repo-root>
node bench/run.js      # writes bench/runs/run-*.json and bench/BENCHMARK-SUMMARY.json
node bench/card.js     # writes bench/benchmark-card.md from the run files
```

The card is regenerated from raw per-lookup results, never asserted: successRate/outputEqual are computed from
the run files (source: bench/benchmark-card.md, Notes section).
