import { useCallback } from "react";

const useClickSound = () => {
  const clickSound = new Audio("/sounds/click2.wav");

  const playClickSound = useCallback(() => {
    clickSound.play();
  }, []);

  return { playClickSound };
};

export default useClickSound;
