import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Button, Card, Text } from '@ui-kitten/components';

const Header = (props: ViewProps): React.ReactElement => (
  <View {...props}>
    <Text category='h6'>Maldives</Text>
    <Text category='s1'>By Wikipedia</Text>
  </View>
);

const Footer = (props: ViewProps): React.ReactElement => (
  <View {...props} style={[props.style, styles.footerContainer]}>
    <Button style={styles.footerControl} size='small' status='basic'>
      CANCEL
    </Button>
    <Button style={styles.footerControl} size='small'>
      ACCEPT
    </Button>
  </View>
);

export const CardAccessoriesShowcase = (): React.ReactElement => (
  <Card
    style={styles.card}
    header={(props) => <Header {...props} />}
    footer={(props) => <Footer {...props} />}
  >
    <Text>
      The Maldives, officially the Republic of Maldives, is a small country in
      South Asia, located in the Arabian Sea of the Indian Ocean. It lies
      southwest of Sri Lanka and India, about 1,000 kilometres (620 mi) from the
      Asian continent.
    </Text>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
});
