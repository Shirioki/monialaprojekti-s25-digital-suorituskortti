# UI Preview - Work Card Creation Form

## Visual Layout

The work card creation form follows the existing app design with a clean, card-based layout.

### Screen Structure

```
┌──────────────────────────────────────┐
│  [×]   Luo suorituskortti   Tallenna │  ← Header
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Lisää Otsikko                  │ │
│  │ ┌────────────────────────────┐ │ │
│  │ │ Syötä otsikko...           │ │ │
│  │ └────────────────────────────┘ │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Kipsiblokki nro                │ │
│  │ ┌────────────────────────────┐ │ │
│  │ │ Syötä kipsiblokki numero...│ │ │
│  │ └────────────────────────────┘ │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Hammas A                       │ │
│  │ Ylä- vai alavisuri             │ │
│  │ ┌────────────────────────────┐ │ │
│  │ │ Valitse...            [▼]  │ │ │
│  │ │ • Ylävisuri                │ │ │
│  │ │ • Alavisuri                │ │ │
│  │ └────────────────────────────┘ │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Kariesvaihtoehto               │ │
│  │ ┌──────────────────────────┐   │ │
│  │ │ ☐ Ei kariesta (intakti)  │   │ │
│  │ ├──────────────────────────┤   │ │
│  │ │ ☐ Kariesta vain kiilteessä│  │ │
│  │ ├──────────────────────────┤   │ │
│  │ │ ☐ Karies dentiiniin asti │   │ │
│  │ └──────────────────────────┘   │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ ℹ️  Huomio                      │ │
│  │ Täytä kaikki kentät ja valitse │ │
│  │ vähintään yksi kariesvaihtoehto│ │
│  │ luodaksesi suorituskortin.     │ │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

## Component Breakdown

### 1. Header (White background, #fff)
- **Left**: Close icon (X) - triggers cancel confirmation
- **Center**: "Luo suorituskortti" title (20px, bold)
- **Right**: "Tallenna" text button (blue #007AFF)

### 2. Title Section (White card)
```
┌────────────────────────────────┐
│ Lisää Otsikko                  │  ← 18px, bold
│ ┌────────────────────────────┐ │
│ │ Syötä otsikko...           │ │  ← Text input (light gray bg)
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### 3. Gypsum Block Number Section (White card)
```
┌────────────────────────────────┐
│ Kipsiblokki nro                │  ← 18px, bold
│ ┌────────────────────────────┐ │
│ │ Syötä kipsiblokki numero...│ │  ← Numeric input
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### 4. Jaw Selection Section (White card with picker)
```
┌────────────────────────────────┐
│ Hammas A                       │  ← 18px, bold
│ Ylä- vai alavisuri             │  ← 14px, gray subtitle
│ ┌────────────────────────────┐ │
│ │ Valitse...            [▼]  │ │  ← Native picker
│ └────────────────────────────┘ │
│                                │
│ When expanded:                 │
│ ┌────────────────────────────┐ │
│ │ Valitse...                 │ │
│ │ Ylävisuri              ✓   │ │
│ │ Alavisuri                  │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### 5. Cavity Conditions Section (White card with checkboxes)
```
┌────────────────────────────────┐
│ Kariesvaihtoehto               │  ← 18px, bold
│                                │
│ ┌─┐ Ei kariesta (intakti)      │  ← Custom checkbox
│ │ │                            │     (24x24, blue border)
│ └─┘                            │
│ ─────────────────────────────  │  ← Light separator
│ ┌─┐ Kariesta vain kiilteessä   │
│ │ │                            │
│ └─┘                            │
│ ─────────────────────────────  │
│ ┌─┐ Karies dentiiniin asti     │
│ │✓│                            │  ← Checked state
│ └─┘                            │     (blue checkmark)
└────────────────────────────────┘
```

### 6. Info Card (Light blue background)
```
┌────────────────────────────────┐
│ ℹ️  Huomio                      │  ← Info icon + title
│                                │     (blue #1565C0)
│ Täytä kaikki kentät ja valitse │  ← Helpful message
│ vähintään yksi kariesvaihtoehto│     (dark blue text)
│ luodaksesi suorituskortin.     │
└────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Primary Blue**: #007AFF (buttons, accents, checkboxes)
- **Background**: #f5f5f5 (screen background)
- **Card White**: #fff (card backgrounds)
- **Text Dark**: #333 (primary text)
- **Text Gray**: #666 (secondary text)
- **Border Gray**: #ddd (borders and separators)
- **Input Background**: #f9f9f9 (light gray for inputs)

### Info Card Colors
- **Background**: #E3F2FD (light blue)
- **Title**: #1565C0 (medium blue)
- **Text**: #1976D2 (blue)

## Interactive States

### Checkbox States
```
Unchecked:        Checked:
┌─┐               ┌─┐
│ │               │✓│
└─┘               └─┘
```

### Button States
```
Primary Button:   Secondary Button:
┌─────────────┐   ┌─────────────┐
│ Black bg    │   │ White bg    │
│ White text  │   │ Blue border │
└─────────────┘   │ Blue text   │
                  └─────────────┘
```

## Validation Messages

### Error Alerts (Red)
```
┌─────────────────────────────┐
│  Virhe                      │
│                             │
│  Lisää otsikko              │
│                             │
│        [ OK ]               │
└─────────────────────────────┘
```

### Success Alert (Green)
```
┌─────────────────────────────┐
│  Onnistui!                  │
│                             │
│  Suorituskortti luotu       │
│  onnistuneesti              │
│                             │
│        [ OK ]               │
└─────────────────────────────┘
```

### Cancel Confirmation
```
┌─────────────────────────────┐
│  Peruuta                    │
│                             │
│  Haluatko varmasti peruuttaa?│
│  Tallentamattomat muutokset │
│  menetetään.                │
│                             │
│  [ Jatka muokkausta ]       │
│  [ Peruuta ]                │
└─────────────────────────────┘
```

## Navigation Flow

### From Teacher Dashboard
```
Teacher Dashboard
    ↓ (Click "Luo suorituskortti" button)
Work Card Form
    ↓ (Fill form & click "Tallenna")
Success Alert
    ↓ (Click "OK")
Back to Teacher Dashboard
```

### From Admin Dashboard
```
Admin Dashboard → System Tab
    ↓ (Click "Luo suorituskortti" action)
Work Card Form
    ↓ (Fill form & click "Tallenna")
Success Alert
    ↓ (Click "OK")
Back to Admin Dashboard
```

## Responsive Design

- **Minimum Touch Target**: 44x44 points (all buttons and interactive elements)
- **Card Margins**: 16px horizontal spacing
- **Card Padding**: 20px internal padding
- **Input Height**: 50px for comfortable typing
- **Checkbox Size**: 24x24px with 12px margin
- **Font Sizes**: 
  - Title: 20px
  - Section headers: 18px
  - Body text: 16px
  - Subtitles: 14px

## Accessibility Features

✅ Clear labels for all form fields
✅ Touch-friendly tap targets (minimum 44x44 points)
✅ Descriptive placeholders
✅ Error messages are clear and actionable
✅ High contrast colors for readability (#333 text on #fff background)
✅ Info card with helpful guidance
✅ Confirmation dialogs prevent accidental actions

## Animation & Feedback

- **Input Focus**: Blue border highlight (#007AFF)
- **Button Press**: Slight opacity change (0.7)
- **Checkbox Toggle**: Instant visual feedback with checkmark
- **Picker Selection**: Native platform animation
- **Alert Dialogs**: Smooth slide-in animation
- **Navigation**: Standard push/pop transitions

This UI design ensures consistency with the existing app while providing a clear, intuitive interface for creating work cards!
