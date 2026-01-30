import { Audio } from 'expo-av'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { IconButton } from 'react-native-paper'
import { i18n } from '../translations/i18n'
import { colors } from '../utils/colors'
import { IconSymbol } from '@/components/ui/icon-symbol'

const { width } = Dimensions.get('screen')

const milliSecondToHHMMSS = value => {
  const milliSecond = Number(value / 1000)
  const hour = Math.floor(milliSecond / 3600)
  const minute = Math.floor((milliSecond % 3600) / 60)
  const second = Math.floor((milliSecond % 3600) % 60)

  const hrs = hour > 0 ? (hour < 10 ? `0${hour}:` : `${hour}:`) : ''
  const mins = minute > 0 ? (minute < 10 ? `0${minute}:` : `${minute}:`) : '00:'
  const scnds = second > 0 ? (second < 10 ? `0${second}` : second) : '00'
  return `${hrs}${mins}${scnds}`
}

type RecordingCardProps = {
  mode?: 'full' | 'playback'
  initialURI: string
  cardContainerStyle?: StyleProp<ViewStyle>
  onRemove?: () => void
}

const RecordingCard: React.FC<RecordingCardProps> = ({
  mode = 'full',
  initialURI,
  cardContainerStyle = { width: width - 45 },
  onRemove,
}) => {
  const [recordingURI, setRecordingURI] = useState<string | null>(null)
  const [current, setCurrent] = useState('00:00')
  const [duration, setDuration] = useState('00:00')
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [playing, setPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const onPlaybackStatusUpdate = (playbackStatus: any) => {
    if (playbackStatus.didJustFinish) {
      setPlaying(false)
      setCurrent(duration)
    } else if (playbackStatus.positionMillis !== undefined) {
      setCurrent(milliSecondToHHMMSS(playbackStatus.positionMillis))
    }
  }

  useEffect(() => {
    let tempSound: Audio.Sound | undefined
    async function loadDuration() {
      if (mode === 'playback' && initialURI) {
        setRecordingURI(initialURI)
        try {
          const { sound: loadedSound, status } = await Audio.Sound.createAsync(
            { uri: initialURI },
            { shouldPlay: false },
          )
          tempSound = loadedSound
          if (status && status.durationMillis) {
            const formatted = milliSecondToHHMMSS(status.durationMillis)
            setDuration(formatted)
            setCurrent(formatted)
          }
        } catch {
          setDuration('00:00')
          setCurrent('00:00')
        } finally {
          if (tempSound) await tempSound.unloadAsync()
        }
      }
    }
    loadDuration()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialURI])

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playRecording = async () => {
    if (!recordingURI) return
    try {
      if (sound) {
        await sound.unloadAsync()
        setSound(null)
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingURI },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      )
      setSound(newSound)
      setPlaying(true)
      setCurrent('00:00')
      await newSound.playAsync()
    } catch (err) {
      console.error('Failed to play recording', err)
    }
  }

  const pausePlayback = async () => {
    if (sound) {
      await sound.stopAsync()
      setPlaying(false)
      setCurrent(duration)
    }
  }

  return (
    <View style={[styles.cardContainer, cardContainerStyle]}>
      <View
        style={[
          styles.iconContainer,
          styles.alignCenter,
          { flexDirection: 'column' },
        ]}
      >
        {recordingURI && !playing && (
          <IconButton
            size={35}
            color={colors.primary}
            icon="play"
            onPress={playRecording}
            accessibilityLabel={i18n.t('play_recording')}
          />
        )}
        {recordingURI && playing && (
          <IconButton
            size={35}
            color={colors.primary}
            icon="pause"
            onPress={pausePlayback}
            accessibilityLabel={i18n.t('pause_playback')}
          />
        )}
      </View>
      <View
        style={[styles.alignCenter, { flexDirection: 'column', width: '70%' }]}
      >
        <Text style={styles.title}>{current}</Text>
        {mode === 'full' && isRecording && (
          <Text style={{ color: colors.primary }}>
            {i18n.t('recording_in_progress')}
          </Text>
        )}
        {playing && (
          <Text style={{ color: colors.primary }}>
            {i18n.t('playing_in_progress')}
          </Text>
        )}
      </View>
      {onRemove && (
        <TouchableOpacity onPress={onRemove}>
          <IconSymbol name={'xmark'} color={colors.secondary} />
        </TouchableOpacity>
      )}
      <View />
    </View>
  )
}

export default RecordingCard

const styles = StyleSheet.create({
  error: {
    backgroundColor: 'red',
    height: 50,
    color: 'white',
    textAlign: 'center',
  },
  iconContainer: {
    borderWidth: 0.5,
    borderColor: '#c0c0c0',
    width: '15%',
    height: '100%',
    color: colors.primary,
  },
  remove: {
    borderWidth: 0.5,
    borderColor: '#c0c0c0',
    width: '15%',
    color: colors.error,
  },
  title: {
    fontWeight: '500',
    color: 'black',
    fontSize: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    color: '#fff',
  },
  img: {
    height: 250,
    width: width - 5,
    borderRadius: 5,
  },
  alignCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#c0c0c0',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    marginVertical: 10,
  },
  button: {
    borderColor: '#28BFFD',
    backgroundColor: '#28BFFD',
    height: 47,
    width: width - 25,
    borderWidth: 1,
    color: '#fff',
    fontSize: 16,
    borderRadius: 5,
  },
})
