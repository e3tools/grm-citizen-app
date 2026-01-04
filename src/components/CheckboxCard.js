import React, {useEffect} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {colors} from '../utils/colors'
import {RadioButton} from 'react-native-paper'

const CheckboxCard = ({
  label,
  currentValue,
  controllerValue,
  onValueUpdate,
  description,
}) => {
  const [value, setValue] = React.useState(currentValue)

  useEffect(() => {
    setValue(currentValue)
  }, [currentValue])

  return (
    <TouchableOpacity
      onPress={() => {
        const newValue = value === controllerValue ? null : controllerValue
        setValue(newValue)
        onValueUpdate(newValue)
      }}
      style={styles.card}
    >
      <View
        style={[
          styles.cardContent,
          value === controllerValue ? styles.checked : styles.unchecked,
        ]}
      >
        <View style={styles.leftSection}>
          <View style={styles.cardContent}>
            <RadioButton
              color={colors.primary}
              value={label}
              uncheckedColor={colors.disabled200}
              status={value === controllerValue ? 'checked' : 'unchecked'}
            ></RadioButton>
            <View style={styles.textSection}>
              <Text style={styles.title} numberOfLines={2}>
                {label}
              </Text>
              <Text style={styles.subtitle}>{description}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  checked: {
    backgroundColor: colors.primary200,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
})

export default CheckboxCard
