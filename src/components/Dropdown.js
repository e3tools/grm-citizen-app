import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import {i18n} from "../translations/i18n";

const Dropdown = ({ 
  label, 
  options = [], 
  value, 
  onSelect, 
  placeholder = "Select an option",
  error,
  optional
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => {
    if (typeof option === 'object' && option.id) {
      return option.id === value;
    }
    return option === value;
  });

  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.name : selectedOption)
    : '';

  const handleSelect = (option) => {
    const optionValue = typeof option === 'object' && option.id ? option.id : option;
    onSelect(optionValue);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {label && <Text style={styles.label}>{label}</Text>}
        { optional ?
            (
                <Text style={{color: colors.secondary}}>{i18n.t('optional')}</Text>
            )
         :
            null
        }
      </View>
      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.inputLabel}>
          <Text style={[styles.dropdownText, !displayValue && styles.placeholder]}>
            {displayValue || placeholder}
          </Text>
        </View>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => {
                if (typeof item === 'object' && item.id) {
                  return item.id.toString();
                }
                return index.toString();
              }}
              renderItem={({ item }) => {
                const itemValue = typeof item === 'object' && item.id ? item.id : item;
                const itemLabel = typeof item === 'object' ? item.name : item;
                const isSelected = itemValue === value;
                
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.selectedOption]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                      {itemLabel}
                    </Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.lightgray || '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white || '#FFFFFF',
    minHeight: 48,
  },
  dropdownError: {
    borderColor: '#DC2626',
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: colors.darkGrey || '#333333',
    fontFamily: 'Poppins_400Regular',
  },
  placeholder: {
    color: colors.secondary || '#999999',
  },
  arrow: {
    fontSize: 12,
    color: colors.secondary || '#999999',
    marginLeft: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#F0F7FF',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Poppins_400Regular',
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary || '#24c38b',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 16,
    color: colors.primary || '#24c38b',
    marginLeft: 8,
  },
});

export default Dropdown;

