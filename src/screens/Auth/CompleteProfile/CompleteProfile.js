import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Provider } from 'react-native-paper';
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
import styles from './CompleteProfile.style';

const GENDER_OPTIONS = [
  { id: 'male', name: i18n.t('male') },
  { id: 'female', name: i18n.t('female') },
  { id: 'other', name: i18n.t('other') },
];

function CompleteProfile() {
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
  } = useForm({
    defaultValues: {
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

      if (profile && profile.group?.id) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
      }

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
          <Text style={styles.subtitle}>{i18n.t('complete_profile_subtitle')}</Text>

          {/* Age Group Dropdown */}
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

          {/* Gender Dropdown */}
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

          {/* Citizen Type 1 Dropdown */}
          {citizenTypeKeys.length > 0 && (
            <Controller
              control={control}
              name="group_id"
              defaultValue={null}
              render={({ field: { onChange, value } }) => {
                // Get groups for the first type
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

          {/* Citizen Type 2 Dropdown */}
          {citizenTypeKeys.length > 1 && (
            <Controller
              control={control}
              name="group_2_id"
              defaultValue={null}
              render={({ field: { onChange, value } }) => {
                // Get groups for the second type
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

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              backgroundColor={colors.primary || '#24c38b'}
              textColor="white"
              label={saving ? i18n.t('saving') : i18n.t('save_and_continue')}
              onPress={handleSubmit(onSubmit)}
            />
            <Text
              style={styles.loginLink}
              onPress={handleSkip}
            >
              {i18n.t('skip')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Provider>
  );
}

export default CompleteProfile;

