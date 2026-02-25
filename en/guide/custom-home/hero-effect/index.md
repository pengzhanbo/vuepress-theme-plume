---
url: /en/guide/custom-home/hero-effect/index.md
---
## Overview

For most websites, a **visually stunning** homepage hero section can more easily attract users to stay.
However, achieving **visual appeal** often requires complex technical effort and a touch of creative inspiration.

The theme comes with a series of **visually impressive** background effects built into the **Hero** section of the **homepage**,
which can be easily applied to your site through simple configuration:

```md {6,8-10}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: tint-plate
    effectConfig:
      key: value
---
```

::: important Only when `type: hero` is set will the theme apply the effect specified in `effect`.
:::

The `effect` property supports the following values:

* [tint-plate](#tint-plate)
* [prism](#prism)
* [pixel-blast](#pixel-blast)
* [hyper-speed](#hyper-speed)
* [liquid-ether](#liquid-ether)
* [dot-grid](#dot-grid)
* [iridescence](#iridescence)
* [orb](#orb)
* [beams](#beams)
* [lightning](#lightning)
* [dark-veil](#dark-veil)

The `effectConfig` should be configured according to the selected `effect`.
In most cases, you don’t need to configure it—the theme will automatically apply preset configurations.

:::important Note
The built-in effects are based on the excellent open-source project [vue-bits](https://vue-bits.dev/),
whose code has been adapted and integrated into the theme under the MIT license.
:::

## Force Dark Mode

Most background effects perform better in **dark mode**,
so it is recommended to enable [dark mode](../../config/theme.md#appearance) for the best experience.

However, for documentation pages, you may prefer **light mode**. Therefore, the theme provides a `forceDark` option in the `hero` section,
which forces the homepage into **dark mode** without affecting the color mode of other pages.

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    forceDark: true
    effect: lightning
---
```

## Dynamic Background Effects

::: important
Some effects may depend on `three`, `gsap`, or `ogl`. You need to manually install the corresponding dependencies based on the effect you choose.

The theme loads these effects **on-demand**, so there is no need to worry about increasing the final bundle size.
:::

### tint-plate

#### Effect Preview

![tint-plate](/images/hero-effects/tint-plate.png)

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: tint-plate
---
```

#### Configuration

`effectConfig` is used to configure RGB values:

* When configured as a single value, it sets the same value for red, green, and blue channels (range: 0–255). Example: `210`.
* When configured as three values, it sets different values for red, green, and blue channels (range: 0–255). Example: `210,210,210`.
* When configured as `TintPlate`, it allows more flexible control over each color value and its corresponding offset.
* It can also be configured as `{ light: TintPlate, dark: TintPlate }` to use different color values in light mode and dark mode.

```ts
interface TintPlate {
  r: { value: number, offset: number }
  g: { value: number, offset: number }
  b: { value: number, offset: number }
}
```

**Example**：

::: code-tabs

@tab Single value

```md {8,9}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: tint-plate
    effectConfig: 210
---
```

@tab Three values

```md {8,9}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: tint-plate
    effectConfig: 210,210,210
---
```

@tab TintPlate

```md {8-18}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: tint-plate
    effectConfig:
      r:
        value: 210
        offset: 0
      g:
        value: 210
        offset: 0
      b:
        value: 210
        offset: 0
---
```

:::

::: info
To help users easily configure visually appealing and personalized backgrounds,
the theme also provides a [Homepage Hero Tint Plate Configuration Tool](../../../tools/home-hero-tint-plate.md).
You can use this tool for visual configuration and generate configuration content that can be directly copied into your own project.
:::

### prism

#### Effect Preview

![prism](/images/hero-effects/prism.png)

#### Install dependencies

:::npm-to

```sh
npm i ogl
```

:::

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: prism
---
```

#### Configuration

:::: field-group

:::field name="height" type="number" optional default="3.5"
Apex height of the prism (world units)
:::
:::field name="baseWidth" type="number" optional default="5.5"
Total base width across X/Z (world units).
:::
:::field name="animationType" type="'rotate' | 'hover' | '3drotate'" optional default="'rotate'"
Animation mode: shader wobble, pointer hover tilt, or full 3D rotation.
:::
:::field name="glow" type="number" optional default="1"
Glow/bleed intensity multiplier.
:::
:::field name="offset" type="{ x?: number, y?: number }" optional default="{ x: 0, y: 0 }"
Pixel offset within the canvas (x→right, y→down).
:::
:::field name="noise" type="number" optional default="0"
Film-grain noise amount added to final color (0 disables).
:::
:::field name="transparent" type="boolean" optional default="true"
Whether the canvas has an alpha channel (transparent background).
:::
:::field name="scale" type="number" optional default="3.6"
Overall screen-space scale of the prism (bigger = larger).
:::
:::field name="hueShift" type="number" optional default="0"
Hue rotation (radians) applied to final color.
:::
:::field name="colorFrequency" type="number" optional default="1"
Frequency of internal sine bands controlling color variation.
:::
:::field name="hoverStrength" type="number" optional default="2"
Sensitivity of hover tilt (pitch/yaw amplitude).
:::
:::field name="inertia" type="number" optional default="0.05"
Easing factor for hover (0..1, higher = snappier).
:::
:::field name="bloom" type="number" optional default="1"
Extra bloom factor layered on top of glow.
:::
:::field name="suspendWhenOffscreen" type="boolean" optional default="true"
Pause rendering when the element is not in the viewport.
:::
:::field name="timeScale" type="number" optional default="0.5"
Global time multiplier for animations (0=frozen, 1=normal).
:::
::::

**Example**:

```md {8-26}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: prism
    effectConfig:
      height: 3.5,
      baseWidth: 5.5
      animationType: rotate
      glow: 1
      offset:
        x: 0
        y: 0
      noise: 0
      transparent: true
      scale: 3.6
      hueShift: 0
      colorFrequency: 1
      hoverStrength: 2
      inertia: 0.05
      bloom: 1
      suspendWhenOffscreen: true
      timeScale: 0.5
---
```

### pixel-blast

#### Effect Preview

![pixel-blast](/images/hero-effects/pixel-blast.png)

#### Install dependencies

:::npm-to

```sh
npm i three postprocessing
```

:::

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: pixel-blast
---
```

#### Configuration

::::field-group
:::field name="variant" type="'square' | 'circle' | 'triangle' | 'diamond'" optional default="'square'"
Pixel shape variant
:::
:::field name="pixelSize" type="number" optional default="4"
Base pixel size (auto scaled for DPI).
:::
:::field name="color" type="string" optional default="'#5086a1'"
Pixel color.
:::
:::field name="antialias" type="boolean" optional default="true"
Enable antialiasing.
:::
:::field name="patternScale" type="number" optional default="2"
Noise/pattern scale.
:::
:::field name="patternDensity" type="number" optional default="1"
Pattern density adjustment.
:::
:::field name="liquid" type="boolean" optional default="false"
Enable liquid distortion effect.
:::
:::field name="liquidStrength" type="number" optional default="0.1"
Liquid distortion strength.
:::
:::field name="liquidRadius" type="number" optional default="1"
Liquid touch brush radius scale.
:::
:::field name="liquidWobbleSpeed" type="number" optional default="4.5"
Liquid wobble frequency.
:::
:::field name="pixelSizeJitter" type="number" optional default="0"
Random jitter applied to coverage.
:::
:::field name="enableRipples" type="boolean" optional default="true"
Enable click ripple waves.
:::
:::field name="rippleIntensityScale" type="number" optional default="1"
Ripple intensity multiplier.
:::
:::field name="rippleThickness" type="number" optional default="0.1"
Ripple ring thickness.
:::
:::field name="rippleSpeed" type="number" optional default="0.3"
Ripple propagation speed.
:::
:::field name="autoPauseOffscreen" type="boolean" optional default="true"
Enable auto-pausing when offscreen.
:::
:::field name="speed" type="number" optional default="0.5"
Animation time scale.
:::
:::field name="transparent" type="boolean" optional default="true"
Transparent background.
:::
:::field name="edgeFade" type="number" optional default="0.5"
Edge fade distance (`0-1`).
:::
:::field name="noiseAmount" type="number" optional default="0"
Post noise amount.
:::
:::field name="className" type="string" optional
Container class name
:::
:::field name="style" type="CSSProperties" optional
Container style
:::
:::field name="backgroundImage" type="string" optional
Background image URL
:::
::::

**Example**：

```md {8-29}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: pixel-blast
    effectConfig:
      variant: square
      pixelSize: 4
      color: #5086a1
      antialias: true
      patternScale: 2
      patternDensity: 1
      liquid: false
      liquidStrength: 0.1
      liquidRadius: 1
      pixelSizeJitter: 0
      enableRipples: true
      rippleIntensityScale: 1
      rippleThickness: 0.1
      rippleSpeed: 0.3
      liquidWobbleSpeed: 4.5
      autoPauseOffscreen: true
      speed: 0.5
      transparent: true
      edgeFade: 0.5
      noiseAmount: 0
---
```

### hyper-speed

#### Effect Preview

![hyper-speed](/images/hero-effects/hyper-speed.png)

#### Install dependencies

:::npm-to

```sh
npm i three postprocessing
```

:::

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: hyper-speed
---
```

#### Configuration

```ts
interface ThemeHomeHeroHyperSpeedDistortion {
  uniforms: Record<string, { value: unknown }>
  getDistortion: string
}

interface ThemeHomeHeroHyperSpeedColors {
  roadColor: number
  islandColor: number
  background: number
  shoulderLines: number
  brokenLines: number
  leftCars: number[]
  rightCars: number[]
  sticks: number
}

interface ThemeHomeHeroHyperSpeed {
  distortion?: string | ThemeHomeHeroHyperSpeedDistortion
  length: number
  roadWidth: number
  islandWidth: number
  lanesPerRoad: number
  fov: number
  fovSpeedUp: number
  speedUp: number
  carLightsFade: number
  totalSideLightSticks: number
  lightPairsPerRoadWay: number
  shoulderLinesWidthPercentage: number
  brokenLinesWidthPercentage: number
  brokenLinesLengthPercentage: number
  lightStickWidth: [number, number]
  lightStickHeight: [number, number]
  movingAwaySpeed: [number, number]
  movingCloserSpeed: [number, number]
  carLightsLength: [number, number]
  carLightsRadius: [number, number]
  carWidthPercentage: [number, number]
  carShiftX: [number, number]
  carFloorSeparation: [number, number]
  colors: ThemeHomeHeroHyperSpeedColors
  isHyper?: boolean
}
```

:::warning [vue-bits](https://vue-bits.dev/backgrounds/hyperspeed) does not provide detailed configuration instructions; please use with caution.
:::

You can use the following preset configuration, directly copy it into your markdown file:

:::code-tabs
@tab Cyberpunk

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: hyper-speed
    effectConfig:
      distortion: turbulentDistortion
      length: 400
      roadWidth: 10
      islandWidth: 2
      lanesPerRoad: 3
      fov: 90
      fovSpeedUp: 150
      speedUp: 2
      carLightsFade: 0.4
      totalSideLightSticks: 20
      lightPairsPerRoadWay: 40
      shoulderLinesWidthPercentage: 0.05
      brokenLinesWidthPercentage: 0.1
      brokenLinesLengthPercentage: 0.5
      lightStickWidth: [0.12, 0.5]
      lightStickHeight: [1.3, 1.7]
      movingAwaySpeed: [60, 80]
      movingCloserSpeed: [-120, -160]
      carLightsLength: [12, 80]
      carLightsRadius: [0.05, 0.14]
      carWidthPercentage: [0.3, 0.5]
      carShiftX: [-0.8, 0.8]
      carFloorSeparation: [0, 5]
      colors:
        roadColor: 0x080808
        islandColor: 0x0a0a0a
        background: 0x000000
        shoulderLines: 0x131318
        brokenLines: 0x131318
        leftCars: [0xd856bf, 0x6750a2, 0xc247ac]
        rightCars: [0x03b3c3, 0x0e5ea5, 0x324555]
        sticks: 0x03b3c3
---
```

@tab Akira

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: hyper-speed
    effectConfig:
      distortion: mountainDistortion
      length: 400
      roadWidth: 9
      islandWidth: 2
      lanesPerRoad: 3
      fov: 90
      fovSpeedUp: 150
      speedUp: 2
      carLightsFade: 0.4
      totalSideLightSticks: 50
      lightPairsPerRoadWay: 50
      shoulderLinesWidthPercentage: 0.05
      brokenLinesWidthPercentage: 0.1
      brokenLinesLengthPercentage: 0.5
      lightStickWidth: [0.12, 0.5]
      lightStickHeight: [1.3, 1.7]
      movingAwaySpeed: [60, 80]
      movingCloserSpeed: [-120, -160]
      carLightsLength: [20, 60]
      carLightsRadius: [0.05, 0.14]
      carWidthPercentage: [0.3, 0.5]
      carShiftX: [-0.2, 0.2]
      carFloorSeparation: [0.05, 1]
      colors:
        roadColor: 0x080808
        islandColor: 0x0a0a0a
        background: 0x000000
        shoulderLines: 0x131318
        brokenLines: 0x131318
        leftCars: [0xff102a, 0xeb383e, 0xff102a]
        rightCars: [0xdadafa, 0xbebae3, 0x8f97e4]
        sticks: 0xdadafa
---
```

@tab Golden

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: hyper-speed
    effectConfig:
      distortion: xyDistortion
      length: 400
      roadWidth: 9
      islandWidth: 2
      lanesPerRoad: 3
      fov: 90
      fovSpeedUp: 150
      speedUp: 3
      carLightsFade: 0.4
      totalSideLightSticks: 50
      lightPairsPerRoadWay: 30
      shoulderLinesWidthPercentage: 0.05
      brokenLinesWidthPercentage: 0.1
      brokenLinesLengthPercentage: 0.5
      lightStickWidth: [0.02, 0.05]
      lightStickHeight: [0.3, 0.7]
      movingAwaySpeed: [20, 50]
      movingCloserSpeed: [-150, -230]
      carLightsLength: [20, 80]
      carLightsRadius: [0.03, 0.08]
      carWidthPercentage: [0.1, 0.5]
      carShiftX: [-0.5, 0.5]
      carFloorSeparation: [0, 0.1]
      colors:
        roadColor: 0x080808
        islandColor: 0x0a0a0a
        background: 0x000000
        shoulderLines: 0x131318
        brokenLines: 0x131318,
        leftCars: [0x7d0d1b, 0xa90519, 0xff102a]
        rightCars: [0xf1eece, 0xe6e2b1, 0xdfd98a]
        sticks: 0xf1eece
---
```

@tab Split

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: hyper-speed
    effectConfig:
      distortion: LongRaceDistortion
      length: 400
      roadWidth: 10
      islandWidth: 5
      lanesPerRoad: 2
      fov: 90
      fovSpeedUp: 150
      speedUp: 2
      carLightsFade: 0.4
      totalSideLightSticks: 50
      lightPairsPerRoadWay: 70
      shoulderLinesWidthPercentage: 0.05
      brokenLinesWidthPercentage: 0.1
      brokenLinesLengthPercentage: 0.5
      lightStickWidth: [0.12, 0.5]
      lightStickHeight: [1.3, 1.7]
      movingAwaySpeed: [60, 80]
      movingCloserSpeed: [-120, -160]
      carLightsLength: [20, 60]
      carLightsRadius: [0.05, 0.14]
      carWidthPercentage: [0.3, 0.5]
      carShiftX: [-0.2, 0.2]
      carFloorSeparation: [0.05, 1]
      colors:
        roadColor: 0x080808
        islandColor: 0x0a0a0a
        background: 0x000000
        shoulderLines: 0x131318
        brokenLines: 0x131318
        leftCars: [0xff5f73, 0xe74d60, 0xff102a]
        rightCars: [0xa4e3e6, 0x80d1d4, 0x53c2c6]
        sticks: 0xa4e3e6
---
```

@tab Highway

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: hyper-speed
    effectConfig:
      distortion: turbulentDistortion
      length: 400
      roadWidth: 9
      islandWidth: 2
      lanesPerRoad: 3
      fov: 90
      fovSpeedUp: 150
      speedUp: 2
      carLightsFade: 0.4
      totalSideLightSticks: 50
      lightPairsPerRoadWay: 50
      shoulderLinesWidthPercentage: 0.05
      brokenLinesWidthPercentage: 0.1
      brokenLinesLengthPercentage: 0.5
      lightStickWidth: [0.12, 0.5]
      lightStickHeight: [1.3, 1.7]
      movingAwaySpeed: [60, 80]
      movingCloserSpeed: [-120, -160]
      carLightsLength: [20, 60]
      carLightsRadius: [0.05, 0.14]
      carWidthPercentage: [0.3, 0.5]
      carShiftX: [-0.2, 0.2]
      carFloorSeparation: [0.05, 1]
      colors:
        roadColor: 0x080808
        islandColor: 0x0a0a0a
        background: 0x000000
        shoulderLines: 0x131318
        brokenLines: 0x131318
        leftCars: [0xdc5b20, 0xdca320, 0xdc2020]
        rightCars: [0x334bf7, 0xe5e6ed, 0xbfc6f3]
        sticks: 0xc5e8eb
---
```

@tab Deep

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: hyper-speed
    effectConfig:
      distortion: deepDistortion
      length: 400
      roadWidth: 18
      islandWidth: 2
      lanesPerRoad: 3
      fov: 90
      fovSpeedUp: 150
      speedUp: 2
      carLightsFade: 0.4
      totalSideLightSticks: 50
      lightPairsPerRoadWay: 50
      shoulderLinesWidthPercentage: 0.05
      brokenLinesWidthPercentage: 0.1
      brokenLinesLengthPercentage: 0.5
      lightStickWidth: [0.12, 0.5]
      lightStickHeight: [1.3, 1.7]
      movingAwaySpeed: [60, 80]
      movingCloserSpeed: [-120, -160]
      carLightsLength: [20, 60]
      carLightsRadius: [0.05, 0.14]
      carWidthPercentage: [0.3, 0.5]
      carShiftX: [-0.2, 0.2]
      carFloorSeparation: [0.05, 1]
      colors:
        roadColor: 0x080808
        islandColor: 0x0a0a0a
        background: 0x000000
        shoulderLines: 0x131318
        brokenLines: 0x131318
        leftCars: [0xff322f, 0xa33010, 0xa81508]
        rightCars: [0xfdfdf0, 0xf3dea0, 0xe2bb88]
        sticks: 0xfdfdf0
---
```

:::

### liquid-ether

#### Effect Preview

![liquid-ether](/images/hero-effects/liquid-ether.png)

#### Install dependencies

:::npm-to

```sh
npm i three
```

:::

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: liquid-ether
---
```

#### Configuration

::::field-group
:::field name="mouseForce" type="number" optional default="20"
Strength multiplier applied to mouse / touch movement when injecting velocity.
:::
:::field name="cursorSize" type="number" optional default="100"
Radius (in pixels at base resolution) of the force brush.
:::
:::field name="isViscous" type="boolean" optional default="false"
Toggle iterative viscosity solve (smoother, thicker motion when enabled).
:::
:::field name="viscous" type="number" optional default="30"
Viscosity coefficient used when `isViscous` is `true`.
:::
:::field name="iterationsViscous" type="number" optional default="32"
Number of Gauss-Seidel iterations for viscosity (higher = smoother, slower).
:::
:::field name="iterationsPoisson" type="number" optional default="32"
Number of pressure Poisson iterations to enforce incompressibility.
:::
:::field name="dt" type="number" optional default="0.014"
Fixed simulation timestep used inside the advection / diffusion passes.
:::
:::field name="BFECC" type="boolean" optional default="true"
Enable BFECC advection (error-compensated) for crisper flow; disable for slight performance gain.
:::
:::field name="resolution" type="number" optional default="0.5"
Simulation texture scale relative to canvas size (lower = better performance, more blur).
:::
:::field name="isBounce" type="boolean" optional default="false"
If true, shows bounce boundaries (velocity clamped at edges).
:::
:::field name="colors" type="string\[]" optional default="\['#5227FF', '#FF9FFC', '#B19EEF']"
Array of hex color stops used to build the velocity-to-color palette.
:::
:::field name="autoDemo" type="boolean" optional default="true"
Enable idle auto-driving of the pointer when no user interaction.
:::
:::field name="autoSpeed" type="number" optional default="0.5"
Speed (normalized units/sec) for auto pointer motion.
:::
:::field name="autoIntensity" type="number" optional default="2.2"
Multiplier applied to velocity delta while in auto mode.
:::
:::field name="takeoverDuration" type="number" optional default="2.5"
Seconds to interpolate from auto pointer to real cursor when user moves mouse.
:::
:::field name="autoResumeDelay" type="number" optional default="1000"
Milliseconds of inactivity before auto mode resumes.
:::
:::field name="autoRampDuration" type="number" optional default="0.6"
Seconds to ramp auto movement speed from 0 to full after activation.
:::
:::field name="className" type="string" optional
Custom class name to apply to the container element
:::
:::field name="style" type="CSSProperties" optional
Custom inline styles to apply to the container element
:::
::::

**Example**：

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: liquid-ether
    effectConfig:
      mouseForce: 20
      cursorSize: 100
      isViscous: false
      viscous: 30
      iterationsViscous: 32
      iterationsPoisson: 32
      dt: 0.014
      BFECC: true
      resolution: 0.5
      isBounce: false
      colors: [#5227FF, #FF9FFC, #B19EEF]
      autoDemo: true
      autoSpeed: 0.5
      autoIntensity: 2.2
      takeoverDuration: 0.25
      autoResumeDelay: 1000
      autoRampDuration: 0.6
---
```

### dot-grid

#### Effect Preview

![dot-grid](/images/hero-effects/dot-grid.png)

#### Install dependencies

:::npm-to

```sh
npm i three gsap
```

:::

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: dot-grid
---
```

#### Configuration

::::field-group
:::field name="dotSize" type="number" optional default="5"
Size of each dot in pixels.
:::
:::field name="gap" type="number" optional default="15"
Gap between each dot in pixels.
:::
:::field name="baseColor" type="string" optional default="'#ebebf5'"
Base color of the dots.
:::
:::field name="activeColor" type="string" optional default="'#8cccd5'"
Color of dots when hovered or activated.
:::
:::field name="proximity" type="number" optional default="120"
Radius around the mouse pointer within which dots react.
:::
:::field name="speedTrigger" type="number" optional default="100"
Mouse speed threshold to trigger inertia effect.
:::
:::field name="shockRadius" type="number" optional default="250"
Radius of the shockwave effect on click.
:::
:::field name="shockStrength" type="number" optional default="5"
Strength of the shockwave effect on click.
:::
:::field name="maxSpeed" type="number" optional default="5000"
Maximum speed for inertia calculation.
:::
:::field name="resistance" type="number" optional default="750"
Resistance for the inertia effect.
:::
:::field name="returnDuration" type="number" optional default="1.5"
Duration for dots to return to their original position after inertia.
:::
:::field name="className" type="string" optional
CSS class names applied to the container.
:::
:::field name="style" type="CSSProperties" optional
Inline styles applied to the container.
:::
::::

**Example**:

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: dot-grid
    effectConfig:
      dotSize: 5
      gap: 15
      baseColor: #ebebf5
      activeColor: #8cccd5
      proximity: 120
      speedTrigger: 100
      shockRadius: 250
      shockStrength: 5
      maxSpeed: 5000
      resistance: 750
      returnDuration: 1.5
---
```

### iridescence

#### Effect Preview

![iridescence](/images/hero-effects/iridescence.png)

#### Install dependencies

:::npm-to

```sh
npm i ogl
```

:::

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: iridescence
---
```

#### Configuration

::::field-group
:::field name="color" type="readonly \[number, number, number]" optional default="\[1, 1, 1]"
Base color as an array of RGB values (each between 0 and 1).
:::
:::field name="speed" type="number" optional default="1"
Speed multiplier for the animation.
:::
:::field name="amplitude" type="number" optional default="0.1"
Amplitude for the mouse-driven effect.
:::
:::field name="mouseReact" type="boolean" optional default="true"
Enable or disable mouse interaction with the shader.
:::
::::

**Example**:

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: iridescence
    effectConfig:
      color: [1, 1, 1]
      speed: 1.0
      amplitude: 0.1
      mouseReact: true
---
```

### orb

#### Effect Preview

![orb](/images/hero-effects/orb.png)

#### Install dependencies

:::npm-to

```sh
npm i ogl
```

:::

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: orb
---
```

#### Configuration

::::field-group
:::field name="hue" type="number" optional default="0"
The base hue for the orb (in degrees).
:::
:::field name="hoverIntensity" type="number" optional default="0.2"
Controls the intensity of the hover distortion effect.
:::
:::field name="rotateOnHover" type="boolean" optional default="true"
Toggle to enable or disable continuous rotation on hover.
:::
:::field name="forceHoverState" type="boolean" optional default="false"
Force hover animations even when the orb is not actually hovered.
:::
:::field name="className" type="string" optional
Additional CSS classes for the component.
:::
::::

**Example**:

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: orb
    effectConfig:
      hue: 0
      hoverIntensity: 0.2
      rotateOnHover: true
      forceHoverState: false
---
```

### beams

#### Effect Preview

![beams](/images/hero-effects/beams.png)

#### Install dependencies

:::npm-to

```sh
npm i three
```

:::

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: beams
---
```

#### Configuration

::::field-group
:::field name="beamWidth" type="number" optional default="2"
Width of each beam.
:::
:::field name="beamHeight" type="number" optional default="15"
Height of each beam.
:::
:::field name="beamNumber" type="number" optional default="12"
Number of beams to display.
:::
:::field name="lightColor" type="string" optional default="#fff"
Color of the directional light.
:::
:::field name="speed" type="number" optional default="2"
Speed of the animation.
:::
:::field name="noiseIntensity" type="number" optional default="1.75"
Intensity of the noise effect overlay.
:::
:::field name="scale" type="number" optional default="0.2"
Scale of the noise pattern.
:::
:::field name="rotation" type="number" optional default="0"
Rotation of the entire beams system in degrees.
:::
::::

**Example**:

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: beams
    effectConfig:
      beamWidth: 2
      beamHeight: 15
      beamNumber: 12
      lightColor: #fff
      speed: 2
      noiseIntensity: 1.75
      scale: 0.2
      rotation: 0
---
```

### lightning

#### Effect Preview

![lightning](/images/hero-effects/lightning.png)

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: lightning
---
```

#### Configuration

::::field-group
:::field name="hue" type="number" optional default="255"
Hue of the lightning in degrees (0 to 360).
:::
:::field name="xOffset" type="number" optional default="0"
Horizontal offset of the lightning in normalized units.
:::
:::field name="speed" type="number" optional default="1"
Animation speed multiplier for the lightning.
:::
:::field name="intensity" type="number" optional default="1"
Brightness multiplier for the lightning.
:::
:::field name="size" type="number" optional default="1"
Scale factor for the bolt size.
:::
::::

**Example**:

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: lightning
    effectConfig:
      hue: 255
      xOffset: 0
      speed: 1
      intensity: 1
      size: 1
---
```

### dark-veil

#### Effect Preview

![dark-veil](/images/hero-effects/dark-veil.png)

#### Usage

```md {8}
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: dark-veil
---
```

#### Configuration

::::field-group
:::field name="hueShift" type="number" optional default="0"
Shifts the hue of the entire animation.
:::
:::field name="noiseIntensity" type="number" optional default="0"
Intensity of the noise/grain effect.
:::
:::field name="scanlineIntensity" type="number" optional default="0"
Intensity of the scanline effect.
:::
:::field name="speed" type="number" optional default="0.5"
Speed of the animation.
:::
:::field name="scanlineFrequency" type="number" optional default="0"
Frequency of the scanlines.
:::
:::field name="warpAmount" type="number" optional default="0"
Amount of warp distortion applied to the effect.
:::
:::field name="resolutionScale" type="number" optional default="1"
Scale factor for the resolution.
:::
::::

**Example**:

```md
---
pageLayout: home
home: true
config:
 -
    type: hero
    full: true
    effect: dark-veil
    effectConfig:
      hueShift: 0
      noiseIntensity: 0
      scanlineIntensity: 0
      speed: 0.5
      scanlineFrequency: 0
      warpAmount: 0
      resolutionScale: 1
---
```
