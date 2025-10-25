import type * as THREE from 'three'
import type { CSSProperties } from 'vue'
import type { ThemeLightDark } from '../common/index.js'
import type { LiteralUnion } from '../utils.js'

export type ThemeHomeHeroEffect = LiteralUnion<'tint-plate' | 'prism' | 'pixel-blast' | 'hyper-speed' | 'liquid-ether' | 'dot-grid' | 'iridescence' | 'orb' | 'beams' | 'lightning'>

export type ThemeHomeHeroEffectConfig
  = | ThemeHomeHeroTintPlate
    | ThemeHomeHeroPrism
    | ThemeHomeHeroPixelPixelBlast
    | Omit<ThemeHomeHeroHyperSpeed, 'onSpeedUp' | 'onSlowDown'>
    | ThemeHomeHeroLiquidEther
    | ThemeHomeHeroDotGrid
    | ThemeHomeHeroIridescence
    | ThemeHomeHeroOrb
    | ThemeHomeHeroBeams
    | ThemeHomeHeroLightning

export type ThemeHomeHeroTintPlate = ThemeLightDark<{ rgb: string | number } | {
  r: { value: number, offset: number }
  g: { value: number, offset: number }
  b: { value: number, offset: number }
}>

export interface ThemeHomeHeroPrism {
  /**
   * Apex height of the prism (world units)
   * 棱柱的顶点高度（世界单位）
   */
  height?: number
  /**
   * Total base width across X/Z (world units).
   * X/Z轴总基准宽度（世界单位）
   */
  baseWidth?: number
  /**
   * Animation mode: shader wobble, pointer hover tilt, or full 3D rotation.
   * 动画模式：着色器摆动、指针悬停倾斜或完全三维旋转。
   */
  animationType?: 'rotate' | 'hover' | '3drotate'
  /**
   * Glow/bleed intensity multiplier.
   * 发光/溢出强度乘数。
   */
  glow?: number
  /**
   * Pixel offset within the canvas (x→right, y→down).
   * 画布内的像素偏移（x→向右，y→向下）。
   */
  offset?: { x?: number, y?: number }
  /**
   * Film-grain noise amount added to final color (0 disables).
   * 最终颜色中添加的颗粒噪声量（0表示禁用）。
   */
  noise?: number
  /**
   * Whether the canvas has an alpha channel (transparent background).
   * 画布是否具有Alpha通道（透明背景）。
   */
  transparent?: boolean
  /**
   * Overall screen-space scale of the prism (bigger = larger).
   * 棱镜的整体屏幕空间比例（数值越大，显示尺寸越大）。
   */
  scale?: number
  /**
   * Hue rotation (radians) applied to final color.
   * 色调旋转（弧度）应用于最终颜色。
   */
  hueShift?: number
  /**
   * Frequency of internal sine bands controlling color variation.
   * 控制颜色变化的内部正弦带频率。
   */
  colorFrequency?: number
  /**
   * Sensitivity of hover tilt (pitch/yaw amplitude).
   * 悬停倾斜（俯仰/偏航幅度）灵敏度。
   */
  hoverStrength?: number
  /**
   * Easing factor for hover (0..1, higher = snappier).
   * 悬停缓动因子（0到1，数值越大响应越灵敏）。
   */
  inertia?: number
  /**
   * Extra bloom factor layered on top of glow.
   * 在光泽之上叠加额外的绽放效果层次。
   */
  bloom?: number
  /**
   * Pause rendering when the element is not in the viewport.
   * 当元素不在视口内时暂停渲染。
   */
  suspendWhenOffscreen?: boolean
  /**
   * Global time multiplier for animations (0=frozen, 1=normal).
   * 动画全局时间倍率（0=冻结，1=正常）。
   */
  timeScale?: number
}

export type ThemeHomeHeroPixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond'

export interface ThemeHomeHeroPixelPixelBlast {
  /**
   * Pixel shape variant
   * 像素形状变体
   */
  variant?: ThemeHomeHeroPixelBlastVariant
  /**
   * Base pixel size (auto scaled for DPI).
   * 基础像素尺寸（根据DPI自动缩放）。
   */
  pixelSize?: number
  /**
   * Pixel color.
   * 像素颜色
   */
  color?: string
  /**
   * Additional CSS class.
   * 附加CSS类
   */
  className?: string
  /**
   * Additional CSS style.
   * 附加CSS样式
   */
  style?: CSSProperties
  /**
   * Enable antialiasing.
   * 启用抗锯齿。
   */
  antialias?: boolean
  /**
   * Noise/pattern scale.
   * 噪声/图案比例。
   */
  patternScale?: number
  /**
   * Pattern density adjustment.
   * 图案密度调整。
   */
  patternDensity?: number
  /**
   * Enable liquid distortion effect.
   * 启用液体扭曲效果。
   */
  liquid?: boolean
  /**
   * Liquid distortion strength.
   * 液体扭曲强度。
   */
  liquidStrength?: number
  /**
   * Liquid touch brush radius scale.
   * 液体触摸笔刷半径比例。
   */
  liquidRadius?: number
  /**
   * Random jitter applied to coverage.
   * 应用于覆盖范围的随机抖动。
   */
  pixelSizeJitter?: number
  /**
   * Enable click ripple waves.
   * 启用点击涟漪效果。
   */
  enableRipples?: boolean
  /**
   * Ripple intensity multiplier.
   * 纹波强度乘数。
   */
  rippleIntensityScale?: number
  /**
   * Ripple ring thickness.
   * 纹波环厚度。
   */
  rippleThickness?: number
  /**
   * Ripple propagation speed.
   * 纹波传播速度。
   */
  rippleSpeed?: number
  /**
   * Liquid wobble frequency.
   * 液体晃动频率。
   */
  liquidWobbleSpeed?: number
  /**
   * Enable auto-pausing when offscreen.
   *
   * 离屏时自动暂停
   */
  autoPauseOffscreen?: boolean
  /**
   * Animation time scale.
   * 动画时间缩放比例。
   */
  speed?: number
  /**
   * Transparent background.
   * 透明背景。
   */
  transparent?: boolean
  /**
   * Edge fade distance (0-1).
   * 边缘淡入距离（0-1）。
   */
  edgeFade?: number
  /**
   * Post noise amount.
   * 后处理噪声量。
   */
  noiseAmount?: number
  backgroundImage?: ThemeLightDark<string>
  backgroundAttachment?: 'fixed' | 'local'
}

export interface ThemeHomeHeroHyperSpeedDistortion {
  uniforms: Record<string, { value: unknown }>
  getDistortion: string
  getJS?: (progress: number, time: number) => THREE.Vector3
}

export interface ThemeHomeHeroHyperSpeedDistortions {
  [key: string]: ThemeHomeHeroHyperSpeedDistortion
}

export interface ThemeHomeHeroHyperSpeedColors {
  roadColor: number
  islandColor: number
  background: number
  shoulderLines: number
  brokenLines: number
  leftCars: number[]
  rightCars: number[]
  sticks: number
}

export interface ThemeHomeHeroHyperSpeed {
  onSpeedUp?: (ev: MouseEvent) => void
  onSlowDown?: (ev: MouseEvent) => void
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

export interface ThemeHomeHeroLiquidEther {
  /**
   * Strength multiplier applied to mouse / touch movement when injecting velocity.
   * 鼠标/触摸移动注入速度时的强度系数。
   */
  mouseForce?: number
  /**
   * Radius (in pixels at base resolution) of the force brush.
   * 力刷半径（以基本分辨率的像素为单位）。
   */
  cursorSize?: number
  /**
   * Toggle iterative viscosity solve (smoother, thicker motion when enabled).
   * 启用迭代性质量解决方案(更平滑，更粗糙的运动)。
   */
  isViscous?: boolean
  /**
   * Viscosity coefficient used when isViscous is true.
   * 当 isViscous 为 true 时使用的粘性系数。
   */
  viscous?: number
  /**
   * Number of Gauss-Seidel iterations for viscosity (higher = smoother, slower).
   * 粘性的高斯-塞德尔迭代次数（值越大 = 更平滑，更慢）。
   */
  iterationsViscous?: number
  /**
   * Number of pressure Poisson iterations to enforce incompressibility.
   * 用于确保不可压缩性的压力泊松迭代次数。
   */
  iterationsPoisson?: number
  /**
   * Fixed simulation timestep used inside the advection / diffusion passes.
   * 内部的对流/扩散迭代中使用固定的模拟时间步长。
   */
  dt?: number
  /**
   * Enable BFECC advection (error-compensated) for crisper flow; disable for slight performance gain.
   * 启用 BFECC 传输（错误补偿）以获得更清晰的流动，禁用以获得稍微的性能提升。
   */
  BFECC?: boolean
  /**
   * Simulation texture scale relative to canvas size (lower = better performance, more blur).
   * 相对于画布大小的仿真纹理缩放（值越小，更好的性能，更模糊）。
   */
  resolution?: number
  /**
   * If true, shows bounce boundaries (velocity clamped at edges).
   * 如果为 true，显示弹跳边界（速度在边缘上限）。
   */
  isBounce?: boolean
  /**
   * Array of hex color stops used to build the velocity-to-color palette.
   * 用于构建速度-颜色映射调色板的十六进制颜色停止点数组。
   */
  colors?: string[]
  /**
   * Inline styles applied to the root container.
   * 应用于根容器的内联样式。
   */
  style?: Record<string, any>
  /**
   * Optional class for the root container.
   * 根容器的可选类。
   */
  className?: string
  /**
   * Enable idle auto-driving of the pointer when no user interaction.
   * 启用无用户交互时的自动驾驶指针。
   */
  autoDemo?: boolean
  /**
   * Speed (normalized units/sec) for auto pointer motion.
   * 自动指针运动的速度（标准化单位/秒）。
   */
  autoSpeed?: number
  /**
   * Multiplier applied to velocity delta while in auto mode.
   * 在自动模式下应用于速度增量的乘数。
   */
  autoIntensity?: number
  /**
   * Seconds to interpolate from auto pointer to real cursor when user moves mouse.
   * 在用户移动鼠标时从自动指针插值到实际光标的秒数。
   */
  takeoverDuration?: number
  /**
   * Milliseconds of inactivity before auto mode resumes.
   * 在自动模式恢复之前的不活动时间（毫秒）。
   */
  autoResumeDelay?: number
  /**
   * Seconds to ramp auto movement speed from 0 to full after activation.
   * 在激活后从 0 开始加速自动移动速度的秒数。
   */
  autoRampDuration?: number
}

export interface ThemeHomeHeroDotGrid {
  /**
   * Size of each dot in pixels.
   * 每个点的尺寸（像素）。
   */
  dotSize?: number
  /**
   * Gap between each dot in pixels.
   * 每个点之间的间隙（像素）。
   */
  gap?: number
  /**
   * Base color of the dots.
   * 点的基本颜色。
   */
  baseColor?: string
  /**
   * Color of dots when hovered or activated.
   * 鼠标悬停或激活时点的颜色。
   */
  activeColor?: string
  /**
   * Radius around the mouse pointer within which dots react.
   * 鼠标指针周围的半径，在此范围内点会响应。
   */
  proximity?: number
  /**
   * Mouse speed threshold to trigger inertia effect.
   * 触发惯性效果的鼠标速度阈值。
   */
  speedTrigger?: number
  /**
   * Radius of the shockwave effect on click.
   * 点击时的震动波半径。
   */
  shockRadius?: number
  /**
   * Strength of the shockwave effect on click.
   * 点击时震动波的强度。
   */
  shockStrength?: number
  /**
   * Maximum speed for inertia calculation.
   * 惯性计算的最大速度。
   */
  maxSpeed?: number
  /**
   * Resistance for the inertia effect.
   * 惯性效果的阻力。
   */
  resistance?: number
  /**
   * Duration for dots to return to their original position after inertia.
   * 惯性后点返回原始位置的持续时间。
   */
  returnDuration?: number
  /**
   * Additional CSS classes for the component.
   * 为组件添加附加 CSS 类。
   */
  className?: string
  /**
   * Inline styles for the component.
   * 为组件应用内联样式。
   */
  style?: CSSProperties
}

export interface ThemeHomeHeroIridescence {
  /**
   * Base color as an array of RGB values (each between 0 and 1).
   * 基色以RGB值数组形式表示（每个数值范围在0到1之间）。
   */
  color?: ThemeLightDark<readonly [number, number, number]>
  /**
   * Speed multiplier for the animation.
   * 动画的速度乘数。
   */
  speed?: number
  /**
   * Amplitude for the mouse-driven effect.
   * 鼠标驱动效果的振幅。
   */
  amplitude?: number
  /**
   * Enable or disable mouse interaction with the shader.
   * 启用或禁用鼠标与着色器的交互。
   */
  mouseReact?: boolean
}

export interface ThemeHomeHeroOrb {
  /**
   * The base hue for the orb (in degrees).
   * 球的基本色调（度）。
   */
  hue?: number
  /**
   * Controls the intensity of the hover distortion effect.
   * 控制悬停扭曲效果的强度。
   */
  hoverIntensity?: number
  /**
   * Toggle to enable or disable continuous rotation on hover.
   * 启用或禁用悬停时的持续旋转。
   */
  rotateOnHover?: boolean
  /**
   * Force hover animations even when the orb is not actually hovered.
   * 即使没有悬停，也强制启用悬停动画。
   */
  forceHoverState?: boolean
  /**
   * Additional CSS classes for the component.
   * 为组件添加附加 CSS 类。
   */
  className?: string
}

export interface ThemeHomeHeroBeams {
  /**
   * Width of each beam.
   * 每个激光束的宽度。
   */
  beamWidth?: number
  /**
   * Height of each beam.
   * 每个激光束的高度。
   */
  beamHeight?: number
  /**
   * Number of beams to display.
   * 要显示的激光束数量。
   */
  beamNumber?: number
  /**
   * Color of the directional light.
   * 方向光的颜色。
   */
  lightColor?: ThemeLightDark<string>
  /**
   * Speed of the animation.
   * 动画的速度。
   */
  speed?: number
  /**
   * Intensity of the noise effect overlay.
   * 噪音效果的强度。
   */
  noiseIntensity?: number
  /**
   * Scale of the noise pattern.
   * 噪音模式的缩放比例。
   */
  scale?: number
  /**
   * Rotation of the entire beams system in degrees.
   * 整个激光束系统的旋转角度（度）。
   */
  rotation?: number
}

export interface ThemeHomeHeroLightning {
  /**
   * Hue of the lightning in degrees (0 to 360).
   * 光束的色调（度）（0到360）。
   */
  hue?: number
  /**
   * Horizontal offset of the lightning in normalized units.
   * 光束的水平偏移量（标准化单位）。
   */
  xOffset?: number
  /**
   * Animation speed multiplier for the lightning.
   * 光束的动画速度乘数。
   */
  speed?: number
  /**
   * Brightness multiplier for the lightning.
   * 光束的亮度乘数。
   */
  intensity?: number
  /**
   * Scale factor for the bolt size.
   * 光束的缩放因子。
   */
  size?: number
}
