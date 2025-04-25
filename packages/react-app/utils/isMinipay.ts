// utils/MiniPay.ts function to detect if the user is accessing your dApp via MiniPay:
export function isMiniPay(): boolean {
    if (typeof window === "undefined") return false;
    const provider = (window as any).ethereum;
    return provider && provider.isMiniPay;
  }
  