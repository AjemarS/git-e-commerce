import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type ExpandIconProps = {
  expanded: boolean;
  onClick: () => void;
};

const ExpandIcon: React.FC<ExpandIconProps> = ({ expanded, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  const { transform } = useSpring({
    transform: `rotate(${isExpanded ? 180 : 90}deg)`,
  });

  return (
    <animated.div style={{ transform }} onClick={onClick}>
      <ExpandLessIcon />
    </animated.div>
  );
};

export default ExpandIcon;
