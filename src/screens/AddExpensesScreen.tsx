import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, Alert,
} from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { addExpense } from '../features/expenses/ExpenseSlice';
import { Currency, Category, Expense } from '../types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD'];
const CATEGORIES: Category[] = ['Food', 'Travel', 'Shopping', 'Health', 'Entertainment', 'Other'];

interface Props {
  onBack: () => void;
}

export const AddExpenseScreen: React.FC<Props> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [category, setCategory] = useState<Category>('Food');

  const handleSubmit = () => {
    if (!title.trim()) { Alert.alert('Error', 'Please enter a title.'); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) { Alert.alert('Error', 'Please enter a valid amount.'); return; }

    const expense: Expense = {
      id: uuidv4(),
      title: title.trim(),
      amount: parsed,
      currency,
      category,
      date: new Date().toISOString(),
    };

    dispatch(addExpense(expense));
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heading}>Add Expense</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Coffee, Flight to London"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Currency</Text>
        <View style={styles.pills}>
          {CURRENCIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.pill, currency === c && styles.pillActive]}
              onPress={() => setCurrency(c)}
            >
              <Text style={[styles.pillText, currency === c && styles.pillTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.pills}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, category === cat && styles.pillActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>


      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    padding: 20,
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  back: {
    color: '#fff',
    fontSize: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff'
  },
  form: {
    padding: 20,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 6
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b'
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0'
  },
  pillActive: {
    backgroundColor: '#6366f1'
  },
  pillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500'
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '700'
  },
  button: {
    marginTop: 32,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
  },
});