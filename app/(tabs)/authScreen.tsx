import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "@/graphql/queries";

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [createUser, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_USER);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      setUser(firebaseUser);

      await createUser({
        variables: {
          name,
          email: firebaseUser.email,
          firebaseUserId: firebaseUser.uid,
        },
      });
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {user ? (
        <Text>Welcome {user.email}</Text>
      ) : (
        <View>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
          <Button title="Sign Up" onPress={handleSignUp} />
          <Button title="Sign In" onPress={handleSignIn} />
        </View>
      )}
    </View>
  );
};

export default AuthScreen;
