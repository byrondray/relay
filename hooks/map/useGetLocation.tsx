import { useSubscription } from "@apollo/client";
import { LOCATION_RECEIVED_SUBSCRIPTION } from "@/graphql/map/queries";

export const useLocationSubscription = (recipientId: string) => {
  if (!recipientId) {
    console.error("Recipient ID is required for location subscription.");
    return { data: null, error: "Recipient ID is required" };
  }

  const { data, error } = useSubscription(LOCATION_RECEIVED_SUBSCRIPTION, {
    variables: { recipientId },
    onComplete: () => {
      console.log("Subscription completed");
    },
  });

  if (error) {
    console.error("Subscription error:", error.message);
  }

  return { data, error };
};
