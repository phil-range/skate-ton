import useSWRMutation from "swr/mutation";
import { IntentData } from "@/types";
import { relayerApiProvider } from "@/sdk/ApiProvider";

export function useRelayer() {
  return useSWRMutation<any, any, string, IntentData, any>(
    `relayer/consume`,
    async (url, { arg }) => {
      return await relayerApiProvider.post(url, arg);
    }
  );
}
