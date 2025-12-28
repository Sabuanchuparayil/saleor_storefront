# Quick Start - Using the Click & Collect Components

## ✅ Package Ready

The frontend package is now available at: `src/pickup-service/`

## 🚀 Quick Integration (3 Steps)

### Step 1: Import Components

```tsx
import {
	ClickCollectToggle,
	PickupModeModal,
	usePickupMode,
	PickupServiceClient,
} from "./src/pickup-service";
```

### Step 2: Initialize Service

```tsx
const pickupService = new PickupServiceClient({
	baseUrl: "https://pickup-service-production.up.railway.app",
	channelSlug: "default-channel",
});
```

### Step 3: Add to Your Component

```tsx
function MyHeader() {
	const [modalOpen, setModalOpen] = useState(false);
	const { enabled, enablePickupMode, disablePickupMode } = usePickupMode({
		pickupService,
	});

	return (
		<>
			<ClickCollectToggle
				enabled={enabled}
				onToggle={() => (enabled ? disablePickupMode() : setModalOpen(true))}
			/>

			<PickupModeModal
				pickupServiceOptions={{ pickupService }}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</>
	);
}
```

## 📚 Full Documentation

- **README.md** - Complete API reference
- **INTEGRATION_GUIDE.md** - Step-by-step integration
- **examples/** - Working examples

## 🎯 That's It!

You now have:

- ✅ Toggle button component
- ✅ Location capture
- ✅ Warehouse selection
- ✅ Complete modal workflow
- ✅ State management hook
- ✅ API client

Ready to use! 🚀
