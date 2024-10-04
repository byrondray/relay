import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useMutation } from "@apollo/client";
import { CreateUserMutation } from "@/graphql/generated";
import client from "@/graphql/client";
import { CREATE_USER } from "@/graphql/queries";
import { SimpleButton } from "@/components/test/button";

export default function AuthScreen(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  const [
    createUser,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation<
    CreateUserMutation,
    { name: string; email: string; password: string }
  >(CREATE_USER, {
    client,
  });

  const handleSignUp = async () => {
    try {
      console.log("Submitting mutation with:", { name, email, password });
      const result = await createUser({
        variables: {
          name,
          email,
          password,
        },
      });

      console.log("Mutation result:", result);
      setUser(result.data?.createUser || null);
      setError("");
    } catch (err: any) {
      console.error("Error occurred:", err);
      setError(err.message);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 60 }}>
      {user ? (
        <Text>Welcome {user.email}</Text>
      ) : (
        <View>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: "black",
            }}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: "black",
            }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: "black",
            }}
          />
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
          <Button title="Sign Up" onPress={handleSignUp} />
          <SimpleButton />
        </View>
      )}
    </View>
  );
}
