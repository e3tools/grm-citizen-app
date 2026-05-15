import {IconSymbol} from '@/components/ui/icon-symbol'
import React, {useState} from 'react'
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {i18n} from '../translations/i18n'
import {colors} from '../utils/colors'

const Dropdown = ({
  label,
  options = [],
  value,
  onSelect,
  placeholder = 'Select an option',
  error,
  optional,
  customOptionLabel = 'name',
  enableSearch = true,
  loading = false,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [searchText, setSearchText] = useState('')

  const selectedOption = options.find(option => {
    if (typeof option === 'object' && option.id) {
      return option.id === value
    }
    return option === value
  })

  const displayValue = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.name
      : selectedOption
    : ''

  const filteredOptions = !loading
    ? enableSearch
      ? options.filter(option => {
          const label = typeof option === 'object' ? option.name : option
          return label.toLowerCase().includes(searchText.toLowerCase())
        })
      : options
    : []

  const handleSelect = option => {
    const optionValue =
      typeof option === 'object' && option.id ? option.id : option
    onSelect(optionValue)
    setIsVisible(false)
    setSearchText('')
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {label && <Text style={styles.label}>{label}</Text>}
        {optional ? (
          <Text style={{color: colors.secondary}}>{i18n.t('optional')}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={() => {
          setIsVisible(true)
          setSearchText('')
        }}
      >
        <View style={styles.inputLabel}>
          <Text
            style={[styles.dropdownText, !displayValue && styles.placeholder]}
          >
            {displayValue || placeholder}
          </Text>
        </View>
        <IconSymbol
          name={'chevron.right'}
          size={20}
          color={colors.darkGrey}
          style={{transform: [{rotate: isVisible ? '0deg' : '90deg'}]}}
        />
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
          <View
            style={[styles.modalContent, {marginBottom: 0, paddingVertical: 0}]}
          >
            {enableSearch && (
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
              </View>
            ) : (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item, index) => {
                  if (typeof item === 'object' && item.id) {
                    return item.id.toString()
                  }
                  return index.toString()
                }}
                renderItem={({item}) => {
                  const itemValue =
                    typeof item === 'object' && item.id ? item.id : item
                  const itemLabel =
                    typeof item === 'object'
                      ? (item[customOptionLabel] ?? item.name)
                      : item
                  const isSelected = itemValue === value

                  return (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {itemLabel}
                      </Text>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  )
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
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
  loadingContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    borderColor: colors.primary,
    borderTopEndRadius: 8,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 0,
    borderWidth: 3,
    marginHorizontal: 0,
    marginVertical: 0,
    padding: 0,
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
})

export default Dropdown
