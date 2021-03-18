import { useState } from "react";
import { useHistory } from "react-router-dom";

const useHandleAuthorization = ({ path, funct }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleFormSubmit = async (fields, { setStatus, setSubmitting }) => {
    setStatus();
    try {
      await funct(fields);
      history.push(path);
    } catch (err) {
      setSubmitting(false);
      setStatus(err.message);
      setMessage(err.message);
      setOpen(true);
    }
  };

  return (
    { handleFormSubmit, open, setOpen, message }
  )

}

export default useHandleAuthorization;

