interface PaymentFormProps {
    recipient: string;
    setRecipient: (value: string) => void;
    amount: string;
    setAmount: (value: string) => void;
    handlePayment: () => void;
    loading: boolean;
  }
  
  const PaymentForm = ({
    recipient,
    setRecipient,
    amount,
    setAmount,
    handlePayment,
    loading,
  }: PaymentFormProps) => {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Send Payment</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Amount in cUSD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`p-2 rounded-md text-white ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Send Payment'}
          </button>
        </div>
      </div>
    );
  };
  
  export default PaymentForm;
  