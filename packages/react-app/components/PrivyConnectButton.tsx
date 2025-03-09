import { usePrivy } from "@privy-io/react-auth";

export default function PrivyConnectButton() {
  const { login, logout, user, authenticated } = usePrivy();

  return (
    <div>
      {authenticated ? (
        <div>
          <p>Connected as: {user?.wallet?.address}</p>
          <button onClick={logout} style={styles.button}>
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={login} style={styles.button}>
          Connect with Privy
        </button>
      )}
    </div>
  );
}

const styles = {
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "#fff",
  },
};
