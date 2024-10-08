import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  Pressable,
  useColorScheme,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import withAuthCheck from '../../components/WithAuthCheck';

function HomeScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [waypoints, setWaypoints] = useState('');
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [predictedTime, setPredictedTime] = useState('');

  const colorScheme = useColorScheme();

  const styles = getStyles(colorScheme === 'dark');

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
          `&key=${process.env.PUBLIC_EXPO_GOOGLE_MAPS_API_KEY}`;

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
  // clearStorage();
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={origin}
        onChangeText={setOrigin}
        placeholder='Enter Origin'
        placeholderTextColor={colorScheme === 'dark' ? 'lightgray' : 'gray'}
      />
      <TextInput
        style={styles.input}
        value={destination}
        onChangeText={setDestination}
        placeholder='Enter Destination'
        placeholderTextColor={colorScheme === 'dark' ? 'lightgray' : 'gray'}
      />
      <TextInput
        style={styles.input}
        value={waypoints}
        onChangeText={setWaypoints}
        placeholder='Enter Waypoints (comma-separated)'
        placeholderTextColor={colorScheme === 'dark' ? 'lightgray' : 'gray'}
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
          <Text style={styles.text}>
            Predicted Total Travel Time with Traffic: {predictedTime}
          </Text>
        </View>
      ) : null}

      <Pressable onPress={() => router.push('/(tabs)/sandbox/sandbox')}>
        <Text style={styles.text}>Go to Sandbox</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/FirstPage')}>
        <Text style={styles.text}>Go to FirstPage</Text>
      </Pressable>

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

export default withAuthCheck(HomeScreen);

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      marginTop: 80,
    },
    input: {
      height: 40,
      borderColor: isDarkMode ? 'lightgray' : 'gray',
      borderWidth: 1,
      marginBottom: 8,
      paddingHorizontal: 8,
      color: isDarkMode ? '#fff' : '#000',
    },
    selectedTime: {
      marginVertical: 8,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    predictedTimeContainer: {
      padding: 8,
      backgroundColor: isDarkMode ? '#333' : '#eee',
      marginVertical: 8,
    },
    text: {
      color: isDarkMode ? '#fff' : '#000',
    },
    map: {
      flex: 1,
    },
  });
