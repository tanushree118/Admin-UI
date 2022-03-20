import React, { useEffect, useState } from "react";
import AdminUITable from "./admin-ui";
import { TextField } from "@mui/material";
import styles from "./App.module.scss";
import apiCall from "./utils/api-call";

const url =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const data = {
  method: "GET",
};
const App = () => {
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [globalSelected, setGlobalSelected] = useState(false);
  
  useEffect(async () => {
    const result = await (apiCall(url, data));
    setTableData(result);
  }, []);
  useEffect(() => {
    const rowsPerPage = 10;
    let updatedTableData = filteredTableData?.filter((row) => {
      if (
        row?.name.toLowerCase().includes(searchText) ||
        row?.email.toLowerCase().includes(searchText) ||
        row?.role.toLowerCase().includes(searchText)
      ) {
        return { ...row };
      }
    });
    let count = 0;
    for (
      let i = page * rowsPerPage;
      i < page * rowsPerPage + rowsPerPage;
      i++
    ) {
      if (updatedTableData[i]?.checked) {
        count++;
      }
    }
    if (updatedTableData?.length !== 0) {
      if (
        count ===
          (updatedTableData?.length > rowsPerPage
            ? updatedTableData.length / rowsPerPage
            : updatedTableData.length) ||
        count === rowsPerPage
      ) {
        setGlobalSelected(true);
      } else {
        setGlobalSelected(false);
      }
    }
  }, [searchText]);

  const handleSearch = (event) => {
    const text = event.target.value?.toLowerCase();
    setSearchText(text);
    setPage(0);
  };

  let filteredTableData = tableData?.filter((row) => {
    if (
      row?.name.toLowerCase().includes(searchText) ||
      row?.email.toLowerCase().includes(searchText) ||
      row?.role.toLowerCase().includes(searchText)
    ) {
      return { ...row };
    }
  });

  return (
    <div className={styles.adminTable}>
      <TextField
        placeholder={"Search by name, email or role"}
        className={styles.searchBar}
        onChange={(event) => handleSearch(event)}
        value={searchText}
      />
      <AdminUITable
        page={page}
        setPage={setPage}
        tableData={tableData}
        filteredTableData={filteredTableData}
        setTableData={setTableData}
        searchText={searchText}
        globalSelected={globalSelected}
        setGlobalSelected={setGlobalSelected}
      />
    </div>
  );
};

export default App;
