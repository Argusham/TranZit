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
        } ${className} font-semibold bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center hover:shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {loading ? <>Loading...</> : title}
    </button>
  );
}

export default PrimaryButton;
