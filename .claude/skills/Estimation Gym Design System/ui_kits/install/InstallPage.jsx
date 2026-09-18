/* The install page at estimationgym.app/install, restyled. Copy is verbatim
   from install/index.html; the platform sections are all shown at once, the way
   the source does before platform.js narrows them. */
function InstallPage() {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const { Wordmark, Button, Chip, Eyebrow, Callout, Icon, BandTag, FootNote, Brandmark } = NS;

  const Step = ({ children }) => (
    <li style={{ margin: 'var(--space-2) 0', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>{children}</li>
  );
  const Kbd = ({ children }) => (
    <kbd style={{
      background: 'color-mix(in srgb, var(--text-body) 10%, transparent)',
      border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)',
      padding: '0.05rem 0.35rem', font: 'inherit', fontFamily: 'var(--font-mono)',
      fontSize: '0.85em', whiteSpace: 'nowrap'
    }}>{children}</kbd>
  );
  const Platform = ({ icon, title, children, warn }) => (
    <section style={{ marginTop: 'var(--space-11)' }}>
      <h2 style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        font: 'var(--type-label)', fontSize: 'var(--text-md)', fontFamily: 'var(--font-display)',
        color: 'var(--text-display)'
      }}>
        <Icon name={icon} size={16} color="var(--accent)" />{title}
      </h2>
      <div style={{
        marginTop: 'var(--space-4)', padding: 'var(--space-7) var(--space-8)',
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <ol style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-body)' }}>{children}</ol>
        {warn && <Callout>{warn}</Callout>}
      </div>
    </section>
  );

  return (
    <main style={{ maxWidth: 'var(--prose-max)', margin: '0 auto', padding: 'var(--space-12) var(--app-pad) var(--space-16)' }}>
      <div style={{ textAlign: 'center' }}>
        <Wordmark size="lg" align="center" />
        <p style={{
          margin: 'var(--space-6) auto 0', maxWidth: '26rem',
          font: 'var(--type-body)', fontSize: 'var(--text-md)', color: 'var(--text-secondary)'
        }}>
          One question a day, the same one for everyone. You do not have to be right —{' '}
          <strong style={{ color: 'var(--text-display)' }}>you have to be roughly right.</strong>
        </p>
        <Button variant="solid" size="lg" as="a" href="../app/index.html" block style={{ marginTop: 'var(--space-10)' }}>Play now</Button>
        <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          Takes about a minute. Nothing from an app store.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-7)' }}>
          {['Free', 'No account', 'Works offline', 'No ads', 'Open source'].map((c) => <Chip key={c}>{c}</Chip>)}
        </div>
      </div>

      <Platform icon="target" title="On iPhone or iPad" warn={<>It has to be Safari. Chrome and Firefox on iPhone cannot add apps to the home screen — that is an Apple restriction, not a fault in the game.</>}>
        <Step>Open this page in <strong>Safari</strong>.</Step>
        <Step>Tap <strong>Play now</strong> above.</Step>
        <Step>Tap the <strong>Share</strong> button — the square with an arrow pointing up, <Kbd>□↑</Kbd>.</Step>
        <Step>Scroll down and tap <strong>Add to Home Screen</strong>.</Step>
        <Step>Tap <strong>Add</strong>.</Step>
      </Platform>

      <Platform icon="plus" title="On Android" warn={<>Chrome may offer to install it by itself, in a bar along the bottom. Taking that offer does the same thing.</>}>
        <Step>Open this page in <strong>Chrome</strong>.</Step>
        <Step>Tap <strong>Play now</strong> above.</Step>
        <Step>Tap the <Kbd>⋮</Kbd> menu, top right.</Step>
        <Step>Tap <strong>Install app</strong>, or <strong>Add to Home screen</strong> if that is what yours says.</Step>
      </Platform>

      <Platform icon="rocket" title="On a computer">
        <Step>Just tap <strong>Play now</strong> — it works in the browser.</Step>
        <Step>In Chrome or Edge you can also click the <strong>install icon</strong> in the address bar to keep it in its own window.</Step>
      </Platform>

      <Eyebrow style={{ marginTop: 'var(--space-12)', marginBottom: 'var(--space-4)' }}>what you are installing</Eyebrow>
      <div style={{
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)'
      }}>
        <p style={{ font: 'var(--type-prompt)', fontSize: 'var(--text-md)', fontFamily: 'var(--font-display)', color: 'var(--text-display)' }}>
          How many jellybeans fit in a one-litre jar?
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <div style={{
            flex: 1, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
            padding: '0.55rem 0.65rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)', background: 'var(--surface-sunken)'
          }}>Guess (jellybeans)</div>
          <Button size="sm">Go</Button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
          <BandTag band="Bullseye" size="sm" /><BandTag band="Close" size="sm" />
          <BandTag band="Ballpark" size="sm" /><BandTag band="Off" size="sm" />
        </div>
        <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>
          An example — not one of the real questions.
        </p>
      </div>

      <Eyebrow style={{ marginTop: 'var(--space-12)', marginBottom: 'var(--space-4)' }}>see it first</Eyebrow>
      <figure style={{ margin: 0, textAlign: 'center' }}>
        <img
          src="../../assets/brand/tour-poster.png" alt="A short tour of Estimation Gym"
          style={{ width: '100%', maxWidth: 270, borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-default)', background: '#000' }}
        />
        <figcaption style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          Fifty seconds, if you would rather see it than read about it.
        </figcaption>
      </figure>

      <a href="https://youtu.be/3xvcWVqtHKY" target="_blank" rel="noopener noreferrer" style={{
        display: 'flex', gap: 'var(--space-6)', alignItems: 'center', marginTop: 'var(--space-7)',
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-6) var(--space-7)',
        textDecoration: 'none', color: 'inherit'
      }}>
        <span style={{
          width: 34, height: 34, borderRadius: 'var(--radius-md)', flex: '0 0 auto',
          display: 'grid', placeItems: 'center', background: 'var(--status-urgent)', color: '#fff'
        }}>▶</span>
        <span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--text-display)' }}>Seven-minute walkthrough</span>
          <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>On YouTube — why powers of ten make a better puzzle</span>
        </span>
      </a>

      <section style={{ marginTop: 'var(--space-14)', color: 'var(--text-secondary)' }}>
        <h2 style={{ font: 'var(--type-label)', fontSize: 'var(--text-md)', fontFamily: 'var(--font-display)', color: 'var(--text-display)' }}>
          Why bother installing?
        </h2>
        <p style={{ marginTop: 'var(--space-5)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>
          It opens like a normal app, with no browser bars, and it <strong style={{ color: 'var(--text-display)' }}>works offline</strong> —
          the questions travel with it, so it plays on a plane or underground.
        </p>
        <p style={{ marginTop: 'var(--space-5)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>
          Your streak and history stay on your own device. There is no account and no sign-up, and nothing about how
          you play leaves your phone.
        </p>
      </section>

      <div style={{ marginTop: 'var(--space-14)', paddingTop: 'var(--space-7)', borderTop: '1px solid var(--border-default)', textAlign: 'center' }}>
        <Brandmark size={22} tone="mono" style={{ color: 'var(--text-faint)' }} />
        <FootNote align="center" style={{ marginTop: 'var(--space-3)' }}>
          <a href="https://github.com/SidathPeiris/estimation-gym-app">Source</a> · AGPL-3.0
        </FootNote>
      </div>
    </main>
  );
}
window.InstallPage = InstallPage;
