# Running Relay Locally!

Relay is Canada’s first ridesharing mobile app for parents, designed to make it easy to arrange safe and reliable transportation for your children. Whether you’re a busy parent juggling a hectic schedule or a new immigrant seeking to expand your network, Relay connects you with **trusted families** in your community—no random drivers. Parents can share the driving load, save time, and reduce stress by connecting with others from school or activity groups. With **real-time GPS tracking, AI ride updates, and smart route matching**, Relay simplifies carpooling, helping both parents and kids build social bonds while ensuring a safe, stress-free ride.

## Before You Begin

You will need to have the following installed before running our app locally:
1. ensure you have software on your device to run the code such as VS code
2. Install Expo Go on your mobile device and make sure to sign up. This app is suitable for both Android and iOS

## Github
Navigate to the relay github repository and copy the link under "code".
Copy that code and open your terminal and do the following command:
git clone the repository URL https://github.com/byrondray/relay.git

## Getting started in VS code

1. cd relay
2. run npm install to set up the necessary packages
3. npx expo start will make the server begin to run

## Expo Go

After running npx expo start, there will be a QR code that appears in your terminal. You can scan the QR code immediatly, or chose one of the following options:
1. Choose the Tunnel connection option if:
Your device and computer are on different networks.
You want to avoid configuring network settings.
2. LAN (Local Area Network) Uses your local network to connect your computer and mobile device
3. Local Connects directly using your computer's IP address and port
4. Press "s" and a new QR code will display. This option may be useful if the initial QR code doesnt work as it generates a brand new QR code and Ensure the app is configured to use the right connection mode for your setup.

The terminal will likely present you with other options you can explore if something isn't working.
**IMPORTANT** Make sure your mobile and desktop device are on the same WIFI network when working with an Expo App.

## What next?
After following the QR code link, your device should automatically open the Expo Go app where you can begin using Relay!


