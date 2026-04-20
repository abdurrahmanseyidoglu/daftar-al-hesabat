// components/MyDocument.jsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useRecordStore } from "../stores/recordStore";
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 20 },
  table: { width: "100%" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 6,
  },
  cell: { flex: 1 },
  header: { fontFamily: "Helvetica-Bold", color: "#444" },
});

const transactions = [
  {
    date: "2024-01-01",
    name: "MHS",
    amount: "5,000",
    currency: "USD",
    details: "This is a detail",
  },
];

export const GlobalPdfTemplate = () => {
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Global transactions in {selectedCurrency.toLocaleUpperCase()}
        </Text>
        <View style={styles.table}>
          {/* Header row */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.header]}>Date</Text>
            <Text style={[styles.cell, styles.header]}>Description</Text>
            <Text style={[styles.cell, styles.header]}>Amount</Text>
            <Text style={[styles.cell, styles.header]}>Currency</Text>
            <Text style={[styles.cell, styles.header]}>Details</Text>
          </View>
          {/* Data rows */}
          {transactions.map((tx, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.cell}>{tx.date}</Text>
              <Text style={styles.cell}>{tx.name}</Text>
              <Text style={styles.cell}>{tx.amount}</Text>
              <Text style={styles.cell}>{tx.currency}</Text>
              <Text style={styles.cell}>{tx.details}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
