import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ToastAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ConfirmDeleteModal from "../../components/ConfirmModal.jsx";

import Spacing from "../../constants/Spacing.js";
import Colors from "../../constants/Colors.js";
import FontSize from "../../constants/FontSize.js";
import DatabaseContext from "../../modules/DatabaseContext.js";
import { formattedLowerCase, pascalCase } from "../../modules/utils";
import ListItemsTwoColumns from "../../components/ListItemsTwoCol.jsx";
import EditModal from "../../components/EditModal.jsx";
import * as Haptics from "expo-haptics";

export default function Test() {
  const { DB, DBisReady } = useContext(DatabaseContext);
  const [customers, setCustomers] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalInputValue, setModalInputValue] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!DBisReady) return;
      // This runs when the tab is focused
      console.log("List of Parties focused, fetching customers...");
      fetchCustomers();

      // Optionally, cleanup if necessary
      return () => {
        console.log("List of Parties unfocused");
      };
    }, [DBisReady]),
  );

  const fetchCustomers = async () => {
    try {
      const allCustomers = await DB.getAllAsync(
        `SELECT  * FROM customers ORDER BY total_credit DESC`,
      );

      // Uppercase the names
      const formattedCustomerNames = allCustomers.map((customer) => {
        return { ...customer, name: pascalCase(customer.name) };
      });

      setCustomers(formattedCustomerNames);

      // setCustomers(allCustomers);
      console.log("fetched customer data");
    } catch (error) {
      console.log(`Could not fetch data from customers: `, error);
    }
  };

  const handleOnEdit = (item) => {
    setEditModalVisible(!editModalVisible);
    setModalInputValue(item);
  };

  const handleOnSave = async () => {
    const name = formattedLowerCase(modalInputValue.name);
    try {
      const result = await DB.runAsync(
        "UPDATE customers SET name = ? WHERE id = ?",
        name,
        modalInputValue.id,
      );

      ToastAndroid.show("Updated Successfully", ToastAndroid.SHORT);
      setEditModalVisible(!editModalVisible);
      fetchCustomers();
      return result;
    } catch (error) {
      console.log("Could not edit name", error);
    }
  };

  const handleOnDelete = (item) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setDeleteModalVisible(!deleteModalVisible);
    setModalInputValue(item);
  };

  const handleOnConfirm = async () => {
    const name = formattedLowerCase(modalInputValue.name);

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Delete all transactions of the customer first
      const deleteTransactionResult = await DB.runAsync(
        "DELETE FROM transactions WHERE customer_id = ( SELECT id FROM customers WHERE name = ?)",
        name,
      );

      // Then delete the customer from customer table
      const deleteCustomerResult = await DB.runAsync(
        "DELETE FROM customers WHERE name = ?",
        name,
      );

      ToastAndroid.show(`Deleted Successfully`, ToastAndroid.SHORT);
      setDeleteModalVisible(!deleteModalVisible);
      // Fetch list of updated customers
      fetchCustomers();
      return { deleteTransactionResult, deleteCustomerResult };
    } catch (error) {
      console.log("Could not Delete customer", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Table
        data={customers}
        renderItem={({ item }) => (
          <ListItemsTwoColumns
            name={pascalCase(item.name)}
            amount={item["total_credit"]}
            onEdit={() => handleOnEdit(item)}
            onDelete={() => handleOnDelete(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <EditModal
        visible={editModalVisible}
        onChangeText={(text) => {
          setModalInputValue({ ...modalInputValue, name: text });
        }}
        value={modalInputValue.name}
        onSave={async () => {
          await handleOnSave();
        }}
        onCancel={() => setEditModalVisible(!editModalVisible)}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={() => handleOnConfirm()}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function Table({ data, renderItem, keyExtractor }) {
  return (
    <>
      <View style={styles.tableRow}>
        <View style={[styles.column, styles.NameColumn, styles.marginBottom]}>
          <Text style={styles.tableHeader}>Name</Text>
        </View>
        <View style={[styles.column, styles.BakiColumn, styles.marginBottom]}>
          <Text style={[styles.tableHeader, styles.alignRight]}>
            Total Baki
          </Text>
        </View>
      </View>

      {/* Dynamic Data Insertion */}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<Text style={styles.emptyListText}>No Data</Text>}
        contentContainerStyle={{
          gap: Spacing.gapS,
        }}
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
  NameColumn: {
    flex: 0.6,
  },
  BakiColumn: {
    flex: 0.4,
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
    padding: Spacing.paddingM,
    borderRadius: Spacing.rRadiusM,
  },
  tableData: {
    color: Colors.textPrimary,
    fontSize: FontSize.f16,
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
