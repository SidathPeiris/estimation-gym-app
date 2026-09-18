The one header the app has, and the bell inside it.

```jsx
<AppHeader date="Tue 16 Sep" streak={6} best={14} reminderOn onReminder={toggle} onMenu={openSettings} />
<ReminderToggle on={false} onClick={subscribe} />
```

The header never scrolls away and never grows a nav bar — the app is one column. The bell is the only thing in it that touches the network, so it stays quiet until subscribed.
