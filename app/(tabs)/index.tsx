import React, { useState } from 'react';
import { Button, StyleSheet, Text, Alert, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import withAuthCheck from '../../components/WithAuthCheck';
import { useMutation } from '@apollo/client';
import { TEST_NOTIFICATION } from '@/graphql/queries';
import MapComponent from '../../components/MapComponent';
import { decodePolyline } from '../../components/MapUtils';
import { ThemedAddressCompletionInput } from '@/components/ThemedAddressCompletionInput';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

function HomeScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [waypoints, setWaypoints] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.4220936,
    longitude: -122.083922,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [predictedTime, setPredictedTime] = useState('');

  const [sendTestNotification] = useMutation(TEST_NOTIFICATION);

  const sendTestNotificationFNC = async () => {
    try {
      const recipientId = 'hkdSMSsaZIg4tJE8q4fC8ejp1hO2';
      const messageText =
        'This is a test notification from the GraphQL function!';

      const { data } = await sendTestNotification({
        variables: {
          recipientId,
          messageText,
        },
      });

      if (data?.testNotification?.success) {
        Alert.alert(
          'Notification Sent',
          'Test notification sent successfully!'
        );
      } else {
        Alert.alert('Notification Failed', 'Failed to send notification.');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'An error occurred while sending the notification.');
    }
  };

  const handleGetDirections = async () => {
    if (origin && destination) {
      try {
        const originEncoded = encodeURIComponent(origin);
        const destinationEncoded = encodeURIComponent(destination);
        const waypointsEncoded = waypoints
          ? `&waypoints=${encodeURIComponent(waypoints)}`
          : '';

        const departureTimestamp = Math.floor(departureTime.getTime() / 1000);

        const url =
          `https://maps.googleapis.com/maps/api/directions/json` +
          `?origin=${originEncoded}` +
          `&destination=${destinationEncoded}` +
          `${waypointsEncoded}` +
          `&departure_time=${departureTimestamp}` +
          `&traffic_model=best_guess` +
          `&mode=driving` +
          `&key=${process.env.EXPO_PUBLIC_GOOGlE_MAPS_API}`;

        const response = await fetch(url);
        const json = await response.json();

        if (json.status === 'OK') {
          const points = json.routes[0].overview_polyline.points;
          const coords = decodePolyline(points);
          setCoordinates(coords);

          const leg = json.routes[0].legs[0];
          const durationInTraffic = leg.duration_in_traffic.text;
          setPredictedTime(durationInTraffic);

          const bounds = getRouteBounds(coords);
          const center = {
            latitude: (bounds.minLat + bounds.maxLat) / 2,
            longitude: (bounds.minLng + bounds.maxLng) / 2,
          };

          const latitudeDelta = bounds.maxLat - bounds.minLat;
          const longitudeDelta = bounds.maxLng - bounds.minLng;

          setMapRegion({
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta: latitudeDelta * 1.5,
            longitudeDelta: longitudeDelta * 1.5,
          });
        } else {
          console.error(`Error fetching directions: ${json.status}`);
          Alert.alert(
            'Error',
            `No route found: ${json.status}. ${json.error_message || ''}`
          );
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred while fetching directions.');
      }
    } else {
      Alert.alert(
        'Input Required',
        'Please enter both origin and destination.'
      );
    }
  };

  const getRouteBounds = (
    coordinates: { latitude: number; longitude: number }[]
  ) => {
    let minLat = coordinates[0].latitude;
    let maxLat = coordinates[0].latitude;
    let minLng = coordinates[0].longitude;
    let maxLng = coordinates[0].longitude;

    coordinates.forEach((coord) => {
      if (coord.latitude < minLat) minLat = coord.latitude;
      if (coord.latitude > maxLat) maxLat = coord.latitude;
      if (coord.longitude < minLng) minLng = coord.longitude;
      if (coord.longitude > maxLng) maxLng = coord.longitude;
    });

    return { minLat, maxLat, minLng, maxLng };
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedAddressCompletionInput
        value={origin}
        onChangeText={setOrigin}
        onSuggestionSelect={setOrigin}
        placeholder='Enter Origin'
      />
      <ThemedAddressCompletionInput
        value={destination}
        onChangeText={setDestination}
        onSuggestionSelect={setDestination}
        placeholder='Enter Destination'
      />
      <ThemedAddressCompletionInput
        value={waypoints}
        onChangeText={setWaypoints}
        onSuggestionSelect={setWaypoints}
        placeholder='Enter Waypoints (comma-separated)'
      />
      <Button
        title='Select Departure Time'
        onPress={() => setShowPicker(true)}
      />
      {showPicker && (
        <DateTimePicker
          value={departureTime}
          mode='datetime'
          display='default'
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setDepartureTime(selectedDate);
            }
          }}
        />
      )}
      <ThemedText style={styles.selectedTime}>
        Selected Departure Time: {departureTime.toLocaleString()}
      </ThemedText>
      <Button title='Get Directions' onPress={handleGetDirections} />

      {predictedTime ? (
        <ThemedView style={styles.predictedTimeContainer}>
          <ThemedText>
            Predicted Total Travel Time with Traffic: {predictedTime}
          </ThemedText>
        </ThemedView>
      ) : null}

      <Pressable onPress={() => router.push('/(tabs)/sandbox/sandbox')}>
        <Text>Go to Sandbox</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/FirstPage')}>
        <Text>Go to FirstPage</Text>
      </Pressable>

      <Button
        title='Send Test Notification'
        onPress={sendTestNotificationFNC}
      />

      <MapComponent coordinates={coordinates} mapRegion={mapRegion} />
    </ThemedView>
  );
}

export default withAuthCheck(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 80,
  },
  selectedTime: {
    marginVertical: 8,
    fontSize: 16,
  },
  predictedTimeContainer: {
    padding: 8,
    marginVertical: 8,
  },
});
