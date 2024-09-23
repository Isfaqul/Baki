import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    ToastAndroid,
} from "react-native";
import {StatusBar} from "expo-status-bar";
import React, {useCallback, useContext, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";

import Colors from "../../constants/Colors";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import {pascalCase, formatDateToDisplay} from "../../modules/utils.js";
import DatabaseContext from "../../modules/DatabaseContext.js";
import ListItem from "../../components/ListItems.jsx";

export default function AllBakis() {
    const {DB, DBisReady} = useContext(DatabaseContext);
    const [txns, setTxns] = useState([]);

    useFocusEffect(
        useCallback(() => {
            if (!DBisReady) return;
            // This runs when the tab is focused
            console.log("Transactions focused, fetching customers...");
            fetchTxns();

            // Optionally, cleanup if necessary
            return () => {
                console.log("Transactions unfocused");
            };
        }, [DBisReady]),
    );

    const fetchTxns = async () => {
        try {
            const allTxns = await DB.getAllAsync(
                `SELECT  * FROM customers JOIN transactions ON transactions.customer_id = customers.id ORDER BY date DESC`,
            );
            setTxns(allTxns);
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
            await fetchTxns();
            ToastAndroid.show("Transaction Updated", ToastAndroid.SHORT);
            console.log(transaction.name);
        } catch (error) {
            console.log("Could not delete from database", error);
        }
    };

    const tableRows = txns.map((row) => {
        return (
            <ListItem
                name={pascalCase(row["name"])}
                item={row["item_name"]}
                amount={row["credit"]}
                key={row["id"]}
                date={formatDateToDisplay(Number(row["date"]))}
                onDelete={() => handleDelete(item)}
            />
        );
    });

    return (
        <SafeAreaView style={styles.container}>
            <TableFlat
                data={txns}
                renderItem={({item}) => (
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
            <StatusBar style="auto"/>
        </SafeAreaView>
    );
}

function TableFlat({data, renderItem, keyExtractor}) {
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

            {/* Flat List of transactions */}

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListEmptyComponent={<Text style={styles.emptyListText}>No Data</Text>}
                ItemSeparatorComponent={() => <View style={{height: Spacing.gapS}}/>}
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
