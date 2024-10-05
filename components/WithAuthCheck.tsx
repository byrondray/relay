import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

type RootStackParamList = {
  login: undefined;
  [key: string]: undefined;
};

const withAuthCheck = (WrappedComponent: React.ComponentType) => {
  const AuthCheck: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const auth = getAuth();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          navigation.replace('Login/login');
        } else {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, []);

    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      );
    }

    return <WrappedComponent />;
  };

  return AuthCheck;
};

export default withAuthCheck;
