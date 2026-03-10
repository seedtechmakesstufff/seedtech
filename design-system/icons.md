# Icons

Icons are provided by **lucide-react** (`lucide-react` package).

## Usage

```tsx
import { Shield, Globe, BarChart3 } from "lucide-react"

<Shield className="w-5 h-5" />
```

## Standard Sizes

| Size class | px  | Usage                        |
| ---------- | --- | ---------------------------- |
| `w-4 h-4`  | 16px | Button icons, inline         |
| `w-5 h-5`  | 20px | Nav icons, list items        |
| `w-6 h-6`  | 24px | Card icons (sm IconBox)      |
| `w-8 h-8`  | 32px | Card icons (md IconBox)      |

## IconBox Component

Wrap icons in `<IconBox>` for styled containers:

```tsx
import { IconBox } from "@/components/kit"
import { Shield } from "lucide-react"

<IconBox variant="gradient" icon={Shield} size="lg" />
```

| Variant      | Appearance                              |
| ------------ | --------------------------------------- |
| `gradient`   | Seed gradient background (default)      |
| `soft-dark`  | Muted green tint on dark surface        |
| `soft-light` | Muted green tint on light surface       |
| `outline`    | Border only, transparent background     |

| Size | Icon size | Box size  |
| ---- | --------- | --------- |
| `sm` | w-4 h-4   | p-2       |
| `md` | w-5 h-5   | p-2.5     |
| `lg` | w-6 h-6   | p-3       |
| `xl` | w-8 h-8   | p-4       |

## Common Icons by Section

| Section         | Icons                                     |
| --------------- | ----------------------------------------- |
| IT Support      | `Shield`, `Server`, `Wifi`, `Lock`        |
| Web Dev         | `Globe`, `Code`, `Layout`, `Zap`          |
| Marketing       | `BarChart3`, `TrendingUp`, `Mail`, `Megaphone` |
| Contact / UI    | `Mail`, `Phone`, `MapPin`, `ArrowRight`   |
| Social          | `Github`, `Linkedin`, `Twitter`           |
