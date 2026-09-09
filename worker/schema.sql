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
