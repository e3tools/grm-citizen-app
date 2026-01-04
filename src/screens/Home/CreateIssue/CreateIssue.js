import React, {useState} from 'react'
import {ActivityIndicator, ScrollView, Text, View} from 'react-native'
import {Provider} from 'react-native-paper'
import CustomButton from '../../../components/CustomButton'
import {i18n} from '../../../translations/i18n'
import {colors} from '../../../utils/colors'
import styles from './CreateIssue.style'
import CheckboxCard from '../../../components/CheckboxCard'
import posed from 'react-native-pose'
import {Feather} from '@expo/vector-icons'
import Stepper from '../../../components/Stepper'

const iconConfig = {
  focused: {
    x: 0,
    transition: {type: 'tween', ease: 'linear'},
  },
  unfocused: {x: 0},
}

const AnimatedFeatherIcon = posed(Feather)(iconConfig)

function CreateIssue() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confidentialityValue, setConfidentialityValue] =
    useState('non_confidential')
  const [sharedValues, setSharedValues] = useState({
    name: true,
    age: true,
    gender: true,
    citizen_group_1: true,
    citizen_group_2: true,
  })
  const [step, setStep] = useState(1)

  const updateConfidentiality = value => {
    setConfidentialityValue(value)
    switch (value) {
      case 'non_confidential':
        setSharedValues({
          name: true,
          age: true,
          gender: true,
          citizen_group_1: true,
          citizen_group_2: true,
        })
        break
      case 'confidential':
        setSharedValues({
          name: false,
          age: true,
          gender: true,
          citizen_group_1: true,
          citizen_group_2: true,
        })
        break
      default:
        setSharedValues({
          name: false,
          age: false,
          gender: false,
          citizen_group_1: false,
          citizen_group_2: false,
        })
        break
    }
  }
  if (loading) {
    return (
      <Provider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
        </View>
      </Provider>
    )
  }

  return (
    <Provider>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Stepper numberOfSteps={4} currentStep={step}></Stepper>
          <Text style={styles.title}> {i18n.t('create_issue_step_1')}</Text>
          <Text style={styles.subtitle}>
            {i18n.t('create_issue_step_1_subtitle')}
          </Text>
          <CheckboxCard
            label={i18n.t('non_confidential')}
            currentValue={confidentialityValue}
            controllerValue={'non_confidential'}
            onValueUpdate={value => updateConfidentiality(value)}
            description={i18n.t('non_confidential_description')}
          ></CheckboxCard>
          <CheckboxCard
            label={i18n.t('confidential')}
            currentValue={confidentialityValue}
            controllerValue={'confidential'}
            onValueUpdate={value => updateConfidentiality(value)}
            description={i18n.t('confidential_description')}
          ></CheckboxCard>
          <CheckboxCard
            label={i18n.t('anonymous')}
            currentValue={confidentialityValue}
            controllerValue={'anonymous'}
            onValueUpdate={value => updateConfidentiality(value)}
            description={i18n.t('anonymous_description')}
          ></CheckboxCard>
          <View style={[styles.card, {marginTop: 20}]}>
            <Text style={styles.inputLabel}>
              {' '}
              {i18n.t('shared_information')}
            </Text>
            <View style={styles.sharedInfoContainer}>
              <AnimatedFeatherIcon
                name={sharedValues['name'] ? 'check-circle' : 'circle'}
                size={20}
                color={'#9da3ae'}
              />
              <Text>{i18n.t('name')}</Text>
            </View>
            <View style={styles.sharedInfoContainer}>
              <AnimatedFeatherIcon
                name={sharedValues['age'] ? 'check-circle' : 'circle'}
                size={20}
                color={'#9da3ae'}
              />
              <Text>{i18n.t('age')}</Text>
            </View>
            <View style={styles.sharedInfoContainer}>
              <AnimatedFeatherIcon
                name={sharedValues['gender'] ? 'check-circle' : 'circle'}
                size={20}
                color={'#9da3ae'}
              />
              <Text>{i18n.t('gender')}</Text>
            </View>
            <View style={styles.sharedInfoContainer}>
              <AnimatedFeatherIcon
                name={
                  sharedValues['citizen_group_1'] ? 'check-circle' : 'circle'
                }
                size={20}
                color={'#9da3ae'}
              />
              <Text>{i18n.t('citizen_group_1')}</Text>
            </View>
            <View style={styles.sharedInfoContainer}>
              <AnimatedFeatherIcon
                name={
                  sharedValues['citizen_group_2'] ? 'check-circle' : 'circle'
                }
                size={20}
                color={'#9da3ae'}
              />
              <Text>{i18n.t('citizen_group_2')}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              backgroundColor={colors.primary || '#24c38b'}
              textColor="white"
              label={saving ? i18n.t('saving') : i18n.t('save_and_continue')}
              disabled={saving}
            />
          </View>
        </View>
      </ScrollView>
    </Provider>
  )
}

export default CreateIssue
