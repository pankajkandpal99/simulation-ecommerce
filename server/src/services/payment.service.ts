export const simulatePayment = async (type: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  switch (type) {
    case "1":
      return {
        success: true,
        message: "Payment approved",
        transactionId: `TXN-${Date.now().toString().slice(-8)}`,
        gateway: "sandbox",
        status: "approved",
      };
    case "2":
      return {
        success: false,
        message: "Payment declined",
        transactionId: `TXN-${Date.now().toString().slice(-8)}`,
        gateway: "sandbox",
        status: "declined",
        reason: "Insufficient funds",
      };
    case "3":
      return {
        success: false,
        message: "Payment gateway error",
        transactionId: `TXN-${Date.now().toString().slice(-8)}`,
        gateway: "sandbox",
        status: "error",
        reason: "Gateway timeout",
      };
    default:
      return {
        success: false,
        message: "Invalid transaction type",
        transactionId: `TXN-${Date.now().toString().slice(-8)}`,
        gateway: "sandbox",
        status: "invalid",
      };
  }
};
