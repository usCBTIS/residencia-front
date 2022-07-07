import { useState } from "react";
import {
  SolutionOutlined,
  SelectOutlined,
  FileAddOutlined
} from "@ant-design/icons";
import { Button, message, Steps } from "antd";

import "../../styles/FormAspirant.modules.css";
import FormGeneralData from "../../components/aspirant/FormGeneralData";
import FormSpecialty from "../../components/aspirant/FormSpecialty";

const { Step } = Steps;

function FormAspirant({ data }) {
  let haveAddress =
    data?.usersPermissionsUser?.data?.attributes?.aspirant?.data?.attributes
      ?.address?.data;
  let idAspirant =
    data?.usersPermissionsUser?.data?.attributes?.aspirant?.data?.id;
  const [current, setCurrent] = useState(haveAddress ? 1 : 0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Generales",
      content: <FormGeneralData next={next} idAspirant={idAspirant} />,
      icon: <SolutionOutlined />
    },
    {
      title: "Especialidad",
      content: <FormSpecialty next={next} idAspirant={idAspirant} />,
      icon: <SelectOutlined />
    },
    {
      title: "Documentos",
      content: "Last-content",
      icon: <FileAddOutlined />
    }
  ];

  return (
    <div className="container">
      <Steps current={current}>
        {steps.map((item) => (
          <Step
            key={item.title}
            title={item.title}
            icon={item.icon}
            status={item.status}
          />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button size="large" type="primary" onClick={() => next()}>
            Siguiente
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            size="large"
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Enviar
          </Button>
        )}
      </div>
    </div>
  );
}

export default FormAspirant;
