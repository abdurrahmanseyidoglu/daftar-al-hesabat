import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useRecordStore } from "../../stores/recordStore";
import { MoneyDirection } from "../../types/enums";
import { useAppStore } from "../../stores/appStore";
import {
  calculateTotalForPersonRecords,
  formatMoney,
  getRecordsFilteredByCurrency,
} from "@/lib/utils";
import { useMemo } from "react";
import { registerPdfFonts } from "@/lib/pdfFonts";

registerPdfFonts();

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Tajawal" },
  title: { fontSize: 20, marginBottom: 20 },
  table: { width: "100%" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 6,
  },
  headerRow: { backgroundColor: "silver" },
  cell: { flex: 1 },
  headerText: {
    fontFamily: "Tajawal",
    color: "#444",
    padding: 2,
  },

  summary: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 2,
    borderColor: "#aaa",
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: { color: "#555" },
  summaryValue: { fontFamily: "Tajawal" },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: "#aaa",
  },
  summaryTotalLabel: { fontFamily: "Tajawal", fontSize: 13 },
  summaryTotalValue: { fontFamily: "Tajawal", fontSize: 13 },
});

interface PDFTranslations {
  title: string;
  name: string;
  records: string;
  total: string;
  currency: string;
  youOwed: string;
  youOwe: string;
  netYouOwe: string;
  netYouOwed: string;
}

type Props = {
  translations: PDFTranslations;
  direction: "rtl" | "ltr";
};

export const GlobalPdfTemplate = ({ translations, direction }: Props) => {
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const calculateTotalGlobally = useRecordStore(
    (state) => state.calculateTotalGlobally,
  );
  const storeRecords = useRecordStore((state) => state.records);
  const initialized = useAppStore((state) => state.initialized);

  const recordsFilteredByCurrency = useMemo(
    () => getRecordsFilteredByCurrency(selectedCurrency, storeRecords),
    [selectedCurrency, storeRecords],
  );

  const recordsToDisplay = useMemo(
    () =>
      recordsFilteredByCurrency
        .toReversed()
        .map((record) => {
          const total = calculateTotalForPersonRecords(record.records);
          return {
            name: record.name,
            recordsCount: record.records.length,
            total,
            moneyDirection: total >= 0 ? MoneyDirection.ON : MoneyDirection.TO,
          };
        })
        .filter((r) => r.recordsCount !== 0),
    [recordsFilteredByCurrency],
  );

  const calculationObject = initialized
    ? calculateTotalGlobally(selectedCurrency)
    : undefined;

  const isRTL = direction === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const summarySide = isRTL ? "flex-end" : "flex-start";

  const currencyLabel = selectedCurrency.toUpperCase();

  const netLabel =
    calculationObject?.direction === MoneyDirection.TO
      ? translations.netYouOwe
      : translations.netYouOwed;

  const totalOnThemDisplay = formatMoney(calculationObject?.totalOnThem ?? 0);
  const totalToThemDisplay = formatMoney(calculationObject?.totalToThem ?? 0);
  const netTotalDisplay = formatMoney(calculationObject?.total ?? 0);

  const netTotalColor =
    calculationObject?.direction === MoneyDirection.TO ? "#c0392b" : "#27ae60";

  const headerLabels = [
    translations.name,
    translations.records,
    translations.total,
    translations.currency,
  ];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Title */}
        <Text style={[styles.title, { direction, textAlign }]}>
          {translations.title} — {currencyLabel}
        </Text>

        {/* Table */}
        <View style={[styles.table, { direction }]}>
          <View style={[styles.row, styles.headerRow]}>
            {headerLabels.map((label) => (
              <View key={label} style={styles.cell}>
                <Text style={[styles.headerText, { textAlign }]}>{label}</Text>
              </View>
            ))}
          </View>

          {recordsToDisplay.map((record) => (
            <View style={styles.row} key={record.name}>
              <View style={styles.cell}>
                <Text style={{ textAlign }}>{record.name}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={{ textAlign }}>{record.recordsCount}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={{ textAlign }}>{formatMoney(record.total)}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={{ textAlign }}>{currencyLabel}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={[styles.summary, { alignSelf: summarySide, direction }]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{translations.youOwed}</Text>
            <Text style={styles.summaryValue}>
              {totalOnThemDisplay} {currencyLabel}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{translations.youOwe}</Text>
            <Text style={styles.summaryValue}>
              {totalToThemDisplay} {currencyLabel}
            </Text>
          </View>

          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>{netLabel}</Text>
            <Text style={[styles.summaryTotalValue, { color: netTotalColor }]}>
              {netTotalDisplay} {currencyLabel}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
