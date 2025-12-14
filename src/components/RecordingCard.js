import * as React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { IconButton } from 'react-native-paper';
const { width  } = Dimensions.get("screen");
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import {i18n} from "../translations/i18n";
import {colors} from "../utils/colors";

const milliSecondToHHMMSS = (value) => {
  const milliSecond = Number(value / 1000);
  const hour = Math.floor(milliSecond / 3600);
  const minute = Math.floor((milliSecond % 3600) / 60);
  const second = Math.floor((milliSecond % 3600) % 60);

  const hrs = hour > 0 ? (hour < 10 ? `0${hour}:` : `${hour}:`) : '';
  const mins = minute > 0 ? (minute < 10 ? `0${minute}:` : `${minute}:`) : '00:';
  const scnds = second > 0 ? (second < 10 ? `0${second}` : second) : '00';
  return `${hrs}${mins}${scnds}`;
};

const RecordingCard = ({ mode = "full", initialURI }) => {
  const [recording, setRecording] = useState(null);
  const [recordingURI, setRecordingURI] = useState(null);
  const [current, setCurrent] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [sound, setSound] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      setPlaying(false);
      setCurrent(duration); // Reset to duration after playback
    } else {
      setCurrent(milliSecondToHHMMSS(playbackStatus.positionMillis));
    }
  };

  useEffect(() => {
    let tempSound;
    async function loadDuration() {
      if (mode === "playback" && initialURI) {
        setRecordingURI(initialURI);
        try {
          const { sound: loadedSound, status } = await Audio.Sound.createAsync(
            { uri: initialURI },
            { shouldPlay: false }
          );
          tempSound = loadedSound;
          if (status && status.durationMillis) {
            const formatted = milliSecondToHHMMSS(status.durationMillis);
            setDuration(formatted);
            setCurrent(formatted);
          }
        } catch (e) {
          setDuration('00:00');
          setCurrent('00:00');
        } finally {
          if (tempSound) await tempSound.unloadAsync();
        }
      }
    }
    loadDuration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialURI]);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
      if (recording) recording.stopAndUnloadAsync();
    };
  }, []);

  const playRecording = async () => {
    if (!recordingURI) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingURI },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setPlaying(true);
      setCurrent('00:00');
      await newSound.playAsync();
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const pausePlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setPlaying(false);
      setCurrent(duration); // Show duration when paused
    }
  };

  return (
      <View
        style={[styles.post]}
      >
        <View style={[styles.play, styles.alignCenter, { flexDirection: "column" }]}>
          {recordingURI && !playing && (
            <IconButton size={35} color={colors.primary} icon="play" onPress={playRecording} />
          )}
          {recordingURI && playing && (
            <IconButton size={35} color={colors.primary} icon="pause" onPress={pausePlayback} />
          )}
        </View>
        <View style={[styles.alignCenter, { flexDirection: 'column', width: '70%' }]}> 
          <Text style={styles.title}>{current}</Text>
          {mode === "full" && isRecording && (<Text style={{ color: colors.primary }}>{i18n.t('recording_in_progress')}</Text>)}
          {playing && (<Text style={{ color: colors.primary }}>{i18n.t('playing_in_progress')}</Text>)}
        </View>
        <View />
      </View>
  );
};

export default RecordingCard;

const styles = StyleSheet.create({
  error: {
    backgroundColor: 'red',
    height: 50,
    color: 'white',
    textAlign: 'center'
  },
  play: {
    borderWidth: .5,
    borderColor: "#c0c0c0",
    width: '15%',
    color: colors.primary
  },
  remove: {
    borderWidth: .5,
    borderColor: "#c0c0c0",
    width: '15%',
    color: colors.error
  },
  title: {
    fontWeight: '500',
    color: "black",
    fontSize: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 15,
    color: '#fff'
  },
  img: {
    height: 250,
    width: width - 5,
    borderRadius: 5,
  },
  alignCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  posts: {
    display: "flex",
    flexDirection: "column",
  },
  post: {
    width: width - 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#c0c0c0",
    display: "flex",
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
});