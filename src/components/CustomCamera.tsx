import {IconSymbol} from '@/components/ui/icon-symbol'
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraMode,
  CameraCapturedPicture,
} from 'expo-camera'
import React, {PropsWithChildren, useRef, useState} from 'react'
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native'
import {colors} from '../utils/colors'

type Props = PropsWithChildren<{
  onTakeCameraMedia: (media: any) => void
}>

export default function CustomCamera({
  onTakeCameraMedia: onTakeCameraMedia,
}: Props): React.JSX.Element {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const [cameraMode, setCameraMode] = useState<CameraMode>('picture')
  const cameraRef = useRef<CameraView>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button
          color={colors.primary}
          onPress={requestPermission}
          title="grant permission"
        />
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  function toggleCameraMode() {
    setCameraMode(current => (current === 'video' ? 'picture' : 'video'))
  }

  async function takeImageOrVideo() {
    if (!cameraReady || !cameraRef.current) {
      return
    }

    if (cameraMode == 'video') {
      toggleVideoRecording()
    } else {
      const image: CameraCapturedPicture | undefined =
        await cameraRef.current.takePictureAsync()
      onTakeCameraMedia(image)
    }
  }

  const stopRecording = () => {
    if (!cameraReady || !cameraRef.current) {
      return
    }
    cameraRef.current.stopRecording()
    setIsRecording(false)
  }

  const startRecording = async () => {
    if (!cameraReady || !cameraRef.current) {
      return
    }
    setIsRecording(true)
    try {
      const video = await cameraRef.current.recordAsync({maxDuration: 3})
      console.log(video)
    } catch (e) {
      console.error(e)
    }
  }

  const toggleVideoRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        onCameraReady={() => setCameraReady(true)}
        style={styles.camera}
        facing={facing}
        mode={'picture'}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={toggleCameraFacing}
        >
          <IconSymbol
            name={'camera.rotate.fill'}
            size={34}
            color={colors.primary}
          />
          <Text style={styles.labelText}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={takeImageOrVideo}
        >
          {cameraMode === 'video' ? (
            <View
              style={[
                styles.captureButtonVideo,
                {
                  borderColor: isRecording ? colors.error : colors.primary,
                },
              ]}
            />
          ) : (
            <IconSymbol name={'camera'} size={50} color={colors.primary} />
          )}
        </TouchableOpacity>

        {/* Video recorder */}
        {/* <TouchableOpacity style={styles.iconButton} onPress={toggleCameraMode}>
          <Text style={styles.iconText}>
            {cameraMode === 'video' ? (
              <IconSymbol
                name={'apple.image.playground.fill'}
                size={34}
                color={colors.primary}
              />
            ) : (
              <IconSymbol name={'video'} size={34} color={colors.primary} />
            )}
          </Text>
          <Text style={styles.labelText}>
            {cameraMode === 'video' ? 'Take Photo' : 'Switch Video'}
          </Text>
        </TouchableOpacity> */}

        <View style={styles.iconButton}></View>
      </View>
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  camera: {
    flex: 1,
  },
  captureButtonVideo: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderRadius: 30,
  },
  iconText: {
    color: colors.secondary,
    fontWeight: '500',
    fontSize: 14,
  },
  labelText: {
    color: colors.secondary,
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
  iconButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  captureButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    paddingVertical: 12,
  },
  buttonContainer: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: -4},
    elevation: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})
