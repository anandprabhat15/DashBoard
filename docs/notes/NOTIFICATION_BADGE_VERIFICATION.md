# Notification Badge Verification

## Question: Is the "2" beside notifications hardcoded or from API?

## Answer: 100% FROM API ✅

### Code Location:

`DashBoard/src/components/Sidebar.jsx` (lines 8-28)

### How It Works:

```javascript
const [notificationCount, setNotificationCount] = useState(0);

useEffect(() => {
  Promise.all([
    getUserInfo(),
    getNotifications(), // ← Fetches from /notifications API
  ]).then(([userRes, notifRes]) => {
    if (notifRes.data && notifRes.data.notifications) {
      // Count the number of notifications from API
      setNotificationCount(Object.keys(notifRes.data.notifications).length);
    }
  });
}, []);
```

### API Response:

```json
{
  "status": 200,
  "notifications": {
    "n_1": { ... },  ← Notification 1
    "n_2": { ... }   ← Notification 2
  }
}
```

### Calculation:

```javascript
Object.keys(notifRes.data.notifications).length;
// Returns: 2 (because there are 2 keys: "n_1" and "n_2")
```

### Display:

```javascript
{ name: 'Notifications', icon: '🔔', badge: notificationCount }
// badge: 2 (from API)
```

## Verification:

✅ **NOT hardcoded**
✅ **Fetched from `/notifications` API endpoint**
✅ **Counts actual notification objects in API response**
✅ **Updates dynamically if API changes**

## Test:

If you add more notifications to the API (n_3, n_4, etc.), the badge will automatically show the correct count (3, 4, etc.).

If you remove notifications from the API, the badge will decrease accordingly.

## Conclusion:

The notification badge "2" is **100% from the API**, not hardcoded.
