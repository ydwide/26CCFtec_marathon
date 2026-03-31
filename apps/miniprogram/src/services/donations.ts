export async function createDonationCase(payload: {
  title: string;
  conditionLabel: string;
  description: string;
}) {
  return {
    id: "mock-case",
    ...payload
  };
}
