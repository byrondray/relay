import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Text,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HomeScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [waypoints, setWaypoints] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [predictedTime, setPredictedTime] = useState('');

  const googleMapsApiKey =
    Constants.expoConfig?.extra?.googleMapsApiKey ||
    'AIzaSyBQ92jAHUBxg2Z1nVYjyXQ1rcibkda7hjg';

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
          `&key=${googleMapsApiKey}`;

        console.log('Request URL:', url);

        const response = await fetch(url);
        const json = await response.json();

        console.log('API Response:', json);

        if (json.status === 'OK') {
          const points = json.routes[0].overview_polyline.points;
          const coords = decodePolyline(points);
          setCoordinates(coords);

          const leg = json.routes[0].legs[0];
          const durationInTraffic = leg.duration_in_traffic.text;
          setPredictedTime(durationInTraffic);
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

  const decodePolyline = (t: string) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={origin}
        onChangeText={setOrigin}
        placeholder='Enter Origin'
        placeholderTextColor='gray'
      />
      <TextInput
        style={styles.input}
        value={destination}
        onChangeText={setDestination}
        placeholder='Enter Destination'
        placeholderTextColor='gray'
      />
      <TextInput
        style={styles.input}
        value={waypoints}
        onChangeText={setWaypoints}
        placeholder='Enter Waypoints (comma-separated)'
        placeholderTextColor='gray'
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
      <Text style={styles.selectedTime}>
        Selected Departure Time: {departureTime.toLocaleString()}
      </Text>
      <Button title='Get Directions' onPress={handleGetDirections} />

      {predictedTime ? (
        <View style={styles.predictedTimeContainer}>
          <Text>Predicted Total Travel Time with Traffic: {predictedTime}</Text>
        </View>
      ) : null}

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates[0]?.latitude || 49.2827,
          longitude: coordinates[0]?.longitude || -123.1207,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
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
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 50 : 0,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    color: 'white',
  },
  selectedTime: {
    marginVertical: 8,
    fontSize: 16,
  },
  predictedTimeContainer: {
    padding: 8,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  map: {
    flex: 1,
  },
});
