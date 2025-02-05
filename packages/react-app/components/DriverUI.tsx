import { useState } from "react";
import { PredefinedAmounts } from "@/components/PredefinedAmounts";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { TextField, Stack, Button, Tooltip, Dialog, DialogContent, Typography, IconButton, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface DriverUIProps {
  address: string;
  amount: string;
  setAmount: (amount: string) => void;
  predefinedAmounts: number[];
  conversionRate: number;
  showZar: boolean;
}

export const DriverUI = ({
  address,
  amount,
  setAmount,
  predefinedAmounts,
  conversionRate,
  showZar
}: DriverUIProps) => {
  const [isSettingAmount, setIsSettingAmount] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null); // State to track selected amount

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setSelectedAmount(null); // Reset selected amount when custom input is used
  };

  const handlePredefinedAmountClick = (amt: number) => {
    setIsSettingAmount(true);
    setSelectedAmount(amt); // Set selected amount
    setTimeout(() => {
      setAmount(amt.toString());
      setIsSettingAmount(false);
    }, 300);
  };

  const handleWithdrawClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <TextField
        id="custom-amount"
        label={`Enter fare amount (${showZar ? 'ZAR' : 'cUSD'})`}
        variant="outlined"
        value={amount}
        fullWidth
        onChange={handleCustomAmountChange}
        disabled={isSettingAmount}
        className="mb-3"
        InputProps={{
          style: {
            color: '#000000',
            borderColor: '#000000',
          },
        }}
        InputLabelProps={{
          style: {
            color: '#facc15',
          },
        }}
        placeholder="Enter fare amount"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000',
            },
            '&:hover fieldset': {
              borderColor: '#000000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
          '& .MuiInputBase-input': {
            color: '#000000',
          },
          '& .MuiInputLabel-root': {
            color: '#000000',
          },
        }}
      />

      {isSettingAmount ? (
        <Stack alignItems="center" sx={{ marginY: 2 }}>
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <PredefinedAmounts
          predefinedAmounts={predefinedAmounts}
          handleAmountClick={handlePredefinedAmountClick}
          conversionRate={conversionRate || 1}
          showZar={showZar}
        />
      )}

      {amount && !isSettingAmount && (
        <QRCodeDisplay recipient={address} amount={amount} />
      )}

      {/* Withdraw Button with Tooltip and Modal */}
      <span onClick={handleWithdrawClick}>
        <Tooltip title="This feature is coming soon!">
          <Button
            variant="contained"
            disabled
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: '#808080',
              color: '#FFFFFF',
            }}
          >
            Withdraw (Coming Soon)
          </Button>
        </Tooltip>
      </span>

      {/* Modal for future update notice */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="textPrimary">Future Feature</Typography>
            <IconButton onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </Stack>
          <Typography variant="body1" mt={2} color="textSecondary">
            The withdraw feature is currently unavailable but will be added soon. Stay tuned for future updates!
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};
