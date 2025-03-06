import "./CreateBox.css";
import { Box } from "@mui/material";
import CustomForm from "../../components/CustomForm/CustomForm";
import useRedirectIfLoggedOut from "../../hooks/useRedirectIfLoggedOut";

const CreateBox = () => {
  const { checkingIfLoggedOut } = useRedirectIfLoggedOut();
  const fields = [
    {
      name: "box_name",
      label: "Box Name",
      type: "text",
      maxLength: 30,
      required: true,
    },
    {
      name: "box_description",
      label: "Description",
      type: "text",
      maxLength: 200,
      required: false,
    },
  ];

  const header = "Create Box";
  const buttonText = "Create Box";
  const errors = ["duplicateBoxName"];
  const createBox = true;

  if (checkingIfLoggedOut) return null;

  return (
    <Box className="page-container">
      <Box className="create-box-container">
        <Box className="img-container">
          <img
            src="/assets/create_box.jpg"
            alt="Create Box"
            className="create-box-img"
          />
        </Box>
        <Box className="custom-form-container">
          <CustomForm
            fields={fields}
            header={header}
            buttonText={buttonText}
            errors={errors}
            createBox={createBox}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateBox;
