import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    category: "Ordering",
    questions: [
      { q: "How do I track my order?", a: "You can track your order in the 'Orders' section of your profile. Once shipped, you will receive a tracking ID via email and push notification." },
      { q: "Can I cancel my order?", a: "Orders can only be cancelled within 2 hours of placement. After that, the processing for your custom piece usually begins." },
    ]
  },
  {
    category: "Delivery",
    questions: [
      { q: "What are the shipping charges?", a: "We offer free insured shipping on all orders above ₹5,000 within India." },
      { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries. International shipping rates vary by location and are calculated at checkout." },
    ]
  },
  {
    category: "Returns",
    questions: [
      { q: "What is your return policy?", a: "We offer a 30-day 'No Questions Asked' return policy for all standard jewelry. Custom-made pieces are not eligible for returns." },
      { q: "How do I initiate a return?", a: "Go to 'Order History', select the item you wish to return, and click 'Request Return'. Our team will contact you for pickup." },
    ]
  }
];

const HelpCenterScreen = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === id ? null : id);
  };

  const categories = ['All', ...FAQ_DATA.map(item => item.category)];

  const filteredFaqs = FAQ_DATA.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  ).map(categoryItem => ({
    ...categoryItem,
    questions: categoryItem.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(categoryItem => categoryItem.questions.length > 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>HELP CENTER</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search for help..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                { backgroundColor: activeCategory === cat ? colors.primary : colors.card },
                activeCategory === cat && styles.activeChip
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[
                styles.chipText,
                { color: activeCategory === cat ? '#FFF' : colors.textSecondary }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ Accordion */}
        <View style={styles.faqContainer}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((catItem, cIdx) => (
              <View key={catItem.category} style={styles.categoryBlock}>
                <Text style={[styles.categoryTitle, { color: colors.primary }]}>{catItem.category}</Text>
                {catItem.questions.map((faq, qIdx) => {
                  const id = `${cIdx}-${qIdx}`;
                  const isExpanded = expandedIndex === id;
                  return (
                    <TouchableOpacity
                      key={id}
                      style={[styles.faqItem, { backgroundColor: colors.card }]}
                      onPress={() => toggleExpand(id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.faqHeader}>
                        <Text style={[styles.question, { color: colors.text }]}>{faq.q}</Text>
                        <Ionicons 
                          name={isExpanded ? "chevron-up" : "chevron-down"} 
                          size={18} 
                          color={colors.textSecondary} 
                        />
                      </View>
                      {isExpanded && (
                        <Text style={[styles.answer, { color: colors.textSecondary }]}>{faq.a}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          ) : (
            <View style={styles.noResults}>
               <Ionicons name="help-circle-outline" size={60} color={colors.border} />
               <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>No matching FAQs found.</Text>
            </View>
          )}
        </View>

        {/* Contact Support */}
        <View style={styles.contactSection}>
           <Text style={[styles.contactTitle, { color: colors.text }]}>Still need help?</Text>
           <Text style={[styles.contactSub, { color: colors.textSecondary }]}>Our specialists are available 24/7</Text>
           
           <View style={styles.contactButtons}>
              <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.primary }]}>
                 <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" />
                 <Text style={styles.contactBtnText}>Live Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.text }]}>
                 <Ionicons name="call-outline" size={20} color={colors.card} />
                 <Text style={[styles.contactBtnText, { color: colors.card }]}>Call Us</Text>
              </TouchableOpacity>
           </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpCenterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 2,
  },
  content: {
    padding: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  chipScroll: {
    marginBottom: 25,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeChip: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
  },
  faqContainer: {
    marginBottom: 30,
  },
  categoryBlock: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  faqItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    paddingRight: 15,
  },
  answer: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },
  noResults: {
    alignItems: 'center',
    marginTop: 40,
  },
  noResultsText: {
    marginTop: 15,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  contactSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  contactTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  contactSub: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
    marginBottom: 20,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#FFF',
  },
});
