type Props = {
  title: string;
  onClick: () => void;
  widthFull?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

function PrimaryButton({
  title,
  onClick,
  widthFull = false,
  disabled,
  loading,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled ?? loading}
      className={`${
        widthFull ? "w-60" : "px-4"
      } ${className} font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl text-white py-3 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      {loading ? <>Loading...😶‍🌫️</> : title}
    </button>
  );
}

export default PrimaryButton;
