# 构建 iOS 原生应用指南

## 当前进度
✅ Capacitor 已安装  
✅ 配置文件已创建 (capacitor.config.ts)  
✅ Next.js 构建配置已更新 (output: export, distDir: out)  

## 在 Mac 上的构建步骤

> **注意：以下步骤必须在 Mac 电脑上运行，Windows 无法编译 iOS 应用**

### 1. 将代码推送到 GitHub（已完成）
```bash
git add .
git commit -m "feat: Setup Capacitor for iOS app"
git push
```

### 2. 在 Mac 上克隆项目
```bash
git clone https://github.com/lix771859-ux/xuen-zf.git
cd xuen-zf
```

### 3. 安装依赖
```bash
npm install
```

### 4. 构建 Next.js 应用
```bash
npm run build
```

### 5. 同步到 iOS 项目
```bash
npx cap sync ios
```

### 6. 打开 Xcode
```bash
npx cap open ios
```

### 7. 在 Xcode 中配置应用

#### 步骤 1：设置 Bundle ID 和 Team ID
- 在 Xcode 中选择 `App` 项目
- 点击 `Signing & Capabilities` 标签
- 输入你的 Team ID
- 输入 Bundle ID：`com.xuenzf.rentapp`

#### 步骤 2：配置应用图标
- 在 Xcode 中，选择 `Assets.xcassets`
- 找到 `AppIcon` 集合
- 将 icon-192.svg 和 icon-512.svg 转换为 PNG 并添加所需的尺寸：
  - 20x20 (iPhone notification)
  - 29x29 (iPhone Spotlight)
  - 40x40 (iPhone Spotlight)
  - 60x60 (iPhone App)
  - 120x120 (iPhone App)
  - 180x180 (iPhone App)

#### 步骤 3：配置启动屏幕（可选）
- 在 `LaunchScreen.storyboard` 中自定义启动屏幕

### 8. 编译和运行

#### 本地测试（在 Mac 上）
```bash
# 选择模拟器或真机
# 在 Xcode 中按 Cmd + R 运行
```

#### 上架到 App Store 前的准备

1. **创建 App Store Connect 记录**
   - 访问 https://appstoreconnect.apple.com
   - 创建新应用
   - App ID: `com.xuenzf.rentapp`
   - App Name: 租房APP

2. **编译生产版本**
   - 在 Xcode 中：Product → Scheme → Edit Scheme
   - 选择 Release 配置
   - Product → Archive

3. **签名和部署**
   - 选择存档的 Build
   - 点击 Distribute App
   - 选择 App Store Connect
   - 按照提示完成上传

### 9. 提交审核
- 在 App Store Connect 中填写应用详情
- 上传屏幕截图和描述
- 提交审核

## 配置文件清单

✅ `capacitor.config.ts` - Capacitor 配置
✅ `next.config.ts` - Next.js 静态导出配置
✅ `public/manifest.json` - PWA 配置
✅ `public/sw.js` - Service Worker
✅ `src/app/layout.tsx` - iOS meta 标签和 PWA 标签

## iOS 项目结构（生成后）
```
ios/
├── App/
│   ├── App.xcodeproj/
│   ├── Podfile
│   └── App/
│       ├── ContentView.swift
│       ├── Assets.xcassets/
│       └── ...
└── Pods/
```

## 常见问题

**Q: 为什么在 Windows 上无法编译 iOS？**
A: iOS 开发工具（Xcode、Swift 编译器等）仅在 macOS 上可用。

**Q: 我没有 Mac 怎么办？**
A: 有三个选择：
1. 购买一台 Mac Mini（最便宜的选项）
2. 使用云 Mac 服务（例如 MacStadium）
3. 继续使用 PWA（用户可以在 iOS Safari 中添加到主屏幕）

**Q: 如何测试 iOS 应用？**
A: 在 Mac 上使用 iOS 模拟器或者连接真机设备。

## 关键文件修改

### capacitor.config.ts（已创建）
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xuenzf.rentapp',
  appName: '租房APP',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
};

export default config;
```

### next.config.ts（已更新）
```typescript
const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
};
```

## 下一步

1. ✅ 这个仓库已为 Capacitor 做好准备
2. ⏳ 推送到 GitHub（已完成）
3. ⏳ 在 Mac 上克隆并运行上述步骤
4. ⏳ 在 Xcode 中编译和测试
5. ⏳ 提交到 App Store

祝你成功！🚀
