import React from 'react';
import { Calendar, Text, Layout } from '@ui-kitten/components';

export default function Sandbox() {
  const [date, setDate] = React.useState(new Date());

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text category='h6' style={{ marginBottom: 16 }}>
        Selected date: {date.toLocaleDateString()}
      </Text>

      <Calendar date={date} onSelect={(nextDate) => setDate(nextDate)} />
    </Layout>
  );
}
