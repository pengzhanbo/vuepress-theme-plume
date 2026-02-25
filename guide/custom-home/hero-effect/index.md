---
url: /guide/custom-home/hero-effect/index.md
---
## 概述

对于大多数的站点而言，一个 **炫酷好看** 首页首屏，能够更容易的吸引用户停留下来。
但实现 **炫酷好看** 往往需要比较复杂的技术成本，以及一些不错的灵感。

主题对 **首页** 的 **Hero** 部分，内置了一系列 **炫酷好看** 的背景效果，
通过简单的配置即可应用到你的站点首页中：

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

::: important 当且仅当 `type: hero` 时，主题会应用 `effect` 配置的效果。
:::

`effect` 支持以下可选值：

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

`effectConfig` 需要根据不同的 `effect` 值，进行不同的配置。通常你不需要配置，主题会自动应用预设配置。

:::important 重要说明
主题内置的效果，得益于优秀开源项目 [vue-bits](https://vue-bits.dev/)。
遵循 MIT 协议，复制并修改其中的代码到主题中。
:::

## 强制深色模式

大部分背景效果在 **深色模式** 下表现更加出色，因此建议开启 [深色模式](../../config/theme.md#appearance) 以获得最佳体验。

但对于文档部分，也许 **浅色模式** 才是你想要的，因此主题在 `hero` 中提供了 `forceDark` 选项，
仅强制将首页强制变更为 **深色模式**，而不影响其他页面的颜色模式。

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

## 背景动态效果

::: important
不同的效果可能会依赖 `three` 或 `gsap` 或 `ogl`，你需要根据所使用的效果，手动安装相应的依赖包。

主题通过 **按需加载** 的方式动态加载这些效果， 因此不用担心最终打包后的文档体积过大。
:::

### tint-plate

#### 效果预览

![tint-plate](/images/hero-effects/tint-plate.png)

#### 使用方法

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

#### 配置项

`effectConfig` 用于配置 RGB 值：

* 配置为单个值时，表示配置 red,green,blue 三个颜色值为相同值，范围： 0 - 255。示例： `210`。
* 配置为三个值时，表示配置 red,green,blue 三个颜色值为不同值，范围： 0 - 255。示例： `210,210,210`。
* 配置为 `TintPlate`，则可以更加灵活的控制每个颜色值和对应的偏移量。
* 还可以配置为 `{ light: TintPlate, dark: TintPlate }`，在深色模式和浅色模式下使用不同的颜色值。

```ts
interface TintPlate {
  r: { value: number, offset: number } // value 表示色值，offset 表示偏移量
  g: { value: number, offset: number }
  b: { value: number, offset: number }
}
```

**示例**：

::: code-tabs

@tab 单个值

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

@tab 三个值

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
为了便于用户配置 美观的个性化的背景，主题还提供了 [首页背景色板配置工具](../../tools/home-hero-tint-plate.md)
进行可视化操作，生成配置内容，你可以直接复制它们用于自己的项目中。
:::

### prism

#### 效果预览

![prism](/images/hero-effects/prism.png)

#### 安装依赖

:::npm-to

```sh
npm i ogl
```

:::

#### 使用方法

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

#### 配置项

:::: field-group

:::field name="height" type="number" optional default="3.5"
棱柱的顶点高度（world units）
:::
:::field name="baseWidth" type="number" optional default="5.5"
X/Z轴总基准宽度（world units）
:::
:::field name="animationType" type="'rotate' | 'hover' | '3drotate'" optional default="'rotate'"
动画模式：着色器摆动、指针悬停倾斜或完全三维旋转。
:::
:::field name="glow" type="number" optional default="1"
发光/溢出强度乘数。
:::
:::field name="offset" type="{ x?: number, y?: number }" optional default="{ x: 0, y: 0 }"
画布内的像素偏移（x → 向右，y → 向下）。
:::
:::field name="noise" type="number" optional default="0"
最终颜色中添加的颗粒噪声量（0表示禁用）。
:::
:::field name="transparent" type="boolean" optional default="true"
画布是否具有Alpha通道（透明背景）。
:::
:::field name="scale" type="number" optional default="3.6"
棱镜的整体屏幕空间比例（数值越大，显示尺寸越大）。
:::
:::field name="hueShift" type="number" optional default="0"
色调旋转（弧度）应用于最终颜色。
:::
:::field name="colorFrequency" type="number" optional default="1"
控制颜色变化的内部正弦带频率。
:::
:::field name="hoverStrength" type="number" optional default="2"
悬停倾斜（俯仰/偏航幅度）灵敏度。
:::
:::field name="inertia" type="number" optional default="0.05"
悬停缓动因子（`0 ~ 1`，数值越大响应越灵敏）。
:::
:::field name="bloom" type="number" optional default="1"
在光泽之上叠加额外的绽放效果层次。
:::
:::field name="suspendWhenOffscreen" type="boolean" optional default="true"
当元素不在视口内时暂停渲染。
:::
:::field name="timeScale" type="number" optional default="0.5"
动画全局时间倍率（0=冻结，1=正常）。
:::
::::

**示例**:

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

#### 效果预览

![pixel-blast](/images/hero-effects/pixel-blast.png)

#### 安装依赖

:::npm-to

```sh
npm i three postprocessing
```

:::

#### 使用方法

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

#### 配置项

::::field-group
:::field name="variant" type="'square' | 'circle' | 'triangle' | 'diamond'" optional default="'square'"
像素形状变体
:::
:::field name="pixelSize" type="number" optional default="4"
基础像素尺寸（根据DPI自动缩放）。
:::
:::field name="color" type="string" optional default="'#5086a1'"
像素颜色
:::
:::field name="antialias" type="boolean" optional default="true"
是否启用抗锯齿
:::
:::field name="patternScale" type="number" optional default="2"
噪声/图案比例
:::
:::field name="patternDensity" type="number" optional default="1"
调整图案密度
:::
:::field name="liquid" type="boolean" optional default="false"
是否启用液体扭曲效果。
:::
:::field name="liquidStrength" type="number" optional default="0.1"
液体扭曲强度
:::
:::field name="liquidRadius" type="number" optional default="1"
液体触摸笔刷半径比例。
:::
:::field name="liquidWobbleSpeed" type="number" optional default="4.5"
液体晃动频率
:::
:::field name="pixelSizeJitter" type="number" optional default="0"
应用于覆盖范围的随机抖动
:::
:::field name="enableRipples" type="boolean" optional default="true"
启用点击涟漪效果
:::
:::field name="rippleIntensityScale" type="number" optional default="1"
纹波强度乘数
:::
:::field name="rippleThickness" type="number" optional default="0.1"
纹波环厚度
:::
:::field name="rippleSpeed" type="number" optional default="0.3"
纹波传播速度
:::
:::field name="autoPauseOffscreen" type="boolean" optional default="true"
当元素不在视口内时自动暂停渲染
:::
:::field name="speed" type="number" optional default="0.5"
动画时间缩放比例
:::
:::field name="transparent" type="boolean" optional default="true"
透明背景
:::
:::field name="edgeFade" type="number" optional default="0.5"
边缘淡入距离（`0-1`）。
:::
:::field name="noiseAmount" type="number" optional default="0"
噪声强度
:::
:::field name="className" type="string" optional
容器自定义类名
:::
:::field name="style" type="CSSProperties" optional
容器自定义样式
:::
:::field name="backgroundImage" type="string" optional
背景图像 URL
:::
::::

**示例**：

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

#### 效果预览

![hyper-speed](/images/hero-effects/hyper-speed.png)

#### 安装依赖

:::npm-to

```sh
npm i three postprocessing
```

:::

#### 使用方法

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

#### 配置项

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

:::warning [vue-bits](https://vue-bits.dev/backgrounds/hyperspeed) 未提供详细配置项说明，请谨慎使用。
:::

可以使用以下预设配置，直接复制到你的 markdown 文件中:

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

#### 效果预览

![liquid-ether](/images/hero-effects/liquid-ether.png)

#### 安装依赖

:::npm-to

```sh
npm i three
```

:::

#### 使用方法

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

#### 配置项

::::field-group
:::field name="mouseForce" type="number" optional default="20"
鼠标/触摸移动注入速度时的强度系数。
:::
:::field name="cursorSize" type="number" optional default="100"
光标半径（以基本分辨率的像素为单位）。
:::
:::field name="isViscous" type="boolean" optional default="false"
启用迭代性质量解决方案(更平滑，更粗糙的运动)。
:::
:::field name="viscous" type="number" optional default="30"
当 `isViscous` 为 `true` 时使用的粘性系数。
:::
:::field name="iterationsViscous" type="number" optional default="32"
粘性的高斯-塞德尔迭代次数（值越大 = 更平滑，更慢）。
:::
:::field name="iterationsPoisson" type="number" optional default="32"
用于确保不可压缩性的压力泊松迭代次数。
:::
:::field name="dt" type="number" optional default="0.014"
内部的对流/扩散迭代中使用固定的模拟时间步长。
:::
:::field name="BFECC" type="boolean" optional default="true"
启用 BFECC 传输（错误补偿）以获得更清晰的流动，禁用以获得稍微的性能提升。
:::
:::field name="resolution" type="number" optional default="0.5"
相对于画布大小的仿真纹理缩放（值越小，更好的性能、更模糊）。
:::
:::field name="isBounce" type="boolean" optional default="false"
如果为 true，显示弹跳边界（速度在边缘上限）。
:::
:::field name="colors" type="string\[]" optional default="\['#5227FF', '#FF9FFC', '#B19EEF']"
用于构建速度-颜色映射调色板的十六进制颜色停止点数组。
:::
:::field name="autoDemo" type="boolean" optional default="true"
启用无用户交互时的自动驾驶指针。
:::
:::field name="autoSpeed" type="number" optional default="0.5"
自动指针运动的速度（标准化单位/秒）。
:::
:::field name="autoIntensity" type="number" optional default="2.2"
在自动模式下应用于速度增量的乘数。
:::
:::field name="takeoverDuration" type="number" optional default="2.5"
在用户移动鼠标时从自动指针插值到实际光标的秒数。
:::
:::field name="autoResumeDelay" type="number" optional default="1000"
在自动模式恢复之前的不活动时间（毫秒）。
:::
:::field name="autoRampDuration" type="number" optional default="0.6"
在激活后从 0 开始加速自动移动速度的秒数。
:::
:::field name="className" type="string" optional
应用于容器上的 CSS 类名。
:::
:::field name="style" type="CSSProperties" optional
应用于容器上的 CSS 样式。
:::
::::

**示例**：

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

#### 效果预览

![dot-grid](/images/hero-effects/dot-grid.png)

#### 安装依赖

:::npm-to

```sh
npm i three gsap
```

:::

#### 使用方法

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

#### 配置项

::::field-group
:::field name="dotSize" type="number" optional default="5"
每个点的尺寸（像素）。
:::
:::field name="gap" type="number" optional default="15"
每个点之间的间隙（像素）。
:::
:::field name="baseColor" type="string" optional default="'#ebebf5'"
点的基本颜色。
:::
:::field name="activeColor" type="string" optional default="'#8cccd5'"
鼠标悬停或激活时点的颜色。
:::
:::field name="proximity" type="number" optional default="120"
鼠标指针周围的半径，在此范围内点会响应
:::
:::field name="speedTrigger" type="number" optional default="100"
触发惯性效果的鼠标速度阈值。
:::
:::field name="shockRadius" type="number" optional default="250"
点击时的震动波半径。
:::
:::field name="shockStrength" type="number" optional default="5"
点击时震动波的强度。
:::
:::field name="maxSpeed" type="number" optional default="5000"
惯性计算的最大速度。
:::
:::field name="resistance" type="number" optional default="750"
惯性效果的阻力
:::
:::field name="returnDuration" type="number" optional default="1.5"
惯性后点返回原始位置的持续时间。
:::
:::field name="className" type="string" optional
应用于容器上的 CSS 类名。
:::
:::field name="style" type="CSSProperties" optional
应用于容器上的 CSS 样式。
:::
::::

**示例**:

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

#### 效果预览

![iridescence](/images/hero-effects/iridescence.png)

#### 安装依赖

:::npm-to

```sh
npm i ogl
```

:::

#### 使用方法

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

#### 配置项

::::field-group
:::field name="color" type="readonly \[number, number, number]" optional default="\[1, 1, 1]"
基准色以 RGB 值数组形式表示（每个数值范围在 `0` 到 `1` 之间）。
:::
:::field name="speed" type="number" optional default="1"
动画的速度乘数
:::
:::field name="amplitude" type="number" optional default="0.1"
鼠标驱动效果的振幅。
:::
:::field name="mouseReact" type="boolean" optional default="true"
启用或禁用鼠标与着色器的交互
:::
::::

**示例**:

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

#### 效果预览

![orb](/images/hero-effects/orb.png)

#### 安装依赖

:::npm-to

```sh
npm i ogl
```

:::

#### 使用方法

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

#### 配置项

::::field-group
:::field name="hue" type="number" optional default="0"
球的基本色调（度）。
:::
:::field name="hoverIntensity" type="number" optional default="0.2"
控制悬停扭曲效果的强度。
:::
:::field name="rotateOnHover" type="boolean" optional default="true"
启用或禁用悬停时的持续旋转。
:::
:::field name="forceHoverState" type="boolean" optional default="false"
即使没有悬停，也强制启用悬停动画。
:::
:::field name="className" type="string" optional
应用于容器上的 CSS 类名。
:::
::::

**示例**:

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

#### 效果预览

![beams](/images/hero-effects/beams.png)

#### 安装依赖

:::npm-to

```sh
npm i three
```

:::

#### 使用方法

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

#### 配置项

::::field-group
:::field name="beamWidth" type="number" optional default="2"
每个激光束的宽度。
:::
:::field name="beamHeight" type="number" optional default="15"
每个激光束的高度。
:::
:::field name="beamNumber" type="number" optional default="12"
要显示的激光束数量。
:::
:::field name="lightColor" type="string" optional default="#fff"
方向光的颜色。
:::
:::field name="speed" type="number" optional default="2"
动画的速度。
:::
:::field name="noiseIntensity" type="number" optional default="1.75"
噪音效果的强度。
:::
:::field name="scale" type="number" optional default="0.2"
噪音模式的缩放比例。
:::
:::field name="rotation" type="number" optional default="0"
整个激光束系统的旋转角度（度）。
:::
::::

**示例**:

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

#### 效果预览

![lightning](/images/hero-effects/lightning.png)

#### 使用方法

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

#### 配置项

::::field-group
:::field name="hue" type="number" optional default="255"
光束的色调（度）（0到360）。
:::
:::field name="xOffset" type="number" optional default="0"
光束的水平偏移量（标准化单位）。
:::
:::field name="speed" type="number" optional default="1"
光束的动画速度乘数。
:::
:::field name="intensity" type="number" optional default="1"
光束的亮度乘数。
:::
:::field name="size" type="number" optional default="1"
光束的缩放因子。
:::
::::

**示例**:

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

#### 效果预览

![dark-veil](/images/hero-effects/dark-veil.png)

#### 使用方法

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

#### 配置项

::::field-group
:::field name="hueShift" type="number" optional default="0"
调整整个动画的色调。
:::
:::field name="noiseIntensity" type="number" optional default="0"
噪声/颗粒效果的强度。
:::
:::field name="scanlineIntensity" type="number" optional default="0"
扫描线效果的强度。
:::
:::field name="speed" type="number" optional default="0.5"
动画速度。
:::
:::field name="scanlineFrequency" type="number" optional default="0"
扫描线的频率。
:::
:::field name="warpAmount" type="number" optional default="0"
应用于效果的扭曲变形量。
:::
:::field name="resolutionScale" type="number" optional default="1"
分辨率缩放比例。
:::
::::

**示例**:

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
