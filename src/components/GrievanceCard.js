import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/colors';
import {i18n} from "../translations/i18n";

const GrievanceCard = ({ issue }) => {
  // Map status to colors and display text
  const getStatusInfo = (status) => {
    const statusMap = {
      'submitted': { color: '#dee9fc', textColor: '#314aad', text: i18n.t('submitted') },
      'in_progress': { color: '#fdf9c9', textColor: '#875d2c', text: i18n.t('in_progress') },
      'resolved': { color: '#e2fbe8', textColor: '#4ca055', text: i18n.t('resolved') },
    };
    
    return statusMap[status?.name?.toLowerCase()] || statusMap['submitted'];
  };

  // Map category to icons and colors
  const getCategoryInfo = (category) => {
    const categoryMap = {
      'grievance': { icon: 'alert-octagon', color: '#f9e3e2', textColor: '#ca3a31' },
      'feedback': { icon: 'message-circle', color: '#dee9fc', textColor: '#3662e2' },
      'question': { icon: 'help-circle', color: '#e2fbe8', textColor: '#4ca055' }
    };
    
    return categoryMap[category] || categoryMap['grievance'];
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusInfo = getStatusInfo(issue.status);
  const categoryInfo = getCategoryInfo((issue.issue_type.name).toLowerCase());

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: categoryInfo.color }]}>
            <Feather 
              name={categoryInfo.icon} 
              size={20} 
              color={categoryInfo.textColor}
            />
          </View>
          <View style={styles.textSection}>
            <Text style={styles.title} numberOfLines={2}>
              {issue.tracking_code || 'Untitled Issue'}
            </Text>
            <Text style={styles.subtitle}>
              { i18n.t(issue.issue_type.name.toLowerCase())}
            </Text>
            <Text style={styles.date}>
              {formatDate(issue.intake_date)}
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={[styles.statusTag, { backgroundColor: statusInfo.color }]}>
            <Text style={[styles.statusText, { color: statusInfo.textColor }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
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
    padding: 16,
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default GrievanceCard;
