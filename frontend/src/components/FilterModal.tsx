import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FilterState {
  sortBy: string;
  minPrice: string;
  maxPrice: string;
  materials: string[];
  genders: string[];
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
];

const MATERIAL_OPTIONS = ['Gold', 'Silver', 'Platinum', 'Diamond'];
const GENDER_OPTIONS = ['Men', 'Women', 'Unisex'];

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleSelection = (list: string[], item: string) => {
    if (list.includes(item)) {
      return list.filter((i) => i !== item);
    }
    return [...list, item];
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClearAll = () => {
    setFilters({
      sortBy: 'newest',
      minPrice: '',
      maxPrice: '',
      materials: [],
      genders: [],
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Sort By Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionsRow}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.pill,
                      filters.sortBy === option.id && styles.pillActive,
                    ]}
                    onPress={() => setFilters({ ...filters, sortBy: option.id })}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        filters.sortBy === option.id && styles.pillTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currency}>₹</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Min"
                    keyboardType="numeric"
                    value={filters.minPrice}
                    onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
                  />
                </View>
                <View style={styles.priceSeparator} />
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currency}>₹</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Max"
                    keyboardType="numeric"
                    value={filters.maxPrice}
                    onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
                  />
                </View>
              </View>
            </View>

            {/* Material Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Material</Text>
              <View style={styles.optionsRow}>
                {MATERIAL_OPTIONS.map((material) => (
                  <TouchableOpacity
                    key={material}
                    style={[
                      styles.pill,
                      filters.materials.includes(material) && styles.pillActive,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        materials: toggleSelection(filters.materials, material),
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.pillText,
                        filters.materials.includes(material) && styles.pillTextActive,
                      ]}
                    >
                      {material}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Gender Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gender</Text>
              <View style={styles.optionsRow}>
                {GENDER_OPTIONS.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.pill,
                      filters.genders.includes(gender) && styles.pillActive,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        genders: toggleSelection(filters.genders, gender),
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.pillText,
                        filters.genders.includes(gender) && styles.pillTextActive,
                      ]}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '80%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1A1A1A',
  },
  clearText: {
    fontSize: 14,
    color: '#D4AF37',
    fontFamily: 'Poppins_600SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  pillActive: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  pillText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins_500Medium',
  },
  pillTextActive: {
    color: '#D4AF37',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  priceInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  currency: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Poppins_400Regular',
  },
  priceSeparator: {
    width: 10,
    height: 1,
    backgroundColor: '#DDD',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  applyButton: {
    backgroundColor: '#D4AF37',
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
});
