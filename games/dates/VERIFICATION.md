# Historical Dates bank - verification pass

This bank was written from memory in five batches and shipped before any of it
was checked. This file records what has since been done about that, and - more
importantly - what has not.

## What this pass is, and what it is not

The World Records pass searched a source for most of its 463 questions
individually. This one did not. It has three parts:

1. **Twelve questions checked against live sources.** Chosen for risk, spread
   across every era and every precision. Listed below with what was found.
2. **Three mechanical checks run across all 367.** These catch classes of error
   rather than individual ones, and they cover the whole bank.
3. **All 367 reviewed one by one against the author's own knowledge.**

Part 3 is the weak one and should be read as such. The bank was written from
that same knowledge, so a fact that was wrong when it went in is wrong again
when it is checked the same way. It catches carelessness, not belief. Anything
here marked as reviewed rather than sourced has had one pair of eyes on it,
twice, and that is all.

The honest summary is: no error has been found, twelve questions are properly
sourced, three whole-bank checks are clean, and the remaining 355 rest on the
author's knowledge being right.

## Why a lighter pass is defensible here

Dates are a much narrower target than records. A record is a superlative, so it
can be beaten, contested, measured differently or held by something adjacent -
which is where all 31 World Records errors came from. A historical date is
usually one documented number that has not moved since it happened.

The residual risks specific to this bank are different, and the mechanical
checks were designed for them:

- **the wrong endpoint** - a war's start given as its formal declaration or its
  first shots, a building's completion given as its dedication
- **the source naming a different event from the answer** - which is exactly
  how the World Records eclipse error survived a whole verification pass
- **precision claimed more tightly than the sources support**

## 1. Checked against a source

dates-teotihuacan-pyramid-of-the-sun | OK-WITH-NOTE | AD 200 is the most-cited completion date and what the Met gives; Britannica says about AD 100. The scholarly range is wider than the century band, so a well-informed player answering 100 lands in Close rather than Bullseye through no fault of their own. Kept at 200 because that is the standard figure and century is already the loosest precision available.
dates-first-mri-human-scan | OK | 3 July 1977, Damadian's "Indomitable", first human scan took nearly five hours - which is what the hint says
dates-trans-siberian-completed | OK | 1916; the Khabarovsk bridge over the Amur was finished 5 October 1916 and was the last stretch, as the hint says
dates-hagia-sophia-completed | OK | consecrated 27 December 537, five years and ten months after construction began in February 532
dates-taiping-rebellion-begins | OK | the Jintian Uprising was 11 January 1851 and armed clashes began late 1850; both 1850 and 1851 are used, and year precision covers either
dates-hoover-dam-completed | OK | dedicated September 1935 while still unfinished, construction completed 1936; scheduled for 1938, so "two years ahead" in the hint holds
dates-battle-of-tours | OK | October 732; the 733 dating is described by historians as an error from unfamiliarity with the sources
dates-pasteurisation-patented | OK | patent filed 11 April 1865 for preserving wine; applied to wine and beer well before milk, as the hint says
dates-wimbledon-first-championship | OK | opened 9 July 1877
dates-berlin-conference | OK | opened 15 November 1884, concluded February 1885; the question asks when it began
dates-handel-messiah-premiere | OK | Dublin, 13 April 1742, Music Hall in Fishamble Street
dates-first-jet-airliner-service | OK | BOAC Comet, London to Johannesburg, 2 May 1952

## 2. Checked mechanically across all 367

**Every source year against its own answer.** Where a source names a year, does
that year fall inside the question's own Bullseye band? Four were flagged and
all four are legitimate - a later document about an earlier event:

  dates-jenner-vaccination      | 1796 inoculation, sourced to Jenner's 1798 book
  dates-little-bighorn          | 1876 battle, sourced to the 1879 Army inquiry
  dates-norse-reach-north-america | c.1000 settlement, dated by a 2021 Nature paper
  dates-greek-independence-war  | 1821 outbreak, sourced to the 1832 treaty that ended it

  This is the check that would have caught the World Records eclipse error,
  where the value belonged to 1955 and the source named 1973. Nothing of that
  shape exists here.

**Every hint against its own answer.** No hint prints the year it is a hint
for, and none names a year more than 300 years from its answer. Zero flagged.

**Prompt wording against scoring precision.** A prompt that says "around what
year" must be scored loosely, and one that asks for an exact year must not be.
One mismatch, in the generous direction:

  dates-rome-founded-traditional | asks for the traditional year exactly but is
  scored to the decade. Left alone: the tradition is exact, the underlying
  history is not, and the error favours the player.

**Plus everything questions.test.js already enforced**, on every commit: every
date is real, every day-precision date is 1753 or later, no prompt contains its
own answer, no two questions are near-duplicates, the precision matches which
answer field is present, and the engine scores every stated answer as a
Bullseye.

## 3. Reviewed but not independently sourced

The remaining 355. Each was read against its answer, its precision, its hint
and its source, and the bank's own rules applied - nothing dated "c." in its
sources asked to the year, nothing Julian asked to the day, no prompt claiming
a title somebody could argue for.

No correction came out of it. That is a weaker result than it sounds, for the
reason given at the top.

## What would make this a real pass

Searching a source for each of the remaining 355, the way World Records was
done. Roughly a third are famous enough that the risk is negligible - the Moon
landing, Waterloo, Pearl Harbor - so the useful target is the other two thirds:
the less famous, the ones with a fuzzy start or end, and the cultural works
where publication, writing and first performance are three different years.
