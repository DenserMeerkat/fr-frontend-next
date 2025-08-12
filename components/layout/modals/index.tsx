import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import SettingsModal from "./settings";
import BalanceModal from "./balance";

const Modals = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modal = searchParams.get("modal");

  const VALID_MODALS = ["settings", "balance"];

  const removeModalParam = () => {
    router.replace("?");
  };

  useEffect(() => {
    if (modal && !VALID_MODALS.includes(modal)) {
      removeModalParam();
    }
  }, [modal, removeModalParam, VALID_MODALS]);

  switch (modal) {
    case "settings":
      return <SettingsModal onClose={removeModalParam} />;
    case "balance":
      return <BalanceModal onClose={removeModalParam} />;
    default:
      return null;
  }
};

export default Modals;
