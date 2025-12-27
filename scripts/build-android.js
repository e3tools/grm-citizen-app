const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')

const platform = process.platform
const isWindows = platform === 'win32'
const gradlewCommand = isWindows ? 'gradlew.bat' : './gradlew'
const buildType = process.argv[2] || 'assembleRelease' // assembleRelease or bundleRelease

try {
  console.log('Running prebuild...')
  execSync('npx expo prebuild --platform android --clean', {stdio: 'inherit'})

  const androidDir = path.join(process.cwd(), 'android')
  if (!fs.existsSync(androidDir)) {
    throw new Error('Android directory not found after prebuild')
  }

  // Clear corrupted Android SDK downloads
  const sdkPath =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    (isWindows
      ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk')
      : path.join(process.env.HOME, 'Library', 'Android', 'sdk'))

  if (sdkPath && fs.existsSync(sdkPath)) {
    const tempPath = path.join(sdkPath, 'temp')
    if (fs.existsSync(tempPath)) {
      console.log('Clearing Android SDK temp files...')
      try {
        const files = fs.readdirSync(tempPath)
        files.forEach(file => {
          const filePath = path.join(tempPath, file)
          if (file.includes('build-tools') || file.includes('36')) {
            console.log(`Removing corrupted file: ${file}`)
            fs.unlinkSync(filePath)
          }
        })
      } catch (e) {
        console.log('Could not clear temp files (this is okay)')
      }
    }
  }

  console.log(`Building Android ${buildType}...`)
  process.chdir(androidDir)

  const command = `${gradlewCommand} ${buildType}`
  console.log(`Executing: ${command}`)
  execSync(command, {stdio: 'inherit'})

  console.log('Build completed successfully!')
} catch (error) {
  console.error('Build failed:', error.message)
  console.error('\nIf you see Android SDK Build-Tools errors:')
  console.error('1. Open Android Studio')
  console.error('2. Go to Tools > SDK Manager')
  console.error(
    '3. In SDK Tools tab, uncheck and re-check "Android SDK Build-Tools"',
  )
  console.error('4. Click Apply to re-download')
  process.exit(1)
}
