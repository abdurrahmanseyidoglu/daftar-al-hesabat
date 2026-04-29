import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useRecordStore } from "../../stores/recordStore";
import { MoneyDirection } from "../../types/enums";
import { useAppStore } from "../../stores/appStore";
import { formatDate, formatMoney } from "@/lib/utils";
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
  cellText: {
    fontFamily: "Tajawal",
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
  date: string;
  amount: string;
  currency: string;
  details: string;
  youOwed: string;
  youOwe: string;
  netYouOwe: string;
  netYouOwed: string;
}

type Props = {
  translations: PDFTranslations;
  direction: "rtl" | "ltr";
};

export const PersonalPdfTemplate = ({ translations, direction }: Props) => {
  const selectedRecordArray = useRecordStore(
    (state) => state.selectedRecordArray,
  );
  const recordsOwner = selectedRecordArray?.name ?? "";
  const records = selectedRecordArray?.records;
  const decodedRecordsOwner = decodeURI(recordsOwner);

  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const calculateTotalPerPerson = useRecordStore(
    (state) => state.calculateTotalPerPerson,
  );
  const initialized = useAppStore((state) => state.initialized);

  const calculationObject = initialized
    ? calculateTotalPerPerson(decodedRecordsOwner, selectedCurrency)
    : undefined;

  const recordsToDisplay = records?.toReversed().map((record) => ({
    id: record.id,
    details: record.details,
    direction: record.direction,
    date: record.date,
    amount: record.amount,
    currency: record.currency,
  }));

  const isRTL = direction === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const summarySide = isRTL ? "flex-end" : "flex-start";
  const currencyLabel = selectedCurrency.toUpperCase();

  const netLabel =
    calculationObject?.direction === MoneyDirection.TO
      ? translations.netYouOwe
      : translations.netYouOwed;

  const netTotalColor =
    calculationObject?.direction === MoneyDirection.TO ? "#c0392b" : "#27ae60";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={[styles.title, { direction, textAlign }]}>
          {translations.title} {decodedRecordsOwner} — {currencyLabel}
        </Text>

        <View style={[styles.table, { direction }]}>
          {/* Header row */}
          <View style={[styles.row, styles.headerRow]}>
            {[
              translations.date,
              translations.amount,
              translations.currency,
              translations.details,
            ].map((h) => (
              <View key={h} style={styles.cell}>
                <Text style={[styles.headerText, { textAlign }]}>{h}</Text>
              </View>
            ))}
          </View>

          {/* Data rows */}
          {recordsToDisplay?.map((record) => (
            <View style={styles.row} key={record.id}>
              <View style={styles.cell}>
                <Text style={[styles.cellText, { textAlign }]}>
                  {formatDate(record.date)}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text style={[styles.cellText, { textAlign }]}>
                  {record.direction === MoneyDirection.ON
                    ? `${formatMoney(record.amount)}`
                    : `-${formatMoney(record.amount)}`}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text style={[styles.cellText, { textAlign }]}>
                  {currencyLabel}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text style={[styles.cellText, { textAlign }]}>
                  {record.details}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={[styles.summary, { alignSelf: summarySide, direction }]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{translations.youOwed}</Text>
            <Text style={styles.summaryValue}>
              {formatMoney(calculationObject?.totalOnHim ?? 0)} {currencyLabel}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{translations.youOwe}</Text>
            <Text style={styles.summaryValue}>
              {formatMoney(calculationObject?.totalToHim ?? 0)} {currencyLabel}
            </Text>
          </View>

          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>{netLabel}</Text>
            <Text style={[styles.summaryTotalValue, { color: netTotalColor }]}>
              {formatMoney(calculationObject?.total ?? 0)} {currencyLabel}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
