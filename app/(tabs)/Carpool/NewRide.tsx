import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const NewRideScreen: React.FC = () => {
  const hasFilledDriverInfo = true;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>New Ride</Text>
        
        <TouchableOpacity
          style={[
            styles.button,
            hasFilledDriverInfo ? styles.requestButton : styles.disabledButton
          ]}
          disabled={!hasFilledDriverInfo}
        >
          <View style={styles.buttonContent}>
            <View style={styles.textContainer}>
              <Text
                style={[
                  hasFilledDriverInfo ? styles.requestButtonText : styles.disabledButtonText
                ]}
              >
                I'm a driver
              </Text>
              <Text style={[styles.subText, hasFilledDriverInfo && styles.requestSubText]}>
                I'm available to carpool kids.
              </Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={[
                styles.arrowIcon,
                !hasFilledDriverInfo && styles.disabledArrowIcon
              ]}
            />
          </View>
        </TouchableOpacity>

        {!hasFilledDriverInfo && (
          <>
            <Text style={styles.signupText}>
              Interested in becoming a carpool driver to help drive kids in your community?
            </Text>

            <TouchableOpacity style={styles.signUpButtonContainer}>
              <LinearGradient
                colors={['#FFA726', '#EF5350']}
                style={styles.signUpButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.signUpButtonText}>Sign up to be a Driver</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.requestButton}>
          <View style={styles.buttonContent}>
            <View style={styles.textContainer}>
              <Text style={styles.requestButtonText}>Need a ride for my kid</Text>
              <Text style={styles.requestSubText}>Notify me when a ride matches</Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.activeRequestText}>Active Request</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center', 
  },
  disabledButtonText: {
    fontSize: 18,
    color: '#aaa',
  },
  subText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  signupText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 10,
  },
  signUpButtonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  signUpButton: {
    width: '90%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  requestButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  requestButtonText: {
    fontSize: 18,
    color: '#333',
  },
  requestSubText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  activeRequestText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  arrowIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  disabledArrowIcon: {
    tintColor: '#aaa',
  },
});

export default NewRideScreen;
