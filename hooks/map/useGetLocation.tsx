import { useSubscription } from "@apollo/client";
import { LOCATION_RECEIVED_SUBSCRIPTION } from "@/graphql/queries";

export const useLocationSubscription = (recipientId: string) => {
  const { data, loading, error } = useSubscription(
    LOCATION_RECEIVED_SUBSCRIPTION,
    {
      variables: { recipientId },
    }
  );

  return { data, loading, error };
};
