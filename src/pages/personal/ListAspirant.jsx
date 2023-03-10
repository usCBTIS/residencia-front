import { useState } from "react";
import { Space, Table, Tag, Skeleton } from "antd";
import { GiCheckMark } from "react-icons/gi";
import { MdModeEdit } from "react-icons/md";
import { useQuery } from "@apollo/client/react";
import { GET_LIST_ASPIRANTS } from "../../graphql/queries";
import Profile from "../../components/aspirant/Profile";
import Modal from "../../components/Modal";
import { updateAspirant } from "../../api/personal/updateAspirant";
import { Warning, ModalInput, Error } from "../../components/Alerts";
import { Loading } from "../../components/Loading";

const colorByStatus = (status) => {
  switch (status) {
    case "registrado":
      return "#8898aa";
    case "generales":
      return "#725b10";
    case "documentos":
      return "#725b10";
    case "enviado":
      return "#01b6a4";
    case "observaciones":
      return "#5b08e2";
    case "aprobado":
      return "#16bd3f";
    case "rechazado":
      return "#fd4a4a";
    default:
      return "#8898aa";
  }
};

function ListAspirant() {
  const { data, loading, error, refetch } = useQuery(GET_LIST_ASPIRANTS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idAspirant, setIdAspirant] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [status, setStatus] = useState(null);

  if (error) {
    return Error("Ah ocurrido un error al traer los datos", error?.message);
  }

  let newData = [];

  if (data) {
    data?.aspirants?.data?.map((aspirant) => {
      const user = aspirant?.attributes?.user?.data?.attributes;
      const idUser = aspirant?.attributes?.user?.data?.id;
      if (user) {
        const specialty =
          aspirant?.attributes?.specialtyOption?.data?.attributes?.specialty
            ?.data?.attributes;

        newData = [
          ...newData,
          {
            key: aspirant?.id,
            id: idUser,
            name: user
              ? `${user.name} ${user.firstLastName} ${user.secondLastName}`
              : "",
            birthday: user ? user.birthday : "",
            gender: user ? user.gender : "",
            status: aspirant?.attributes?.status,
            specialty: specialty?.description
          }
        ];
      }
      return null;
    });
  }

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Especialidad",
      dataIndex: "specialty",
      key: "specialty",
      responsive: ["md"]
    },
    {
      title: "Estado",
      key: "status",
      dataIndex: "status",
      render: (_, { key, status }) => {
        let color = colorByStatus(status);

        return (
          <Tag style={{ borderRadius: 10 }} color={color} key={key}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: "Nacimiento",
      dataIndex: "birthday",
      key: "birthday",
      responsive: ["md"]
    },
    {
      title: "Sexo",
      dataIndex: "gender",
      key: "gender",
      responsive: ["md"],
      render: (_, { gender }) =>
        gender === "Hombre" ? "M" : gender === "Mujer" ? "F" : ""
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const { status } = record;
        if (status === "enviado") {
          return (
            <Space size="small">
              <div className="tooltip" data-tip="Observaciones">
                <MdModeEdit
                  size={24}
                  color="#8898aa"
                  cursor="pointer"
                  onClick={() => handleClickMessage(record.key)}
                />
              </div>
              <div className="tooltip tooltip-success" data-tip="Aceptar">
                <GiCheckMark
                  size={24}
                  color="#16bd3f"
                  onClick={() => handleClickAccept(record.key)}
                  cursor="pointer"
                />
              </div>
            </Space>
          );
        }
      }
    }
  ];

  const showModal = (id) => {
    setIdUser(id);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleClickAccept = async (id) => {
    Warning(
      "??Est??s seguro de que los datos son correctos?",
      "Estas confirmando que los datos del aspirante son correctos y quedar?? aprobado.",
      "Confirmar",
      async () => await actionUpdateAspirant({ statusRequest: "aprobado" }, id)
    );
  };

  const handleClickDecline = async (id) => {
    Warning(
      "??Est??s seguro de querer rechazar al aspirante?",
      "Este aspirante quedar?? rechazado.",
      "Confirmar",
      async () => await actionUpdateAspirant({ statusRequest: "rechazado" }, id)
    );
  };

  const handleClickMessage = async (id) => {
    const text = await ModalInput("Observaci??n");
    if (text) {
      console.log(text);
      await actionUpdateAspirant({ statusRequest: "observaciones" }, id);
    }
  };

  const actionUpdateAspirant = async (data, id) => {
    setLoadingAction(true);
    const response = await updateAspirant(data, id);
    // console.log(response);
    resultForResponse(response);
    setIsModalVisible(false);
    setLoadingAction(false);
  };

  const resultForResponse = (response) => {
    if (response?.data) {
      refetch();
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Lista de solicitud de aspirantes</h1>

      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          onRow={(row) => ({
            onDoubleClick: () => {
              const { status } = row;
              setStatus(status);
              setIdAspirant(row?.key);
              showModal(row?.id);
            }
          })}
          columns={columns}
          dataSource={newData}
          pagination={{
            position: ["topRight"]
          }}
        />
      )}

      {loadingAction && <Loading />}

      {isModalVisible && (
        <Modal
          close={handleClose}
          accept={() => handleClickAccept(idAspirant)}
          decline={() => handleClickDecline(idAspirant)}
          message={() => handleClickMessage(idAspirant)}
          haveActions={status === "enviado"}
        >
          <Profile id={idUser} />
        </Modal>
      )}
    </>
  );
}

export default ListAspirant;
