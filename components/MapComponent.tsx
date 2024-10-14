import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, Alert } from 'react-native';
import { ThemedView } from './ThemedView';
import * as Location from 'expo-location';

interface MapComponentProps {
  coordinates: { latitude: number; longitude: number }[];
  mapRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({
  coordinates,
  mapRegion,
}) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      setUserLocation({ latitude, longitude });
    })();
  }, []);

  useEffect(() => {
    if (locationErrorMsg) {
      Alert.alert('Location Error', locationErrorMsg);
    }
  }, [locationErrorMsg]);

  return (
    <ThemedView style={styles.mapContainer}>
      <MapView style={styles.map} region={mapRegion}>
        {coordinates.length > 0 && (
          <>
            <Polyline
              coordinates={coordinates}
              strokeWidth={5}
              strokeColor='red'
            />
            <Marker coordinate={coordinates[0]} title='Origin' />
            <Marker
              coordinate={coordinates[coordinates.length - 1]}
              title='Destination'
            />
          </>
        )}

        {userLocation && (
          <Marker
            coordinate={userLocation}
            title='Your Location'
            image={require('../assets/images/current-location-pin.png')}
            style={{ width: 100, height: 100 }}
          />
        )}
      </MapView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapComponent;
