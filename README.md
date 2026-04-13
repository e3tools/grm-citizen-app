# GRM Citizen App

A React Native mobile application built with Expo for managing grievances and citizen feedback.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building](#building)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Configuration](#configuration)

<a id="project-structure"></a>

## 📁 Project Structure

```
grm-citizen-app/
├── .github/
│   └── workflows/
│       └── build.yml          # GitHub Actions CI/CD
├── assets/                     # Images, icons, and static assets
├── components/                 # Expo template components
├── config.dev/                # Development configuration (gitignored)
├── config.prod/               # Production configuration (gitignored)
├── config.ts                  # Config loader (dev/prod switcher)
├── scripts/
│   ├── build-android.js       # Cross-platform Android build script
│   └── reset-project.js       # Project reset utility
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── CustomButton.js
│   │   ├── GrievanceCard.js
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   │   ├── useIssue.ts
│   │   └── ...
│   ├── router/                # Navigation configuration
│   ├── screens/               # Screen components
│   │   ├── Auth/              # Authentication screens
│   │   └── Home/              # Main app screens
│   ├── services/              # API services
│   │   ├── authService.js
│   │   ├── issueService.js
│   │   └── ...
│   ├── store/                 # Redux store
│   ├── translations/          # i18n translations
│   └── utils/                 # Utility functions
├── App.js                     # Root component
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── jest.config.js             # Jest test configuration
├── jest.setup.js              # Jest setup and mocks
├── metro.config.js            # Metro bundler configuration
└── package.json               # Dependencies and scripts
```

<a id="getting-started"></a>

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI (installed globally or via npx)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd grm-citizen-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up development configuration:

   ```bash
   # Copy example config
   cp -r config.dev.example config.dev
   # Edit config.dev/index.js with your local API URLs
   ```

4. Initialize Husky (for pre-commit hooks):
   ```bash
   npm run prepare
   ```
   <a id="development"></a>

## 💻 Development

### Start Development Server

```bash
npm start
```

This starts the Expo development server. You can then:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan QR code with Expo Go app on your device

### Available Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Start on Android
npm run ios            # Start on iOS
npm run web            # Start web version

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
npm run format         # Format code with Prettier
npm run format:check    # Check code formatting

# Testing
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run test:ci        # Run tests in CI mode

# Building
npm run prebuild:android        # Generate Android native code
npm run build:android:local     # Build Android APK locally
npm run build:android:bundle    # Build Android AAB locally
```

<a id="building"></a>

## 🏗️ Building

### Local Android Build

1. Generate native Android code:

   ```bash
   npm run prebuild:android
   ```

2. Build APK:

   ```bash
   npm run build:android:local
   ```

   The APK will be in `android/app/build/outputs/apk/release/app-release.apk`

### Production Build (GitHub Actions)

The app automatically builds on every push to `main` branch via GitHub Actions.

**Build Artifacts:**

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

Download from: **GitHub Actions → Workflow run → Artifacts**

<a id="code-quality"></a>

## 🎨 Code Quality

### Prettier (Code Formatting)

This project uses **Prettier** for consistent code formatting.

**Automatic Formatting:**

- Pre-commit hook automatically formats staged files
- CI checks formatting on every PR

**Manual Formatting:**

```bash
npm run format         # Format all files
npm run format:check   # Check if files are formatted
```

**Configuration:** `.prettierrc.js`

### ESLint (Code Linting)

**Run Linter:**

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
```

**Configuration:** `eslint.config.js`

<a id="testing"></a>

## 🧪 Testing

This project uses **Jest** and **React Native Testing Library** for testing.

### Test Types

#### Option 1: Unit Tests ✅

Tests for utilities, services, and pure functions:

- `src/utils/utils.test.js` - Utility function tests
- `src/services/authService.test.js` - Service tests with API mocking

#### Option 2: Component & Integration Tests ✅

Tests for React components and user interactions:

- `src/components/CustomButton.test.js` - Component rendering and interactions
- `src/components/GrievanceCard.test.js` - Component with navigation
- `src/screens/Auth/Login/Login.test.js` - Integration test with form submission

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (for development)
npm run test:watch

# With coverage report
npm run test:coverage

# CI mode (used in GitHub Actions)
npm run test:ci

```

<a id="cicd"></a>

## 🔄 CI/CD

GitHub Actions automatically runs on every push and pull request:

### Workflow Steps

1. **Format Check** - Verifies code is formatted with Prettier
2. **Tests** - Runs all tests with coverage
3. **Build Android** - Builds APK and AAB (only if tests pass)

### Workflow File

`.github/workflows/build.yml`

### Manual Trigger

You can manually trigger builds from: **Actions → Build React Native App → Run workflow**

<a id="configuration"></a>

## ⚙️ Configuration

### Environment Configuration

The app uses different configs for development and production:

- **Development:** `config.dev/index.js` (gitignored)
- **Production:** `config.prod/index.js` (gitignored, created in CI)

The app automatically switches based on `__DEV__` flag:

- `__DEV__ = true` → uses `config.dev`
- `__DEV__ = false` → uses `config.prod`

### Production Config in CI

Production config is automatically created in GitHub Actions from secrets:

- `API_AUTH_BASE_URL` - Production API URL
- `USER_SESSION_KEY` - Session key (optional)

### App Configuration

Main app configuration: `app.json`

Key settings:

- App name, version, bundle ID
- Icons and splash screens
- Android/iOS specific settings
- Expo plugins

## 🛠️ Tech Stack

- **Framework:** React Native 0.81.4
- **Build Tool:** Expo SDK 54
- **State Management:** Redux
- **Navigation:** React Navigation
- **Testing:** Jest + React Native Testing Library
- **Code Quality:** ESLint + Prettier
- **CI/CD:** GitHub Actions

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass: `npm test`
4. Ensure code is formatted: `npm run format:check`
5. Submit a pull request

---

For more information, visit the [Expo documentation](https://docs.expo.dev/).
