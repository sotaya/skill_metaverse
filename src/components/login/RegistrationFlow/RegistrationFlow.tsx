import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SignUp from "./signup/SignUp";
import Regist from "./regist/Regist";
import AvatarSelect from "./avatarselect/AvatarSelect";

const RegistrationFlow: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();
  const goToNextStep = (): void => {
    setStep((prevStep) => prevStep + 1);
  };
  const handleFlowComplete = (): void => {
    navigate("/");
  };
  switch (step) {
    case 1:
      return <SignUp onComplete={goToNextStep} />;
    case 2:
      return <Regist onComplete={goToNextStep} />;
    case 3:
      return <AvatarSelect onComplete={handleFlowComplete} />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default RegistrationFlow;
