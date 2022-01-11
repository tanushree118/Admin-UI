import React, { useEffect, useState } from "react";
import AdminUITable from "./admin-ui";
import { TextField } from "@mui/material";
import styles from "./App.module.scss";

const url =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const App = () => {
  const [tableData, setTableData] = useState([]);
  const [editedTableData, setEditedTableData] = useState([]);
  const [isActionDisabled, setIsActionDisabled] = useState(false);
  const [page, setPage] = useState(0);
  useEffect(() => {
    apiCall(url, data);
  }, []);
  const data = {
    method: "GET",
  };
  const apiCall = async (url) => {
    const apiResult = await fetch(url, data).then((response) =>
      response.json()
    );
    setEditedTableData(apiResult?.map((row) => ({ ...row, checked: false })));
    setTableData(apiResult?.map((row) => ({ ...row, checked: false })));
  };

  const handleSearch = (event) => {
    const searchText = (event.target.value).toLowerCase();
    let filteredTableData = editedTableData?.filter((row) => {
      if (
        row.name?.toLowerCase().includes(searchText) ||
        row.email?.toLowerCase().includes(searchText) ||
        row.role?.toLowerCase().includes(searchText)
      ) {
        return { ...row };
      }
    });
    if (searchText === "") {
      setTableData(editedTableData);
      setIsActionDisabled(false);
    } else {
      setTableData(filteredTableData);
      setIsActionDisabled(true);
    }
    setPage(0);
  };
  return (
    <div className={styles.adminTable}>
      <TextField
        placeholder={"Search by name, email or role"}
        className={styles.searchBar}
        onChange={(event) => handleSearch(event)}
      />
      <AdminUITable
        page={page}
        setPage={setPage}
        tableData={tableData}
        setTableData={setTableData}
        setEditedTableData={setEditedTableData}
        isActionDisabled={isActionDisabled}
      />
    </div>
  );
};

export default App;
