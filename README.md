# TikTok Shop Vietnam: commission rates by category, effective-dated

Open data: TikTok Shop Vietnam's seller commission schedule, at two points in
time, diffed category by category.

TikTok publishes each schedule as a PDF and replaces it in place. Nobody keeps
the old one, so once a schedule changes there is no public record of what the
rate used to be, which makes it impossible to say how much any category actually
moved. This repository is that record.

## What changed

Between the schedule effective **9 May 2026** and the one effective
**3 July 2026** (standard shops; **3 August 2026** for Mall shops):

| | Categories |
|---|---:|
| Comparable across both versions | **1,808** |
| Commission **increased** | **1,352** |
| Commission **cut** | **403** |
| Unchanged | **53** |

The largest single increase is **Máy đọc sách điện tử** (e-readers), from
**2% to 10.5%**, a rise of 8.5 percentage points.

The widely repeated line is that TikTok Shop "raised its fees". That is true of
most categories, but **403 categories were cut**, and that half of the change
went essentially unreported.

## Files

| Path | What it is |
|---|---|
| `data/tiktok-shop-vn-commission-diff.csv` | The diff. One row per comparable category, old and new rate for both tiers, and the delta. |
| `data/schedule-2026-05-09.json` | The earlier schedule, as extracted. |
| `data/schedule-2026-07-03.json` | The later schedule, as extracted. |
| `method/commission-diff.ts` | The comparison code that produced the CSV. |
| `method/commission-matrix.ts` | Type definitions for the schedule JSON. |

CSV columns: `group`, `level_1`, `level_2`, `level_3`, `standard_pct_old`,
`standard_pct_new`, `standard_delta`, `mall_pct_old`, `mall_pct_new`,
`mall_delta`.

Category names are kept **in Vietnamese, exactly as TikTok publishes them**.
They are the join key back to the official schedule; translating them would make
the data impossible to reconcile against the source, which would defeat the
point of publishing it.

## Method

Both schedules were extracted from TikTok Shop Vietnam's own PDFs and compared
with a script. No row was retyped by hand.

Categories are matched on all four levels (`group / level_1 / level_2 /
level_3`). Only categories present in **both** versions are compared: **231
categories appeared** and **98 disappeared** between the two schedules, and
those have no delta to report, so they are excluded from the 1,808.

The comparison code is in this repository, under [`method/`](method), the same
pure functions that produced the CSV, so the result is reproducible rather than
merely asserted.

One detail worth knowing if you diff these schedules yourself: category names are
transcribed from PDFs whose casing drifts between editions. The May schedule
writes `Mẹ & bé` where the July one writes `Mẹ & Bé`. Matching literally silently
drops all 199 categories in that group, so the key folds case and collapses runs
of whitespace before comparing.

## Limits

Read these before quoting a figure.

- These are **platform commission rates only**. They exclude payment fees,
  Voucher Xtra, shipping, and quarterly support programmes.
- A given shop's effective rate can differ if it is enrolled in a TikTok
  programme of its own.
- The Mall tier moved on a later date (3 August 2026) than the standard tier
  (3 July 2026). Compare like with like.

## Explore it

- **English**: https://ordinex.cc/en/tools/tiktok-shop-fees
- **Tiếng Việt**: https://ordinex.cc/tools/phi-tiktok-shop

Both let you search a category and see its old rate, new rate, and delta, plus
the distribution of changes across the catalogue.

## Licence and citation

Released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Use it
in an article, a report, or your own product. The only condition is attribution.

```
Ordinex (2026). TikTok Shop Vietnam commission rates by category,
effective-dated. 1,808 categories compared. CC BY 4.0.
https://ordinex.cc/en/tools/tiktok-shop-fees
```

## Corrections

If a rate here does not match the schedule you are holding, open an issue with
the category and the source PDF date. The record is only worth keeping if it is
right.

---

Maintained by [Ordinex](https://ordinex.cc), sourcing and landed-cost tooling for
Vietnamese cross-border e-commerce operators.
