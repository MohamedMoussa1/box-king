import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

const BoxList = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/box-king/box`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBoxes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box>
      <h2>Box List</h2>
      <ul>
        {boxes.map((box) => (
          <li key={box.id}>{box.name}</li>
        ))}
      </ul>
    </Box>
  );
};

export default BoxList;
