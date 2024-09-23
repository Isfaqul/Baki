import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ToastAndroid,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";

import Spacing from "../constants/Spacing.js";
import FontSize from "../constants/FontSize.js";
import Colors from "../constants/Colors.js";
import ListItem from "../components/ListItems.jsx";
import DatabaseContext from "../modules/DatabaseContext.js";
import { formatDateToDisplay, pascalCase } from "../modules/utils";

export default function Recent() {
  // RECENT IS LAST 7 DAYS Transactions
  const { DB, DBisReady } = useContext(DatabaseContext);
  const [recent, setRecent] = useState([]);

  const MS_IN_DAY = 24 * 60 * 60 * 1000;

  let today = new Date().getTime();
  let SEVEN_DAYS_AGO = today - MS_IN_DAY * 7;

  useFocusEffect(
    useCallback(() => {
      if (!DBisReady) return;
      // This runs when the tab is focused
      console.log("Transactions focused, fetching customers...");
      fetchRecents();

      // Optionally, cleanup if necessary
      return () => {
        console.log("Transactions unfocused");
      };
    }, [DBisReady]),
  );

  const fetchRecents = async () => {
    try {
      const recentTransactions = await DB.getAllAsync(
        `SELECT * FROM customers JOIN transactions ON customers.id = transactions.customer_id WHERE transactions.date > (?) ORDER BY date DESC`,
        SEVEN_DAYS_AGO,
      );
      setRecent(recentTransactions);
      console.log("fetched customer data");
    } catch (error) {
      console.log(`Could not fetch data from customers: `, error);
    }
  };

  const updateTotalCredit = async (name) => {
    try {
      const result = await DB.runAsync(
        `
        UPDATE customers 
        SET total_credit = (
          SELECT COALESCE(SUM(transactions.credit), 0) 
          FROM transactions 
          WHERE transactions.customer_id = customers.id
        )
        WHERE customers.name = ?;
      `,
        [name],
      );
      return result;
    } catch (error) {
      console.log("Could not update Total", error);
    }
  };

  const handleDelete = async (transaction) => {
    try {
      await DB.runAsync(
        `DELETE FROM transactions WHERE ID = (?)`,
        transaction.id,
      );

      await updateTotalCredit(transaction.name);
      await fetchRecents();
      ToastAndroid.show("Transaction Updated", ToastAndroid.SHORT);
      console.log(transaction.name);
    } catch (error) {
      console.log("Could not delete from database", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TableFlat
        data={recent}
        renderItem={({ item }) => (
          <ListItem
            name={pascalCase(item["name"])}
            item={item["item_name"]}
            amount={item["credit"]}
            date={formatDateToDisplay(Number(item["date"]))}
            note={item.note}
            onDelete={() => handleDelete(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function TableFlat({ data, renderItem, keyExtractor }) {
  return (
    <>
      <View style={styles.tableRow}>
        <View style={[styles.column, styles.nameColumn, styles.marginBottom]}>
          <Text style={styles.tableHeader}>Name</Text>
        </View>
        <View style={[styles.column, styles.itemColumn, styles.marginBottom]}>
          <Text style={styles.tableHeader}>Item</Text>
        </View>
        <View style={[styles.column, styles.bakiColumn, styles.marginBottom]}>
          <Text style={[styles.tableHeader, styles.alignRight]}>Baki</Text>
        </View>
        <View style={[styles.column, styles.dateColumn, styles.marginBottom]}>
          <Text style={[styles.tableHeader]}>Date</Text>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<Text style={styles.emptyListText}>No Data</Text>}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.gapS }} />}
      />
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.paddingM,
  },
  tableRow: {
    flexDirection: "row",
    gap: Spacing.gapS,
  },
  column: {
    backgroundColor: Colors.bgSecondary,
    padding: Spacing.paddingM,
    borderRadius: Spacing.rRadiusM,
  },
  tableHeader: {
    fontSize: FontSize.f14,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  nameColumn: {
    flex: 0.3,
  },
  bakiColumn: {
    flex: 0.2,
  },
  itemColumn: {
    flex: 0.3,
  },
  dateColumn: {
    flex: 0.3,
  },
  alignRight: {
    textAlign: "right",
  },
  tableDataRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgSecondary,
  },
  dataColumn: {
    backgroundColor: "transparent",
    paddingHorizontal: Spacing.paddingS,
    paddingVertical: Spacing.paddingL,
    borderRadius: Spacing.rRadiusM,
    justifyContent: "center",
  },
  tableData: {
    color: Colors.textPrimary,
    fontSize: FontSize.f14,
  },
  bold: {
    fontWeight: "bold",
  },
  rowContainer: {
    borderRadius: Spacing.rRadiusM,
    overflow: "hidden",
  },
  marginBottom: {
    marginBottom: Spacing.marginS,
  },
  emptyListText: {
    color: Colors.textPrimary,
    fontSize: FontSize.f16,
    textAlign: "center",
    paddingVertical: Spacing.paddingM,
  },
});
