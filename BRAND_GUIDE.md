# Simple Tools - Brand Style Guide

## 🎨 Color Palette

### Primary Colors

**Light Mode:**
```css
--primary: #2563EB    /* Professional Blue */
--secondary: #7C3AED  /* Premium Purple */
--accent: #059669     /* Success Green */
--background: #FAFBFC /* Clean Off-White */
--surface: #FFFFFF    /* Pure White */
--border: #E5E7EB     /* Subtle Gray */
--muted: #6B7280      /* Text Muted */
```

**Dark Mode:**
```css
--primary: #3B82F6    /* Bright Blue */
--secondary: #8B5CF6  /* Vibrant Purple */
--accent: #06B6D4     /* Cyan Blue */
--background: #0F1419 /* Deep Dark */
--surface: #1E293B    /* Dark Surface */
--border: #334155     /* Dark Border */
--muted: #94A3B8      /* Dark Muted */
```

### Status Colors
```css
--success: #10B981 / #22C55E
--warning: #F59E0B / #F97316
--error: #EF4444 / #F87171
```

## 🎯 Color Psychology

- **Blue (Primary):** Trust, reliability, professionalism
- **Purple (Secondary):** Premium, creativity, innovation
- **Green (Accent):** Success, growth, positive action

## ✨ Premium Effects

### Gradients
```css
.gradient-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}

.gradient-accent {
  background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
}
```

### Shadows
```css
.shadow-premium {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-premium-lg {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Glass Morphism
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 🎬 Animations

### Floating Elements
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

### Hover Effects
```css
.hover-lift:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
}
```

### Button Shimmer
```css
.btn-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-premium:hover::before {
  left: 100%;
}
```

## 📝 Typography

### Font Stack
```css
--font-sans: system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
--font-mono: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

### Hierarchy
- **H1:** 4xl-6xl, font-extrabold, gradient text
- **H2:** 2xl, font-bold, with icon
- **Body:** base, font-medium
- **Muted:** sm, text-muted

## 🎨 Component Patterns

### Tool Cards
- Rounded corners (xl)
- Premium shadows
- Hover lift effect
- Subtle indicators
- Call-to-action on hover

### Navigation
- Glass surface
- Gradient accents
- Smooth transitions
- Active state indicators

### Buttons
- Primary: Gradient background
- Secondary: Border with fill on hover
- Premium shimmer effects
- Focus states with glow

## 🚀 Usage Guidelines

### Do's
✅ Use consistent spacing (4, 6, 8, 12px)
✅ Apply hover states to interactive elements
✅ Use gradients for primary actions
✅ Maintain color contrast ratios
✅ Add subtle animations for delight

### Don'ts
❌ Mix different shadow styles
❌ Use colors outside the palette
❌ Overuse animations
❌ Ignore accessibility
❌ Break the visual hierarchy

## 📱 Responsive Design

- **Mobile:** Simplified layouts, larger touch targets
- **Tablet:** Balanced grid systems
- **Desktop:** Full feature layouts with hover states

This brand system creates a premium, trustworthy, and modern experience that positions Simple Tools as a professional-grade application.