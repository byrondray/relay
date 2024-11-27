import { RequestWithChildrenAndParent } from "@/graphql/generated";

export function getUniqueRequestsByParent(
  requests: RequestWithChildrenAndParent[]
): RequestWithChildrenAndParent[] {
  const uniqueRequestsMap = new Map<string, RequestWithChildrenAndParent>();

  for (const request of requests) {
    if (!uniqueRequestsMap.has(request.parentId)) {
      uniqueRequestsMap.set(request.parentId, request);
    }
  }

  return Array.from(uniqueRequestsMap.values());
}
