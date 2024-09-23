import React, { useState, useEffect, useContext, useCallback } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";

import AppButton, { AppButtonSecondary } from "../../components/AppButton.jsx";

import Spacing from "../../constants/Spacing.js";
import Colors from "../../constants/Colors.js";
import FontSize from "../../constants/FontSize.js";
import DatabaseContext from "../../modules/DatabaseContext.js";
import { useFocusEffect } from "@react-navigation/native";
import { formatDateToDisplay, pascalCase } from "../../modules/utils";

export default function App() {
  const { DB, DBisReady } = useContext(DatabaseContext);
  const [total, setTotal] = useState(0);
  const [topCredit, setTopCredit] = useState({});
  const [oldestCredit, setOldestCredit] = useState({});
  const [regular, setRegular] = useState({});

  useFocusEffect(
    useCallback(() => {
      if (!DBisReady) return;
      // This runs when the tab is focused
      console.log("Dashboard in Focus");

      getTotalCredit();
      getTopCredit();
      getOldestCredit();
      getFrequentCustomer();

      // Optionally, cleanup if necessary
      return () => {
        console.log("Dashboard closed");
      };
    }, [DBisReady]),
  );

  const getTotalCredit = async () => {
    try {
      const total = await DB.getFirstAsync(`
      SELECT SUM(total_credit) AS total FROM customers
      `);
      setTotal(total.total);
      return total;
    } catch (error) {
      console.log("Could not fetch total credit", error);
    }
  };

  const getTopCredit = async () => {
    try {
      const top = await DB.getFirstAsync(`
      SELECT total_credit, name FROM customers ORDER BY total_credit DESC
      `);
      setTopCredit(top);
      return top;
    } catch (error) {
      console.log("Could not fetch top credit", error);
    }
  };

  const getOldestCredit = async () => {
    try {
      const oldest = await DB.getFirstAsync(`
      SELECT credit, DATE FROM transactions ORDER BY DATE
      `);
      setOldestCredit(oldest);
      return oldest;
    } catch (error) {
      console.log("Could not fetch oldest credit", error);
    }
  };

  const getFrequentCustomer = async () => {
    try {
      const regularCustomer = await DB.getFirstAsync(`
      SELECT customers.name, COUNT(*) AS frequency 
      FROM transactions JOIN customers ON transactions.customer_id = customers.id 
      GROUP BY customers.name ORDER BY frequency DESC
      `);
      setRegular(regularCustomer);
      return regularCustomer;
    } catch (error) {
      console.log("Could not fetch regular customer", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statsRow}>
        <Category category="Total" />
        <StatsSingle title="Amount" value={total ? total : 0} />
      </View>

      <View style={styles.statsRow}>
        <Category category="Regular" />
        <StatsSingle
          value={regular?.name ? pascalCase(regular["name"]) : "-"}
          title="Name"
          isAmount={false}
        />
      </View>

      <View style={styles.statsRow}>
        <Category category="Top" />
        <StatsDouble
          amount={topCredit?.total_credit ? topCredit["total_credit"] : 0}
          secondTitle="Name"
          secondValue={
            topCredit?.name && topCredit?.total_credit > 0
              ? pascalCase(topCredit["name"])
              : "-"
          }
        />
      </View>

      <View style={styles.statsRow}>
        <Category category="Oldest" />
        <StatsDouble
          amount={oldestCredit?.credit ? oldestCredit.credit : 0}
          secondTitle="Date"
          secondValue={
            oldestCredit?.date ? formatDateToDisplay(oldestCredit.date) : "-"
          }
        />
      </View>

      <View style={styles.buttonContainer}>
        <AppButtonSecondary
          title="Recent"
          iconName="access-time"
          onPress={async () => {
            router.push("../recent");
          }}
        />
        <AppButton
          title="New"
          iconName="add-circle"
          onPress={async () => {
            router.push("../new-entry");
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          }}
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

// Components
function Category({ category }) {
  return (
    <View style={styles.categoryBox}>
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  );
}

function StatsSingle({ title, value, isAmount = true }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statsTitle}>{title}</Text>
      {isAmount ? (
        <Text style={styles.statsText}>₹ {value}</Text>
      ) : (
        <Text style={styles.statsText}>{value}</Text>
      )}
    </View>
  );
}

function StatsDouble({ amount, secondTitle, secondValue }) {
  return (
    <View style={[styles.statBox, styles.statsDoubleBox]}>
      <View style={styles.statTop}>
        <Text style={[styles.statsTitle, styles.statsTitleSmall]}>Amount</Text>
        <Text style={[styles.statsText, styles.statsDoubleText]}>
          ₹ {amount}
        </Text>
      </View>
      <View style={styles.statsBottom}>
        <Text style={[styles.statsTitle, styles.statsTitleSmall]}>
          {secondTitle}
        </Text>
        <Text style={[styles.statsText, styles.statsDoubleText]}>
          {secondValue}
        </Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.marginM,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.gapM,
    marginBottom: Spacing.marginM,
  },
  categoryBox: {
    flex: 0.3,
    backgroundColor: Colors.bgPrimary,
    borderRadius: Spacing.rRadiusM,
    padding: Spacing.paddingM,
    justifyContent: "center",
  },
  categoryText: {
    color: Colors.white,
    fontSize: FontSize.f22,
    textAlign: "center",
  },
  statBox: {
    flex: 0.7,
    padding: Spacing.paddingM,
    borderWidth: 1,
    borderRadius: Spacing.rRadiusM,
    overflow: "hidden",
  },
  statsTitle: {
    fontSize: FontSize.f22,
    color: Colors.textSecondary,
    fontWeight: "300",
  },
  statsText: {
    fontWeight: "600",
    fontSize: FontSize.f22,
    color: Colors.textPrimary,
  },
  statsDoubleBox: {
    // flexDirection: "row",
    // justifyContent: 'center',
    // gap: Spacing.gapM,
  },
  statsDoubleText: {
    fontSize: FontSize.f18,
  },
  statsTitleSmall: {
    fontSize: FontSize.f18,
  },
  statTop: {
    paddingVertical: Spacing.paddingS,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgSecondary,
  },
  statsBottom: {
    paddingVertical: Spacing.paddingS,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.gapM,
    flex: 1,
    alignItems: "flex-end",
  },
});
