import { useCallback, useState } from "react";

const useDisclosure = (defaultState = false) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  return { isOpen, open, close, toggle };
};

export default useDisclosure;
