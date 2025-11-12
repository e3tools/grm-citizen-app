import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import {Provider, TextInput} from 'react-native-paper';
import CustomButton from '../../../components/CustomButton';
import Dropdown from '../../../components/Dropdown';
import {
  fetchCitizenAgeGroups,
  fetchCitizenGroups,
  fetchUserProfile,
  updateUserProfile
} from '../../../services/profileService';
import { i18n } from '../../../translations/i18n';
import { colors } from '../../../utils/colors';
import styles from './Profile.style';
import MESSAGES from "../../../utils/formErrorMessages";
import {emailRegex} from "../../../utils/formUtils";

const GENDER_OPTIONS = [
  { id: 'male', name: i18n.t('male') },
  { id: 'female', name: i18n.t('female') },
  { id: 'other', name: i18n.t('other') },
];

function Profile() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ageGroups, setAgeGroups] = useState([]);
  const [citizenGroups, setCitizenGroups] = useState([]);
  const [citizenGroupsByType, setCitizenGroupsByType] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      age_group_id: null,
      gender: null,
      group_id: null,
      group_2_id: null,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // Fetch age groups and citizen groups in parallel
      const [profile, ageGroupsData, citizenGroupsData] = await Promise.all([
          fetchUserProfile(),
          fetchCitizenAgeGroups(),
          fetchCitizenGroups(),
      ]);

      setAgeGroups(ageGroupsData.results || ageGroupsData || []);

      // Group citizen groups by type for display purposes
      const groups = citizenGroupsData.results || citizenGroupsData || [];
      const grouped = {};

      groups.forEach(group => {
        // Use the 'type' field from the group object
        const type = group.type || 'default';
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push({
          id: group.id,
          name: group.name,
          type: group.type,
        });
      });

      setCitizenGroups(groups);
      setCitizenGroupsByType(grouped);
      if (profile) {
        reset({
           first_name: profile.first_name || '',
           last_name: profile.last_name || '',
           email: profile.email || '',
           phone_number: profile.phone_number || '',
           age_group_id: profile.age_group?.id || null,
           gender: profile.gender || null,
           group_id: profile.group?.id || null,
           group_2_id: profile.group_2?.id || null,
        });
      }

    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Navigate to home without saving
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // Prepare data for submission according to API spec
      const profileData = {};

      if (data.first_name) {
        profileData.first_name = data.first_name;
      }
      if (data.last_name) {
        profileData.last_name = data.last_name;
      }
      if (data.email) {
        profileData.email = data.email;
      }
      if (data.phone_number) {
        profileData.phone_number = data.phone_number;
      }
      if (data.age_group_id) {
        profileData.age_group_id = data.age_group_id;
      }
      if (data.gender) {
        profileData.gender = data.gender;
      }
      if (data.group_id) {
        profileData.group_id = data.group_id;
      }
      if (data.group_2_id) {
        profileData.group_2_id = data.group_2_id;
      }

      await updateUserProfile(profileData);

      // Navigate to home after successful save
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      // You could show an error message here
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Provider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
        </View>
      </Provider>
    );
  }

  const citizenTypeKeys = Object.keys(citizenGroupsByType);

  return (
    <Provider>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={styles.inputLabel}>{i18n.t('first_name')}</Text>
                    <TextInput
                        theme={{
                          roundness: 10,
                          colors: {
                            primary: colors.primary,
                            placeholder: colors.lightgray,
                            text: colors.darkGrey,
                            onSurface: colors.darkGrey,
                            background: colors.white,
                          },
                        }}
                        mode="flat"
                        placeholder={i18n.t('enter_your_full_name')}
                        placeholderTextColor={colors.secondary}
                        underlineColor={colors.lightgray}
                        activeUnderlineColor={colors.primary}
                        selectionColor={colors.primary}
                        style={styles.loginFormTextInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                    {errors.first_name && <Text style={styles.errorText}>{errors.first_name.message}</Text>}
                  </View>
                );
              }}
              name="first_name"
              rules={{
                required: {
                  value: true,
                  message: MESSAGES.required,
                },
              }}
              defaultValue=""
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.inputLabel}>{i18n.t('last_name')}</Text>
                  <TextInput
                    theme={{
                      roundness: 10,
                      colors: {
                        primary: colors.primary,
                        placeholder: colors.lightgray,
                        text: colors.darkGrey,
                        onSurface: colors.darkGrey,
                        background: colors.white,
                      },
                    }}
                    mode="flat"
                    placeholder={i18n.t('enter_your_last_name')}
                    placeholderTextColor={colors.secondary}
                    underlineColor={colors.lightgray}
                    activeUnderlineColor={colors.primary}
                    selectionColor={colors.primary}
                    style={styles.loginFormTextInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.last_name && <Text style={styles.errorText}>{errors.last_name.message}</Text>}
                </View>
              )}
              name="last_name"
              rules={{
                required: {
                  value: true,
                  message: MESSAGES.required,
                },
              }}
              defaultValue=""
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 16 }}>
                  <View style={[styles.inputLabel, { flexDirection: 'row', alignItems: 'center' }]}>
                      <Text style={{fontSize: 16,color: colors.darkGrey, marginBottom: 8, fontWeight: 'bold'}}>{i18n.t('email')}</Text>
                      <Text style={{ marginLeft: 10, color: colors.secondary, marginBottom: 8 }}>({i18n.t('optional')})</Text>
                  </View>
                  <TextInput
                    theme={{
                      roundness: 10,
                      colors: {
                        primary: colors.primary,
                        placeholder: colors.lightgray,
                        text: colors.darkGrey,
                        onSurface: colors.darkGrey,
                        background: colors.white,
                      },
                    }}
                    mode="flat"
                    placeholder={i18n.t('enter_your_email')}
                    placeholderTextColor={colors.secondary}
                    underlineColor={colors.lightgray}
                    activeUnderlineColor={colors.primary}
                    selectionColor={colors.primary}
                    style={styles.loginFormTextInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address" // Added relevant keyboard type
                  />
                  {/* FIX: Use the destructured 'errors' object */}
                  {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>
              )}
              name="email"
              rules={{
                pattern: {
                  value: emailRegex,
                  message: MESSAGES.email,
                },
              }}
              defaultValue=""
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.inputLabel}>{i18n.t('phone_number')}</Text>
                  <TextInput
                    theme={{
                      roundness: 10,
                      colors: {
                        primary: colors.primary,
                        placeholder: colors.lightgray,
                        text: colors.darkGrey,
                        onSurface: colors.darkGrey,
                        background: colors.white,
                      },
                    }}
                    mode="flat"
                    placeholder={i18n.t('enter_your_phone_number')}
                    placeholderTextColor={colors.secondary}
                    underlineColor={colors.lightgray}
                    activeUnderlineColor={colors.primary}
                    selectionColor={colors.primary}
                    style={styles.loginFormTextInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                  />
                  {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number.message}</Text>}
                </View>
              )}
              name="phone_number"
              rules={{
                required: {
                  value: true,
                  message: MESSAGES.required,
                },
              }}
              defaultValue=""
            />

          <Controller
            control={control}
            name="age_group_id"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label={i18n.t('age_group')}
                options={ageGroups}
                value={value}
                onSelect={onChange}
                placeholder={i18n.t('select_age_group')}
                error={errors.age_group_id?.message}
                optional={true}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label={i18n.t('gender')}
                options={GENDER_OPTIONS}
                value={value}
                onSelect={onChange}
                placeholder={i18n.t('select_gender')}
                error={errors.gender?.message}
                optional={true}
              />
            )}
          />

          {citizenTypeKeys.length > 0 && (
            <Controller
              control={control}
              name="group_id"
              defaultValue={null}
              render={({ field: { onChange, value } }) => {
                const firstType = citizenTypeKeys[0];
                const groups = citizenGroupsByType[firstType] || [];

                return (
                  <Dropdown
                    label={i18n.t('group_id')}
                    options={groups}
                    value={value}
                    onSelect={onChange}
                    placeholder={i18n.t('select_option')}
                    error={errors.group_id?.message}
                    optional={true}
                  />
                );
              }}
            />
          )}

          {citizenTypeKeys.length > 1 && (
            <Controller
              control={control}
              name="group_2_id"
              defaultValue={null}
              render={({ field: { onChange, value } }) => {
                const secondType = citizenTypeKeys[1];
                const groups = citizenGroupsByType[secondType] || [];
                return (
                  <Dropdown
                    label={i18n.t('group_2_id')}
                    options={groups}
                    value={value}
                    onSelect={onChange}
                    placeholder={i18n.t('select_option')}
                    error={errors.group_2_id?.message}
                    optional={true}
                  />
                );
              }}
            />
          )}

          <View style={styles.buttonContainer}>
            <CustomButton
              backgroundColor={colors.primary || '#24c38b'}
              textColor="white"
              label={saving ? i18n.t('saving') : i18n.t('save_and_continue')}
              onPress={handleSubmit(onSubmit)}
              disabled={saving}
            />
          </View>
        </View>
      </ScrollView>
    </Provider>
  );
}

export default Profile;