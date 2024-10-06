import React, { useState, useEffect } from 'react';
import { Calendar, Text, Layout } from '@ui-kitten/components';
import { ActivityIndicator } from 'react-native';

export default function Sandbox() {
  const [date, setDate] = useState(new Date());
  const [CardAccessoriesShowcase, setCardAccessoriesShowcase] =
    useState<React.FC | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      const component = await import('./card');
      setCardAccessoriesShowcase(() => component.CardAccessoriesShowcase);
      setLoading(false);
    };

    loadComponent();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size='large'
        color='#0000ff'
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
      }}
    >
      <Text category='h6' style={{ marginBottom: 16 }}>
        Selected date: {date.toLocaleDateString()}
      </Text>

      <Calendar date={date} onSelect={(nextDate) => setDate(nextDate)} />

      {CardAccessoriesShowcase && <CardAccessoriesShowcase />}
    </Layout>
  );
}
