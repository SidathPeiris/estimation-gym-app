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
CREATE TABLE IF NOT EXISTS subscriptions (
  endpoint        TEXT    PRIMARY KEY,
  -- Minutes, exactly as Date.getTimezoneOffset() reports: positive west of UTC.
  tz_offset       INTEGER NOT NULL,
  -- Day index this device last answered, so the nudge is skipped once played.
  last_played_day INTEGER,
  created_at      INTEGER NOT NULL
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
