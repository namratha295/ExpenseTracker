import React, { useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator,
    SafeAreaView,
    Modal,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadRates } from '../features/currency/CurrencySlice';
import { removeExpense, setFilter, updateConvertedAmounts } from '../features/expenses/ExpenseSlice';
import { Category, Expense, Currency } from '../types';
import { setBaseCurrency } from '../features/currency/CurrencySlice';


const CATEGORIES: Array<Category | 'All'> = ['All', 'Food', 'Travel', 'Shopping', 'Health', 'Entertainment', 'Other'];

interface Props {
    onAddPress: () => void;
}

const HomeScreen: React.FC<Props> = ({ onAddPress }) => {
    const [showSwitcher, setShowSwitcher] = useState(false);
    const dispatch = useAppDispatch();
    const { base, rates, loading, error, lastUpdated } = useAppSelector(s => s.currency);
    const { items, filterCategory } = useAppSelector(s => s.expenses);

    // Fetch rates on mount and when base changes
    useEffect(() => {
        dispatch(loadRates(base));
    }, [base, dispatch]);

    // Recalculate converted amounts whenever rates change
    useEffect(() => {
        console.log('rates:', rates);
        console.log('base:', base);
        console.log('items before update:', items);
        if (rates && Object.keys(rates).length > 0) {
            dispatch(updateConvertedAmounts({ rates, base }));
        }
    }, [rates, base, dispatch]);

    const filtered = useMemo(
        () => filterCategory === 'All' ? items : items.filter(e => e.category === filterCategory),
        [items, filterCategory]
    );

    const total = useMemo(
        () => filtered.reduce((sum, e) => sum + (e.convertedAmount ?? e.amount), 0).toFixed(2),
        [filtered]
    );

    const renderItem = ({ item }: { item: Expense }) => (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.category} · {item.date.slice(0, 10)}</Text>
            </View>
            <View style={styles.cardRight}>
                <Text style={styles.amount}>{item.currency} {item.amount.toFixed(2)}</Text>
                {item.convertedAmount !== undefined && item.currency !== base && (
                    <Text style={styles.converted}>≈ {base} {item.convertedAmount.toFixed(2)}</Text>
                )}
                <TouchableOpacity onPress={() => dispatch(removeExpense(item.id))} style={styles.deleteIcon} hitSlop={10}>
                    <Icon name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Expense Tracker</Text>
                {/* <Text style={styles.subheading}>Base: {base} · Total: {total}</Text> */}
                {lastUpdated && <Text style={styles.updated}>Rates updated: {lastUpdated}</Text>}
                {loading && <ActivityIndicator size="small" color="#6366f1" />}
                {error && <Text style={styles.error}>{error}</Text>}
                <TouchableOpacity onPress={() => setShowSwitcher(true)}>
                    <Text style={styles.subheading}>
                        Base: {base} · Total: {total} ▾
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Category filter */}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={CATEGORIES}
                keyExtractor={c => c}
                style={styles.filterRow}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item: cat }) => (
                    <TouchableOpacity
                        style={[styles.chip, filterCategory === cat && styles.chipActive]}
                        onPress={() => dispatch(setFilter(cat))}
                    >
                        <Text style={[styles.chipText, filterCategory === cat && styles.chipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Expense list */}
            <FlatList
                data={filtered}
                keyExtractor={e => e.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>No expenses yet. Add one!</Text>}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity style={styles.fab} onPress={onAddPress}>
                <Text style={styles.fabText}>+ Add</Text>
            </TouchableOpacity>


            <Modal
                visible={showSwitcher}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSwitcher(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setShowSwitcher(false)}
                    activeOpacity={1}
                >
                    <View style={styles.switcher}>
                        <Text style={styles.switcherTitle}>Select base currency</Text>
                        {(['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD'] as Currency[]).map(c => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.switcherRow, base === c && styles.switcherRowActive]}
                                onPress={() => {
                                    dispatch(setBaseCurrency(c));
                                    dispatch(loadRates(c));
                                    setShowSwitcher(false);
                                }}
                            >
                                <Text style={[styles.switcherText, base === c && styles.switcherTextActive]}>
                                    {c}
                                </Text>
                                {base === c && <Icon name="checkmark" size={18} color="#6366f1" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc'
    },
    header: {
        padding: 20,
        backgroundColor: '#6366f1',
        gap: 4
    },
    heading: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff'
    },
    subheading: {
        fontSize: 15,
        color: '#e0e7ff'
    },
    updated: {
        fontSize: 11,
        color: '#c7d2fe'
    },
    error: {
        fontSize: 12,
        color: '#fca5a5'
    },
    filterRow: {
        paddingVertical: 12,
        flexGrow: 0,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 8,
    },
    chipActive: {
        backgroundColor: '#6366f1'
    },
    chipText: {
        fontSize: 13,
        color: '#475569'
    },
    chipTextActive: {
        color: '#fff',
        fontWeight: '600'
    },
    list: {
        padding: 16,
        paddingBottom: 100
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2
    },
    cardLeft: { flex: 1 },
    cardRight: { alignItems: 'flex-end' },
    title: {
        fontSize: 16, fontWeight: '600', color: '#1e293b'
    },
    meta: { fontSize: 12, color: '#94a3b8', marginTop: 8 },
    deleteIcon: { marginTop: 8 },
    amount: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
    converted: { fontSize: 12, color: '#6366f1', marginTop: 2 },
    delete: { fontSize: 12, color: '#ef4444', marginTop: 8 },
    empty: { textAlign: 'center', color: '#94a3b8', marginTop: 60, fontSize: 15 },
    fab: { position: 'absolute', bottom: 32, right: 24, backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, elevation: 4 },
    fabText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    switcher: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    switcherTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    switcherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e2e8f0',
    },
    switcherRowActive: { backgroundColor: '#f5f3ff' },
    switcherText: { fontSize: 16, color: '#1e293b' },
    switcherTextActive: { color: '#6366f1', fontWeight: '600' },
});
