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
import { isArabic } from "@/lib/textUtils";

registerPdfFonts();
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Tajawal" },
  arabicText: {
    fontFamily: "Tajawal",
    textAlign: "right",
    direction: "rtl",
  },
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
  cellText: { textAlign: "left" },
  headerText: {
    fontFamily: "Helvetica-Bold",
    color: "#444",
    textAlign: "left",
    padding: 2,
  },
  summary: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 2,
    borderColor: "#aaa",
    alignSelf: "flex-start",
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: { color: "#555" },
  summaryValue: { fontFamily: "Helvetica-Bold" },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: "#aaa",
  },
  summaryTotalLabel: { fontFamily: "Helvetica-Bold", fontSize: 13 },
  summaryTotalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
  },
});

export const GlobalPdfTemplate = () => {
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const calculateTotalGlobally = useRecordStore(
    (state) => state.calculateTotalGlobally,
  );
  const storeRecords = useRecordStore((state) => state.records);

  const recordsFilteredByCurrency = useMemo(
    () => getRecordsFilteredByCurrency(selectedCurrency, storeRecords),
    [selectedCurrency, storeRecords],
  );
  const recordsToDisplay = recordsFilteredByCurrency
    .toReversed()
    .map((record) => {
      const total = calculateTotalForPersonRecords(record.records);
      return {
        id: record.name,
        name: record.name,
        recordsCount: record.records.length,
        total,
        direction: total >= 0 ? MoneyDirection.ON : MoneyDirection.TO,
      };
    })
    .filter((r) => r.recordsCount !== 0);
  const initialized = useAppStore((state) => state.initialized);
  const calculationObject = initialized
    ? calculateTotalGlobally(selectedCurrency)
    : undefined;
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>
          Global transactions in {selectedCurrency.toLocaleUpperCase()}
        </Text>
        <View style={styles.table}>
          {/* Header row */}
          <View style={[styles.row, styles.headerRow]}>
            {["Name", "Records", "Total", "Currency"].map((h) => (
              <View key={h} style={styles.cell}>
                <Text style={styles.headerText}>{h}</Text>
              </View>
            ))}
          </View>

          {/* Data rows */}
          {recordsToDisplay.map((record) => (
            <View style={styles.row} key={record.name}>
              <View style={styles.cell}>
                <Text
                  style={
                    isArabic(record.name) ? styles.arabicText : styles.cellText
                  }
                >
                  {record.name}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>{record.recordsCount}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>{formatMoney(record.total)}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>
                  {selectedCurrency.toUpperCase()}
                </Text>
              </View>
              {/* <View style={styles.cell}>
                <Text style={styles.cellText}>{record.direction}</Text>
              </View> */}
            </View>
          ))}
        </View>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You are owed</Text>
            <Text style={styles.summaryValue}>
              {calculationObject?.totalOnThem
                ? formatMoney(calculationObject.totalOnThem)
                : 0}{" "}
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {selectedCurrency.toLocaleUpperCase()}
              </Text>
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You owe</Text>
            <Text style={styles.summaryValue}>
              {calculationObject?.totalToThem
                ? formatMoney(calculationObject.totalToThem)
                : 0}{" "}
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {selectedCurrency.toLocaleUpperCase()}
              </Text>
            </Text>
          </View>

          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>
              {calculationObject?.direction === MoneyDirection.TO
                ? "Net you owe"
                : "Net you're owed"}
            </Text>
            <Text
              style={[
                styles.summaryTotalValue,
                {
                  color:
                    calculationObject?.direction === MoneyDirection.TO
                      ? "#c0392b"
                      : "#27ae60",
                },
              ]}
            >
              {calculationObject?.total
                ? `${formatMoney(calculationObject.total)} `
                : 0}
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {selectedCurrency.toLocaleUpperCase()}
              </Text>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
