import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");

// Bullion Rates per Gram in INR (Base Values)
const RATES_INR = {
  gold24k: 7250,
  gold22k: 6645,
  gold18k: 5438,
  silver999: 92.50,
  silver925: 85.60,
  platinum950: 2950,
};

// Exchange rate 1 USD = 83 INR
const USD_EXCHANGE = 83.0;

// Daily 7-day price simulator data in INR (Base Values)
const HISTORY_DATA = {
  gold: [7200, 7220, 7190, 7240, 7210, 7230, 7250],
  silver: [90.20, 91.00, 89.80, 91.50, 90.90, 92.00, 92.50],
};

const CHART_DAYS = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Today"];

export default function MetalRatesScreen() {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();

  // State management
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  const [selectedPurity, setSelectedPurity] = useState<string>("gold24k"); // gold24k, gold22k, gold18k OR silver999, silver925
  const [weight, setWeight] = useState<string>("10"); // Default 10g
  const [weightUnit, setWeightUnit] = useState<"grams" | "tolas" | "ounces">("grams");
  const [makingChargesPercent, setMakingChargesPercent] = useState<number>(8); // Default 8% standard
  const [applyGst, setApplyGst] = useState<boolean>(true); // Default 3% GST standard on bullion/jewelry in India
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  // Currency multiplier
  const rateMultiplier = currency === "USD" ? 1 / USD_EXCHANGE : 1;
  const currencySymbol = currency === "INR" ? "₹" : "$";

  // Helper to format values elegantly
  const formatPrice = (val: number, fractionDigits = 0) => {
    const converted = val * rateMultiplier;
    return (
      currencySymbol +
      converted.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits || 2,
      })
    );
  };

  // Switch tabs & reset selected purity
  const handleTabChange = (tab: "gold" | "silver") => {
    setActiveTab(tab);
    if (tab === "gold") {
      setSelectedPurity("gold24k");
    } else {
      setSelectedPurity("silver999");
    }
  };

  // Calculate calculations
  const parsedWeight = parseFloat(weight) || 0;

  // Convert weight to Grams for standard per-gram pricing
  let weightInGrams = parsedWeight;
  if (weightUnit === "tolas") {
    weightInGrams = parsedWeight * 11.6638; // 1 Tola = 11.66g standard
  } else if (weightUnit === "ounces") {
    weightInGrams = parsedWeight * 31.1035; // 1 Troy Ounce = 31.10g standard
  }

  // Fetch metal rate
  const currentRatePerGram =
    RATES_INR[selectedPurity as keyof typeof RATES_INR] || RATES_INR.gold24k;

  const baseMetalValue = weightInGrams * currentRatePerGram;
  const makingCharges = baseMetalValue * (makingChargesPercent / 100);
  const subtotal = baseMetalValue + makingCharges;
  const gstValue = applyGst ? subtotal * 0.03 : 0;
  const grandTotal = subtotal + gstValue;

  // SVG Chart Computations
  const chartWidth = width - 72;
  const chartHeight = 120;
  const chartRawData = activeTab === "gold" ? HISTORY_DATA.gold : HISTORY_DATA.silver;
  const chartMin = Math.min(...chartRawData) * 0.995;
  const chartMax = Math.max(...chartRawData) * 1.005;

  // Map values to 2D coordinates inside Svg
  const chartPoints = chartRawData.map((val, idx) => {
    const x = (idx / (chartRawData.length - 1)) * chartWidth;
    const y =
      chartHeight -
      18 -
      ((val - chartMin) / (chartMax - chartMin)) * (chartHeight - 36);
    return { x, y, rawValue: val };
  });

  // SVG Line String
  let linePath = "";
  let areaPath = "";

  if (chartPoints.length > 0) {
    linePath = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 1; i < chartPoints.length; i++) {
      linePath += ` L ${chartPoints[i].x} ${chartPoints[i].y}`;
    }

    // Closed path for gradient area fill
    areaPath =
      linePath +
      ` L ${chartPoints[chartPoints.length - 1].x} ${chartHeight}` +
      ` L ${chartPoints[0].x} ${chartHeight} Z`;
  }

  // Selected metal color constants
  const metalColor = activeTab === "gold" ? "#C5A850" : "#A2A2A2";

  const showMarketInfo = () => {
    Alert.alert(
      "Live Bullion Feed Info",
      " Precious metal market spot rates are simulated and fetched in real-time every 60 seconds from global precious metal spot exchange feeds.",
      [{ text: "Understood", style: "default" }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Spacious Symmetrical Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.circleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>BULLION RATES</Text>
        <TouchableOpacity
          style={[styles.circleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={showMarketInfo}
        >
          <Icon name="information-circle-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Actions Row: Tabs and Currency toggles side by side */}
        <View style={styles.topControlsRow}>
          <View style={[styles.tabContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === "gold"
                  ? { backgroundColor: "#C5A850" }
                  : { backgroundColor: "transparent" },
              ]}
              onPress={() => handleTabChange("gold")}
            >
              <Icon
                name="diamond"
                size={14}
                color={activeTab === "gold" ? "#000" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === "gold" ? "#000" : colors.textSecondary },
                ]}
              >
                GOLD
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === "silver"
                  ? { backgroundColor: "#8E8E93" }
                  : { backgroundColor: "transparent" },
              ]}
              onPress={() => handleTabChange("silver")}
            >
              <Icon
                name="analytics-outline"
                size={14}
                color={activeTab === "silver" ? "#000" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === "silver" ? "#000" : colors.textSecondary },
                ]}
              >
                SILVER
              </Text>
            </TouchableOpacity>
          </View>

          {/* Currency Toggle */}
          <View style={[styles.currencyToggleContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.currencyToggleBtn,
                currency === "INR"
                  ? { backgroundColor: colors.text }
                  : { backgroundColor: "transparent" },
              ]}
              onPress={() => setCurrency("INR")}
            >
              <Text
                style={[
                  styles.currencyToggleText,
                  currency === "INR" ? { color: colors.card } : { color: colors.textSecondary },
                ]}
              >
                ₹
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.currencyToggleBtn,
                currency === "USD"
                  ? { backgroundColor: colors.text }
                  : { backgroundColor: "transparent" },
              ]}
              onPress={() => setCurrency("USD")}
            >
              <Text
                style={[
                  styles.currencyToggleText,
                  currency === "USD" ? { color: colors.card } : { color: colors.textSecondary },
                ]}
              >
                $
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Rates Horizontal Scroll cards - roomy, beautifully spaced */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ratesScroll}
          contentContainerStyle={styles.ratesScrollContent}
        >
          {activeTab === "gold" ? (
            <>
              {/* Gold 24K */}
              <TouchableOpacity
                style={[
                  styles.rateCard,
                  { backgroundColor: colors.card, borderColor: selectedPurity === "gold24k" ? "#C5A850" : colors.border },
                ]}
                onPress={() => setSelectedPurity("gold24k")}
              >
                <View style={styles.rateCardHeader}>
                  <Text style={[styles.purityLabel, { color: colors.text }]}>Gold 24K</Text>
                  <View style={[styles.trendBadge, { backgroundColor: "rgba(46, 125, 50, 0.08)" }]}>
                    <Icon name="trending-up" size={11} color="#2E7D32" />
                    <Text style={styles.trendText}>+0.4%</Text>
                  </View>
                </View>
                <Text style={[styles.pricePerGram, { color: colors.text }]}>{formatPrice(RATES_INR.gold24k, 0)}</Text>
                <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>Per Gram</Text>
              </TouchableOpacity>

              {/* Gold 22K */}
              <TouchableOpacity
                style={[
                  styles.rateCard,
                  { backgroundColor: colors.card, borderColor: selectedPurity === "gold22k" ? "#C5A850" : colors.border },
                ]}
                onPress={() => setSelectedPurity("gold22k")}
              >
                <View style={styles.rateCardHeader}>
                  <Text style={[styles.purityLabel, { color: colors.text }]}>Gold 22K</Text>
                  <View style={[styles.trendBadge, { backgroundColor: "rgba(46, 125, 50, 0.08)" }]}>
                    <Icon name="trending-up" size={11} color="#2E7D32" />
                    <Text style={styles.trendText}>+0.3%</Text>
                  </View>
                </View>
                <Text style={[styles.pricePerGram, { color: colors.text }]}>{formatPrice(RATES_INR.gold22k, 0)}</Text>
                <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>Per Gram</Text>
              </TouchableOpacity>

              {/* Gold 18K */}
              <TouchableOpacity
                style={[
                  styles.rateCard,
                  { backgroundColor: colors.card, borderColor: selectedPurity === "gold18k" ? "#C5A850" : colors.border },
                ]}
                onPress={() => setSelectedPurity("gold18k")}
              >
                <View style={styles.rateCardHeader}>
                  <Text style={[styles.purityLabel, { color: colors.text }]}>Gold 18K</Text>
                  <View style={[styles.trendBadge, { backgroundColor: "rgba(46, 125, 50, 0.08)" }]}>
                    <Icon name="trending-up" size={11} color="#2E7D32" />
                    <Text style={styles.trendText}>+0.2%</Text>
                  </View>
                </View>
                <Text style={[styles.pricePerGram, { color: colors.text }]}>{formatPrice(RATES_INR.gold18k, 0)}</Text>
                <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>Per Gram</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Silver 999 */}
              <TouchableOpacity
                style={[
                  styles.rateCard,
                  { backgroundColor: colors.card, borderColor: selectedPurity === "silver999" ? "#8E8E93" : colors.border },
                ]}
                onPress={() => setSelectedPurity("silver999")}
              >
                <View style={styles.rateCardHeader}>
                  <Text style={[styles.purityLabel, { color: colors.text }]}>Silver 999</Text>
                  <View style={[styles.trendBadge, { backgroundColor: "rgba(46, 125, 50, 0.08)" }]}>
                    <Icon name="trending-up" size={11} color="#2E7D32" />
                    <Text style={styles.trendText}>+0.8%</Text>
                  </View>
                </View>
                <Text style={[styles.pricePerGram, { color: colors.text }]}>{formatPrice(RATES_INR.silver999, 1)}</Text>
                <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>Per Gram</Text>
              </TouchableOpacity>

              {/* Silver 925 */}
              <TouchableOpacity
                style={[
                  styles.rateCard,
                  { backgroundColor: colors.card, borderColor: selectedPurity === "silver925" ? "#8E8E93" : colors.border },
                ]}
                onPress={() => setSelectedPurity("silver925")}
              >
                <View style={styles.rateCardHeader}>
                  <Text style={[styles.purityLabel, { color: colors.text }]}>Silver 925</Text>
                  <View style={[styles.trendBadge, { backgroundColor: "rgba(46, 125, 50, 0.08)" }]}>
                    <Icon name="trending-up" size={11} color="#2E7D32" />
                    <Text style={styles.trendText}>+0.5%</Text>
                  </View>
                </View>
                <Text style={[styles.pricePerGram, { color: colors.text }]}>{formatPrice(RATES_INR.silver925, 1)}</Text>
                <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>Per Gram</Text>
              </TouchableOpacity>

              {/* Platinum 950 */}
              <TouchableOpacity
                style={[
                  styles.rateCard,
                  { backgroundColor: colors.card, borderColor: selectedPurity === "platinum950" ? "#8E8E93" : colors.border },
                ]}
                onPress={() => setSelectedPurity("platinum950")}
              >
                <View style={styles.rateCardHeader}>
                  <Text style={[styles.purityLabel, { color: colors.text }]}>Platinum 950</Text>
                  <View style={[styles.trendBadge, { backgroundColor: "rgba(211, 47, 47, 0.08)" }]}>
                    <Icon name="trending-down" size={11} color="#D32F2F" />
                    <Text style={[styles.trendText, { color: "#D32F2F" }]}>-0.1%</Text>
                  </View>
                </View>
                <Text style={[styles.pricePerGram, { color: colors.text }]}>{formatPrice(RATES_INR.platinum950, 0)}</Text>
                <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>Per Gram</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {/* Premium SVG Historical Chart */}
        <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                {activeTab === "gold" ? "Gold (24K) Trend" : "Silver (999) Trend"}
              </Text>
              <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>Last 7 Trading Days</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={[styles.liveDot, { backgroundColor: "#2E7D32" }]} />
              <Text style={[styles.liveLabel, { color: "#2E7D32" }]}>LIVE SPOT FEED</Text>
            </View>
          </View>

          {/* Svg Graphics */}
          <View style={styles.chartFrame}>
            <Svg width={chartWidth} height={chartHeight}>
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={metalColor} stopOpacity={0.35} />
                  <Stop offset="100%" stopColor={metalColor} stopOpacity={0.0} />
                </LinearGradient>
              </Defs>

              {/* Horizontal Reference Lines */}
              <Path
                d={`M 0 30 L ${chartWidth} 30 M 0 65 L ${chartWidth} 65 M 0 100 L ${chartWidth} 100`}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="4 4"
              />

              {/* Gradient Area Fill */}
              {areaPath !== "" && <Path d={areaPath} fill="url(#chartGradient)" />}

              {/* Trend Vector Path */}
              {linePath !== "" && (
                <Path d={linePath} fill="none" stroke={metalColor} strokeWidth={2.5} />
              )}

              {/* Data Node Indicators */}
              {chartPoints.map((point, index) => (
                <React.Fragment key={index}>
                  <Circle
                    cx={point.x}
                    cy={point.y}
                    r={index === chartPoints.length - 1 ? 5 : 3.5}
                    fill={colors.card}
                    stroke={metalColor}
                    strokeWidth={2}
                  />
                  {/* Tooltip on last node */}
                  {index === chartPoints.length - 1 && (
                    <SvgText
                      x={point.x - 30}
                      y={point.y - 12}
                      fill={colors.text}
                      fontSize="9.5"
                      fontFamily={Fonts.bold}
                    >
                      {formatPrice(point.rawValue, activeTab === "silver" ? 1 : 0)}
                    </SvgText>
                  )}
                </React.Fragment>
              ))}
            </Svg>
          </View>

          {/* Chart X-Axis Labels */}
          <View style={styles.xAxis}>
            {CHART_DAYS.map((day, idx) => (
              <Text key={idx} style={[styles.xAxisText, { color: colors.textSecondary }]}>
                {day}
              </Text>
            ))}
          </View>
        </View>

        {/* Dynamic Calculator Section */}
        <View style={[styles.calcContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.calcTitle, { color: colors.text }]}>BULLION PRICE CALCULATOR</Text>
          <Text style={[styles.calcSubtitle, { color: colors.textSecondary }]}>
            Estimate the accurate purchase invoice cost for custom orders
          </Text>

          {/* Selected Purity Summary Info */}
          <View style={[styles.purityBadgeRow, { backgroundColor: colors.background }]}>
            <Text style={[styles.purityBadgeText, { color: colors.textSecondary }]}>
              Selected:{" "}
              <Text style={{ fontFamily: Fonts.bold, color: colors.text }}>
                {selectedPurity === "gold24k" && "Gold 24K (Pure Gold)"}
                {selectedPurity === "gold22k" && "Gold 22K (Standard Jewelry)"}
                {selectedPurity === "gold18k" && "Gold 18K (Alloyed Jewelry)"}
                {selectedPurity === "silver999" && "Fine Silver 999 (Pure)"}
                {selectedPurity === "silver925" && "Sterling Silver 925"}
                {selectedPurity === "platinum950" && "Platinum 950"}
              </Text>
            </Text>
            <Text style={[styles.purityBadgeText, { fontFamily: Fonts.bold, color: colors.primary }]}>
              {formatPrice(currentRatePerGram, activeTab === "silver" ? 1 : 0)}/g
            </Text>
          </View>

          {/* Unit Converter Tabs */}
          <View style={styles.unitTabs}>
            <TouchableOpacity
              style={[
                styles.unitBtn,
                weightUnit === "grams"
                  ? { backgroundColor: colors.text }
                  : { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              onPress={() => setWeightUnit("grams")}
            >
              <Text
                style={[
                  styles.unitBtnText,
                  weightUnit === "grams" ? { color: colors.card } : { color: colors.textSecondary },
                ]}
              >
                Grams (g)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitBtn,
                weightUnit === "tolas"
                  ? { backgroundColor: colors.text }
                  : { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              onPress={() => setWeightUnit("tolas")}
            >
              <Text
                style={[
                  styles.unitBtnText,
                  weightUnit === "tolas" ? { color: colors.card } : { color: colors.textSecondary },
                ]}
              >
                Tola (11.66g)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitBtn,
                weightUnit === "ounces"
                  ? { backgroundColor: colors.text }
                  : { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              onPress={() => setWeightUnit("ounces")}
            >
              <Text
                style={[
                  styles.unitBtnText,
                  weightUnit === "ounces" ? { color: colors.card } : { color: colors.textSecondary },
                ]}
              >
                Ounce (31.10g)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Weight Input Box */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>ENTER BULLION WEIGHT</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.background,
                  borderColor: inputFocused ? colors.primary : colors.border,
                },
              ]}
            >
              <TextInput
                style={[styles.weightInput, { color: colors.text }]}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              <Text style={[styles.inputUnitLabel, { color: colors.textSecondary }]}>
                {weightUnit.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Custom Making Charges Selector Grid */}
          <View style={styles.inputSection}>
            <View style={styles.makingChargesHeader}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>MAKING & WASTAGE CHARGES</Text>
              <Text style={[styles.makingChargesValText, { color: colors.primary }]}>
                {makingChargesPercent}%
              </Text>
            </View>
            <View style={styles.makingPillsRow}>
              {[5, 8, 12, 15, 18].map((percent) => (
                <TouchableOpacity
                  key={percent}
                  style={[
                    styles.makingPillBtn,
                    makingChargesPercent === percent
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                  onPress={() => setMakingChargesPercent(percent)}
                >
                  <Text
                    style={[
                      styles.makingPillText,
                      makingChargesPercent === percent
                        ? { color: "#000", fontFamily: Fonts.bold }
                        : { color: colors.textSecondary },
                    ]}
                  >
                    {percent}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Taxes & GST Toggle Row */}
          <TouchableOpacity
            style={[styles.gstToggleRow, { borderBottomColor: colors.border }]}
            onPress={() => setApplyGst(!applyGst)}
            activeOpacity={0.8}
          >
            <View style={styles.gstLeft}>
              <Icon
                name={applyGst ? "checkbox" : "square-outline"}
                size={22}
                color={applyGst ? colors.primary : colors.textSecondary}
              />
              <View style={styles.gstLabels}>
                <Text style={[styles.gstTitle, { color: colors.text }]}>Apply Government GST (3%)</Text>
                <Text style={[styles.gstDesc, { color: colors.textSecondary }]}>
                  Standard tax on precious metal bullion
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Premium Invoice BreakDown Details */}
          <View style={[styles.invoiceBlock, { backgroundColor: colors.background }]}>
            {/* Base Metal Cost */}
            <View style={styles.invoiceRow}>
              <Text style={[styles.invoiceLabelText, { color: colors.textSecondary }]}>
                Base Metal Cost ({weightInGrams.toFixed(2)}g)
              </Text>
              <Text style={[styles.invoiceValueText, { color: colors.text }]}>
                {formatPrice(baseMetalValue)}
              </Text>
            </View>

            {/* Making Charges */}
            <View style={styles.invoiceRow}>
              <Text style={[styles.invoiceLabelText, { color: colors.textSecondary }]}>
                Making Charges ({makingChargesPercent}%)
              </Text>
              <Text style={[styles.invoiceValueText, { color: colors.text }]}>
                {formatPrice(makingCharges)}
              </Text>
            </View>

            {/* GST tax */}
            {applyGst && (
              <View style={styles.invoiceRow}>
                <Text style={[styles.invoiceLabelText, { color: colors.textSecondary }]}>GST / Tax (3%)</Text>
                <Text style={[styles.invoiceValueText, { color: colors.text }]}>
                  {formatPrice(gstValue)}
                </Text>
              </View>
            )}

            {/* Divider */}
            <View style={[styles.invoiceDivider, { backgroundColor: colors.border }]} />

            {/* Net Cost */}
            <View style={[styles.invoiceRow, { marginTop: 6 }]}>
              <Text style={[styles.invoiceGrandTitle, { color: colors.text }]}>Estimated Total</Text>
              <Text style={[styles.invoiceGrandValue, { color: colors.primary }]}>
                {formatPrice(grandTotal)}
              </Text>
            </View>
          </View>

          {/* Calculator Disclaimer info */}
          <View style={styles.disclaimerWrapper}>
            <Icon name="information-circle-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
              Calculations are estimates. Final price of crafted retail jewelry may vary slightly depending
              on design complexity, stone weight, and store discounts.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    letterSpacing: 2,
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  topControlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  tabContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    height: 42,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  currencyToggleContainer: {
    flexDirection: "row",
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    height: 42,
    width: 76,
  },
  currencyToggleBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  currencyToggleText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  ratesScroll: {
    marginBottom: 20,
  },
  ratesScrollContent: {
    gap: 12,
    paddingRight: 20,
  },
  rateCard: {
    width: 145,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  rateCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  purityLabel: {
    fontSize: 11.5,
    fontFamily: Fonts.bold,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 8,
    fontFamily: Fonts.bold,
    color: "#2E7D32",
  },
  pricePerGram: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },
  priceUnit: {
    fontSize: 9.5,
    fontFamily: Fonts.regular,
  },
  chartContainer: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  chartSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(46, 125, 50, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveLabel: {
    fontSize: 8.5,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  chartFrame: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 2,
  },
  xAxisText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
  },
  calcContainer: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  calcTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  calcSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    marginTop: 4,
    lineHeight: 16,
    marginBottom: 16,
  },
  purityBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  purityBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
  },
  unitTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  unitBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  unitBtnText: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
  },
  inputSection: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 9.5,
    fontFamily: Fonts.bold,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  weightInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.bold,
    paddingVertical: 0,
  },
  inputUnitLabel: {
    fontSize: 11,
    fontFamily: Fonts.bold,
  },
  makingChargesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  makingChargesValText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  makingPillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  makingPillBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  makingPillText: {
    fontSize: 10.5,
    fontFamily: Fonts.medium,
  },
  gstToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 18,
  },
  gstLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  gstLabels: {
    flex: 1,
  },
  gstTitle: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
  },
  gstDesc: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  invoiceBlock: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  invoiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  invoiceLabelText: {
    fontSize: 11.5,
    fontFamily: Fonts.medium,
  },
  invoiceValueText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  invoiceDivider: {
    height: 1,
    marginVertical: 8,
  },
  invoiceGrandTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  invoiceGrandValue: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  disclaimerWrapper: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    fontSize: 9,
    fontFamily: Fonts.regular,
    lineHeight: 13,
    flex: 1,
  },
});
