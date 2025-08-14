import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import SignUp from "./signup/SignUp";
import Regist from "./regist/Regist";
import AvatarSelect from "./avatarselect/AvatarSelect";

const RegistrationFlow: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const goToNextStep = (): void => {
    setStep((prevStep) => prevStep + 1);
  };
  switch (step) {
    case 1:
      return <SignUp onComplete={goToNextStep} />;
    case 2:
      return <Regist onComplete={goToNextStep} />;
    case 3:
      return <AvatarSelect onComplete={goToNextStep} />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default RegistrationFlow;
