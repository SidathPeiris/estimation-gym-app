-- One row per (question, band). Counts only; nothing identifies a player.
--
-- Keyed on question_id rather than a day number on purpose: growing the bank
-- reshuffles which question falls on which date, so day-keyed history would
-- eventually attach a distribution to the wrong question.
CREATE TABLE IF NOT EXISTS responses (
  question_id TEXT    NOT NULL,
  band        TEXT    NOT NULL,
  tally       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (question_id, band)
);

-- Crude per-IP-per-question guard. Not security - it raises the effort of
-- casually stuffing one question's numbers, nothing more. See README.
CREATE TABLE IF NOT EXISTS seen (
  question_id TEXT    NOT NULL,
  client      TEXT    NOT NULL,
  at          INTEGER NOT NULL,
  PRIMARY KEY (question_id, client)
);

-- Devices that asked to be reminded.
--
-- Deliberately minimal. Payload-less push is used, so the encryption keys a
-- normal subscription carries (p256dh/auth) are not needed and are not stored;
-- the notification text lives in the service worker instead. What is here is
-- the push endpoint, which is what the browser gives out and what the reminder
-- is sent to, and enough to send it at a sensible local hour without nagging
-- someone who has already played.
-- The origin column was added after the fact. On a database that already
-- exists this file will not add it, because CREATE TABLE IF NOT EXISTS leaves
-- an existing table alone - that was a one-off:
--   wrangler d1 execute estimation-gym --remote --config wrangler.toml
--     --command "ALTER TABLE subscriptions ADD COLUMN origin TEXT"
-- Rows predating it have origin NULL, which means "subscribed before anyone
-- was counting", not "unknown address".
CREATE TABLE IF NOT EXISTS subscriptions (
  endpoint        TEXT    PRIMARY KEY,
  -- Minutes, exactly as Date.getTimezoneOffset() reports: positive west of UTC.
  tz_offset       INTEGER NOT NULL,
  -- Day index this device last answered, so the nudge is skipped once played.
  last_played_day INTEGER,
  created_at      INTEGER NOT NULL,
  -- Which address it was set up from. One of the origins the Worker allows,
  -- or NULL for a row that predates the column.
  origin          TEXT
);

-- Questions people have suggested from inside the app.
--
-- Nothing here is ever served to a player. A row lands as 'pending' and stays
-- that way until it is reviewed and appended to the bank by hand, which is the
-- only path into the game. The bank carries the answers, so an unchecked
-- question is worse than no question: it would mark a correct guess as wrong.
--
-- The text is written by strangers. It is validated at the endpoint - length
-- capped, angle brackets and control characters refused - but it is still
-- untrusted input and should be read as data, never pasted anywhere that
-- executes it.
CREATE TABLE IF NOT EXISTS suggestions (
  id      TEXT    PRIMARY KEY,   -- random, so a row is not guessable
  prompt  TEXT    NOT NULL,
  unit    TEXT    NOT NULL,
  answer  REAL    NOT NULL,      -- the submitter's claim, not a verified value
  source  TEXT    NOT NULL,
  note    TEXT,                  -- optional: how they would decompose it
  status  TEXT    NOT NULL DEFAULT 'pending',  -- pending | accepted | rejected
  -- Hashed address, for rate limiting only. Never a bare IP, the same
  -- treatment the response counter gives it.
  client  TEXT    NOT NULL,
  at      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS suggestions_status ON suggestions (status, at);
CREATE INDEX IF NOT EXISTS suggestions_client ON suggestions (client, at);

-- People who owned up to looking the answer up.
--
-- The answers ship with the app so it can play offline, which means anyone
-- willing to open the source can read them - that is inherent, not a hole to
-- be plugged. Rather than pretend otherwise, an exact-to-the-digit guess gets
-- asked, in fun, whether they peeked, and the honest answers are counted here.
--
-- One row per person per question, so the primary key does the deduplicating.
-- The client is the same hashed address used everywhere else, never a bare IP.
CREATE TABLE IF NOT EXISTS confessions (
  question_id TEXT    NOT NULL,
  client      TEXT    NOT NULL,
  at          INTEGER NOT NULL,
  PRIMARY KEY (question_id, client)
);

-- How far off people were, in whole decades.
--
-- The bands alone cannot answer the question that matters: "Off" covers
-- everything past 100x, so it lumps a respectable 2.5 decades in with someone
-- who typed 5 meaning five billion. Those need different responses - one is a
-- hard question working as intended, the other is an input problem wearing a
-- difficulty costume.
--
-- Stored as the floor of the decade distance, capped, so it is coarser than
-- the guess and carries no more about a person than the band already did.
CREATE TABLE IF NOT EXISTS decade_errors (
  question_id TEXT    NOT NULL,
  decade      INTEGER NOT NULL,   -- 0 = within 10x, 1 = within 100x, ... 20 = capped
  tally       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (question_id, decade)
);

-- How many people played each day, split by which address they played on.
--
-- Added while the app runs at two addresses at once. Nothing else here
-- records where a request came from - the tables are deliberately about
-- questions, not about people or places - so there was no way to tell
-- whether anyone was still on the old address, and therefore no way to know
-- when it is safe to retire it. That is the only question this answers.
--
-- It carries no more than the tables beside it: a counter, a date, and one of
-- a fixed set of addresses. The origin is written only if it is one the
-- Worker already allows, and anything else is filed as 'other', so a caller
-- cannot put a string of their choosing into this table.
--
-- The day is the server's UTC day on the same epoch the app counts from
-- (day 0 = 2024-01-01). A player's own calendar date can differ by one
-- either side of UTC midnight, which is close enough to answer "is anyone
-- still over there" and not close enough to time anybody's evening.
CREATE TABLE IF NOT EXISTS origin_days (
  day    INTEGER NOT NULL,
  origin TEXT    NOT NULL,
  tally  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, origin)
);
