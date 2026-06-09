import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import  {AddExpenseScreen}  from './src/screens/AddExpensesScreen';

type Screen = 'home' | 'add';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  return (
    <Provider store={store}>
      {screen === 'home' ? (
        <HomeScreen onAddPress={() => setScreen('add')} />
      ) : (
        <AddExpenseScreen onBack={() => setScreen('home')} />
      )}
    </Provider>
  );
}