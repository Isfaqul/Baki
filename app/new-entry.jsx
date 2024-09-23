import React, { useState, useContext, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Platform,
  ToastAndroid,
} from "react-native";
import * as Haptics from "expo-haptics";

import AppButton, { AppButtonSecondary } from "../components/AppButton.jsx";
import DateInputComponent from "../components/DateInput.jsx";
import {
  validateNumberInput,
  validateTextInput,
} from "../modules/validateForm.js";

import Colors from "../constants/Colors.js";
import Spacing from "../constants/Spacing.js";
import FontSize from "../constants/FontSize.js";
import DatabaseContext from "../modules/DatabaseContext.js";
import {
  formattedLowerCase,
  calcCredit,
  dateToMS,
  pascalCase,
} from "../modules/utils.js";
import { useFocusEffect } from "@react-navigation/native";

export default function AddNewEntryScreen() {
  const { DB, DBisReady } = useContext(DatabaseContext);

  // FormState Management
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [isValidForm, setIsValidForm] = useState(false);
  const [newEntryIsAdded, setNewEntryIsAdded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!DBisReady) return;
      // This runs when the tab is focused
      console.log("New Entry focused, fetching customer list...");
      fetchCustomers();

      // Optionally, cleanup if necessary
      return () => {
        console.log("New Entry unfocused");
      };
    }, [DBisReady]),
  );

  const fetchCustomers = async () => {
    try {
      const allCustomers = await DB.getAllAsync(`SELECT  * FROM customers`);

      // Uppercase the names
      const formattedCustomerNames = allCustomers.map((customer) => {
        return { ...customer, name: pascalCase(customer.name) };
      });

      setCustomers(formattedCustomerNames);
      console.log("fetched customer data");
    } catch (error) {
      console.log(`Could not fetch data from customers: `, error);
    }
  };

  const handleNameInputChange = (text) => {
    setCustomerName(text);

    const filteredSuggestions = customers.filter((name) =>
      name.name.toLowerCase().includes(text.toLowerCase()),
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSelectSuggestion = (name) => {
    setCustomerName(name);
    setSuggestions([]);
  };

  // Handle Date Change Event
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    console.log(selectedDate.toDateString());
  };

  // Validate form
  const validateForm = () => {
    const errorList = {};

    let creditorNameError = validateTextInput(customerName, "Name");
    let itemNameError = validateTextInput(itemName, "Item");
    let itemPriceError = validateNumberInput(itemPrice);
    let paidAmountError = validateNumberInput(paidAmount);

    if (creditorNameError) errorList.creditorName = creditorNameError;
    if (itemNameError) errorList.itemName = itemNameError;
    if (itemPriceError) errorList.itemPrice = itemPriceError;
    if (paidAmountError) errorList.paidAmount = paidAmountError;

    setErrors(errorList);

    return Object.keys(errorList).length === 0;
  };

  const fetchCustomerName = async (name) => {
    name = formattedLowerCase(name);
    try {
      const result = await DB.getFirstAsync(
        `SELECT * FROM customers WHERE name = (?)`,
        name,
      );

      // Return the ID of the row
      return result["id"];
    } catch (error) {
      console.log("Could not fetch customer id", error);
    }
  };

  const insertCustomerName = async (name) => {
    name = formattedLowerCase(name);
    try {
      const result = await DB.runAsync(
        `INSERT INTO customers (name) VALUES (?)`,
        name,
      );

      // Return the ID of the inserted row
      return result["lastInsertRowId"];
    } catch (error) {
      console.log("Could not insert customer name", error);
    }
  };

  const updateTotalCredit = async (name) => {
    name = formattedLowerCase(name);
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

  const insertTransaction = async (transaction) => {
    // Check if customer already exists
    let customerExists = await fetchCustomerName(transaction.creditorName);
    let customer_id = null;

    // Fetch or create ID basis query result
    if (customerExists) {
      customer_id = customerExists;
    } else {
      customer_id = await insertCustomerName(transaction.creditorName);
    }

    // Calculate Credit
    const credit = calcCredit(transaction.itemPrice, transaction.paidAmount);
    // Format date to insert
    const date = dateToMS(transaction.date).toString();

    // Notes
    const note = transaction.notes ? transaction.notes : "";

    try {
      const result = await DB.runAsync(
        `INSERT INTO transactions (customer_id, item_name, item_price, amount_paid, credit, note, date)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
        customer_id,
        transaction.itemName,
        transaction.itemPrice,
        transaction.paidAmount,
        credit,
        note,
        date,
      );
      return result;
    } catch (error) {
      console.log("Could not insert transaction", error);
    }
  };

  // get Validated form Data
  const handleFormSubmit = async () => {
    Keyboard.dismiss();
    if (validateForm()) {
      let transaction = {
        creditorName: customerName,
        itemName: itemName,
        itemPrice: itemPrice,
        paidAmount: paidAmount,
        notes: notes,
        date: date,
      };

      ToastAndroid.show("Added Successfully", ToastAndroid.SHORT);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setNewEntryIsAdded(true);
      await insertTransaction(transaction);
      await updateTotalCredit(transaction.creditorName);

      // Reset form
      setCustomerName("");
      setItemName("");
      setItemPrice("");
      setPaidAmount("");
      setNotes("");
      setDate(new Date());

      // Go back to home screen
      router.replace("/(tabs)/");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, paddingBottom: 25 }}
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 35 : 0}
      >
        <View>
          <FormInput
            label="Customer name"
            placeholder="Enter name"
            value={customerName}
            onChangeText={handleNameInputChange}
            error={errors.creditorName && errors.creditorName}
            onFocus={() => null}
            onBlur={() => null}
          />
          <View>
            {/*Auto Suggest Names */}

            {suggestions.length > 0 && (
              <FlatList
                horizontal
                keyboardShouldPersistTaps="always"
                style={styles.customerListContainer}
                data={suggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item.name)}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <View
                    style={{ backgroundColor: Colors.bgSecondary, height: 1 }}
                  ></View>
                )}
                contentContainerStyle={{ gap: Spacing.gapS }}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </View>

        <FormInput
          label="Item"
          placeholder="Enter item name"
          value={itemName}
          onChangeText={setItemName}
          error={errors.itemName && errors.itemName}
          onFocus={() => null}
          onBlur={() => null}
        />
        <View style={styles.priceContainer}>
          <FormInput
            label="Price"
            placeholder="Enter item price"
            type="numeric"
            value={itemPrice}
            onChangeText={setItemPrice}
            error={errors.itemPrice && errors.itemPrice}
            onFocus={() => null}
            onBlur={() => null}
          />
          <FormInput
            label="Paid"
            placeholder="Enter amount paid"
            type="numeric"
            value={paidAmount}
            onChangeText={setPaidAmount}
            error={errors.paidAmount && errors.paidAmount}
            onFocus={() => null}
            onBlur={() => null}
          />
        </View>

        <DateInput label="Date" date={date} onChange={onChange} />

        <FormInput
          tipText="Max length: 60"
          label="Note"
          placeholder="Enter note if any"
          multiline={true}
          value={notes}
          onChangeText={setNotes}
          errors={errors}
          onFocus={() => null}
          onBlur={() => null}
        />

        <View style={styles.buttonContainer}>
          <AppButtonSecondary
            title="Cancel"
            iconName="arrow-back"
            onPress={async () => {
              router.back();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            }}
          />
          <AppButton
            title="Add"
            iconName="add"
            onPress={() => {
              Keyboard.dismiss();
              handleFormSubmit();
            }}
          />
        </View>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

function FormInput({
  error,
  value,
  onChangeText,
  label,
  onFocus,
  onBlur,
  placeholder,
  type = "default",
  multiline = false,
  tipText,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {tipText && !error && <Text style={styles.tipText}>{tipText}</Text>}
      </View>
      <TextInput
        maxLength={60}
        style={[
          styles.textInput,
          isFocused && styles.textInputFocus,
          error && styles.error,
        ]}
        placeholder={placeholder}
        cursorColor="black"
        keyboardType={type}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          onFocus();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        multiline={multiline}
        selectionColor="#ccc"
      />
    </View>
  );
}

function DateInput({ label, date, onChange }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <DateInputComponent
        style={styles.textInput}
        date={date}
        onChange={onChange}
      />
    </View>
  );
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.paddingM,
    backgroundColor: Colors.white,
  },
  containerInner: {
    // backgroundColor: "dodgerblue",
  },
  textInput: {
    backgroundColor: Colors.white,
    padding: 10,
    fontSize: FontSize.f16,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.inputBorderBlur,
    borderRadius: Spacing.rRadiusM,
  },
  textInputFocus: {
    borderColor: Colors.inputBorderFocus,
  },
  label: {
    fontSize: FontSize.f16,
    fontWeight: "500",
    marginBottom: Spacing.marginS,
    color: Colors.textPrimary,
  },
  inputContainer: {
    marginBottom: Spacing.marginM,
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.gapM,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.gapM,
  },
  button: {
    width: "100%",
  },
  error: {
    borderColor: Colors.errorRed,
    borderStyle: "solid",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  errorText: {
    color: Colors.errorRed,
    fontSize: FontSize.f12,
  },
  tipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.f12,
  },
  customerListItem: {
    paddingHorizontal: Spacing.paddingS,
    paddingVertical: Spacing.paddingM,
    borderBottomWidth: 1,
    borderColor: Colors.bgSecondary,
  },
  customerListContainer: {
    position: "absolute",
    marginTop: -Spacing.marginM,
    backgroundColor: Colors.bgHeader,
    // elevation: 5,
    zIndex: 3,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.bgSecondary,
    borderRadius: Spacing.rRadiusM,
    paddingHorizontal: Spacing.paddingS,
    paddingVertical: Spacing.paddingS,
  },
  suggestionItem: {
    backgroundColor: Colors.bgIconContainer,
    borderRadius: Spacing.rRadiusM,
  },
  suggestionText: {
    paddingHorizontal: Spacing.paddingM,
    paddingVertical: Spacing.paddingXS,
    borderRadius: Spacing.rRadiusS,
    color: Colors.textPrimary,
  },
});
