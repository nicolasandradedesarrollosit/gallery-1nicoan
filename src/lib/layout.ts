/**
 * Justified rows: every row fills the width and its photos share one height, so each
 * photo is as wide as its proportions ask for and none is cropped. How many photos a
 * row takes is picked at random from a seed, which keeps builds reproducible.
 */

export interface RowRules {
  /** How many photos a row may aim for. */
  counts: readonly number[];
  /** A row is width / height = the sum of its photos' ratios. Below this it is too tall. */
  minSum: number;
  /** Above this it is too short. */
  maxSum: number;
}

export interface Cell {
  /** Share of the row's width, gaps aside. */
  fraction: number;
  /** Photos in the row, to know how many gaps to subtract. */
  count: number;
}

/** Small seeded generator (mulberry32): same seed, same sequence. */
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Splits the photos (as width / height ratios, in order) into rows; one cell per photo. */
export function justify(ratios: number[], rules: RowRules, seed: number): Cell[] {
  const next = random(seed);
  const cells: Cell[] = [];
  let previous = 0;

  for (let start = 0; start < ratios.length; ) {
    // Never the same size twice in a row, unless that would just alternate two sizes.
    const options = rules.counts.filter((count) => count !== previous);
    const pool = options.length > 1 ? options : rules.counts;
    const target = pool[Math.floor(next() * pool.length)];

    let count = 0;
    let sum = 0;
    while (start + count < ratios.length) {
      const ratio = ratios[start + count];
      const tallEnough = sum >= rules.minSum;
      if (count > 0 && tallEnough && (count >= target || sum + ratio > rules.maxSum)) break;
      sum += ratio;
      count++;
    }

    // Only the last row can come up short; it keeps its height instead of stretching.
    const width = Math.max(sum, rules.minSum);
    for (let i = 0; i < count; i++) {
      // Rounded down so a row never adds up to more than its width.
      cells.push({ fraction: Math.floor((ratios[start + i] / width) * 10000) / 10000, count });
    }
    previous = count;
    start += count;
  }
  return cells;
}
