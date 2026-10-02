**English** · [Tiếng Việt](README.vi.md)

# TikTok Shop Vietnam: commission rates by category, effective-dated

An open dataset by [Ordinex](https://ordinex.cc): TikTok Shop Vietnam's seller
commission schedules, kept edition by edition and compared category by category.

TikTok publishes each schedule as a PDF and replaces it in place. Nobody keeps
the old one, so once a schedule changes there is no public record of what the
rate used to be, which makes it impossible to say how much any category actually
moved. This repository is that record.

## What changed

Between the schedule effective **9 May 2026** and the one effective
**3 July 2026** (standard shops; **3 August 2026** for Mall shops):

| | Categories |
|---|---:|
| Comparable across both versions | **1,824** |
| Commission **increased** | **1,366** |
| Commission **cut** | **404** |
| Unchanged | **54** |

The largest single increase is **Máy đọc sách điện tử** (e-readers), from
**2% to 10.5%**, a rise of 8.5 percentage points.

The widely repeated line is that TikTok Shop "raised its fees". That is true of
most categories, but **404 categories were cut**, and that side of the change
went essentially unreported.

## Latest change: 20 October 2026

TikTok Shop's schedule effective **20 October 2026** changes only the Mall tier:
**41 categories** under *Sách, tạp chí & âm thanh* (books, magazines and audio)
move to **12.5%**, 40 of them from 15% and one from 16%. Standard-shop rates are
the ones in force since 3 July 2026. Every other category keeps its rate.

The full schedule is in `data/schedule-2026-10-20.json`, and the diff CSV
carries the new Mall rate in `mall_pct_latest`.

## Files

| Path | What it is |
|---|---|
| `data/tiktok-shop-vn-commission-diff.csv` | The diff. One row per comparable category, old and new rate for both tiers, the delta, and the Mall rate in the newest schedule. |
| `data/schedule-2026-05-09.json` | The schedule effective 9 May 2026, as extracted. |
| `data/schedule-2026-07-03.json` | The schedule effective 3 July 2026 (Mall 3 August 2026), as extracted. |
| `data/schedule-2026-10-20.json` | The schedule effective 20 October 2026 for Mall shops, as extracted. |
| `method/commission-diff.ts` | The comparison code that produced the CSV. |
| `method/commission-matrix.ts` | Type definitions for the schedule JSON. |
| `CITATION.cff` | Citation metadata. |

CSV columns: `group`, `level_1`, `level_2`, `level_3`, `standard_pct_old`,
`standard_pct_new`, `standard_delta`, `mall_pct_old`, `mall_pct_new`,
`mall_delta`, `mall_pct_latest`. The last one is the Mall rate in the newest
schedule here (currently 20 October 2026); it equals `mall_pct_new` except for
the 41 categories above.

Category names are kept **in Vietnamese, exactly as TikTok publishes them**.
They are the join key back to the official schedule; translating them would make
the data impossible to reconcile against the source, which would defeat the
point of publishing it.

## Method

Every schedule was extracted from TikTok Shop Vietnam's own PDFs and compared
with a script. No row was retyped by hand.

Categories are matched on all four levels (`group / level_1 / level_2 /
level_3`). Only categories present in **both** versions are compared: **215
categories appeared** and **82 disappeared** between the May and July
schedules, and those have no delta to report, so they are excluded from the
1,824.

The comparison code is in this repository, under [`method/`](method), the same
pure functions that produced the CSV, so the result is reproducible rather than
merely asserted.

Two details worth knowing if you diff these schedules yourself:

- Category names are transcribed from PDFs whose casing drifts between
  editions. The May schedule writes `Mẹ & bé` where the July one writes
  `Mẹ & Bé`. Matching literally silently drops all 199 categories in that
  group, so the key folds case and collapses runs of whitespace before
  comparing.
- The PDFs' text layer is not always clean Unicode. "Đồ uống" came out with
  detached tone marks, and "Pin sạc dự phòng" (power banks) with a Cyrillic
  letter in place of the Latin "s". Both look right on screen but break search
  and matching. The names here are normalised to NFC and checked against the
  Vietnamese alphabet. The October 2026 update fixed 17 names in the May
  schedule and 15 in the July one, which let 16 categories match across the
  two again: that is why the comparable count rose from 1,808 to 1,824.

## Limits

Read these before quoting a figure.

- These are **platform commission rates only**. They exclude the transaction
  fee (6%, or 5% for shops with enough GMV Max spend), the order processing
  fee, Voucher Xtra, shipping and support programmes.
- A given shop's effective rate can differ if it is enrolled in a TikTok
  programme of its own.
- The Mall tier moved on later dates (3 August and 20 October 2026) than the
  standard tier (3 July 2026). Compare like with like.

## Explore it

- **English**: https://ordinex.cc/en/tools/tiktok-shop-fees
- **Tiếng Việt**: https://ordinex.cc/tools/phi-tiktok-shop

Both let you search a category and see its old rate, new rate, and delta, plus
the distribution of changes across the catalogue and a dated list of every
TikTok Shop Vietnam fee change, each linked to TikTok's own page.

## Licence and citation

Released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Use it
in an article, a report, or your own product. The only condition is attribution.

```
Ordinex (2026). TikTok Shop Vietnam commission rates by category,
effective-dated. 1,824 categories compared. CC BY 4.0.
https://ordinex.cc/en/tools/tiktok-shop-fees
```

`CITATION.cff` carries the same details for reference managers and GitHub's
"Cite this repository" button.

## Corrections

If a rate here does not match the schedule you are holding, open an issue with
the category and the source PDF date. The record is only worth keeping if it is
right.

---

Maintained by [Ordinex](https://ordinex.cc), net profit tracking for TikTok Shop
sellers in Vietnam.
