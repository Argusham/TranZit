interface TransactionDataProps {
    data: any;
    loading: boolean;
    error: any;
  }
  
  const TransactionData = ({ data, loading, error }: TransactionDataProps) => {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Recent Payments and Incentives</h2>
        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p>Error fetching data: {error.message}</p>
        ) : (
          <>
            <h3 className="text-lg font-semibold">Incentive Awards</h3>
            <ul className="text-gray-600">
              {data.incentiveAwardeds.map((award: any) => (
                <li key={award.id}>
                  User: {award.user}, Amount: {award.amount}
                </li>
              ))}
            </ul>
  
            <h3 className="text-lg font-semibold">Payments Made</h3>
            <ul className="text-gray-600">
              {data.paymentMades.map((payment: any) => (
                <li key={payment.id}>
                  Payer: {payment.payer}, Payee: {payment.payee}, Amount: {payment.amount}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };
  
  export default TransactionData;
  