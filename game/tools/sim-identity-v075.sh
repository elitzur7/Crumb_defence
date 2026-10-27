#!/bin/bash
# paired-seed identity: same harness (sims5.mjs, DT=60), old = v0.7.4.1 build dir, new = v0.7.5; CL1, ZAPFROM=3, 400 seeds
cd "$(dirname "$0")"
j(){ while [ $(jobs -r | wc -l) -ge 7 ]; do sleep 0.3; done; }
for L in 1 2 10 17 6 20; do for V in old new; do j; env DT=60 ZAPFROM=3 LEVELS=$L-$L CLS=1 SEEDS=400 node sims5.mjs $V r/$V-L$L.json >/dev/null & done; done
wait; echo ALLDONE
