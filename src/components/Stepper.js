import React from 'react'
import {View} from 'react-native'
import {colors} from '../utils/colors'

const Stepper = ({currentStep, numberOfSteps}) => {
  return (
    <View style={{flexDirection: 'row', width: '100%'}}>
      {Array.from({length: numberOfSteps}).map((_, index) => {
        const stepNumber = index + 1

        return (
          <View
            key={stepNumber}
            style={{
              flex: 1,
              height: 10,
              backgroundColor:
                stepNumber <= currentStep ? colors.primary : colors.disabled200,
              marginHorizontal: 5,
              borderRadius: 8,
              marginTop: 15,
              marginBottom: 25,
            }}
          />
        )
      })}
    </View>
  )
}

export default Stepper
