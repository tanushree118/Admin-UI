import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  Box,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import styles from "./admin-ui.module.scss";
import TablePagination from "../table-pagination";

const columns = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "email",
    label: "Email",
  },
  {
    id: "role",
    label: "Role",
  },
  {
    id: "actions",
    label: "Actions",
  },
];

const defaultTextFieldValues = {
  name: "",
  email: "",
  role: "",
};

const AdminUITable = ({
  page,
  setPage,
  tableData,
  setTableData,
  filteredTableData,
  globalSelected,
  setGlobalSelected,
  searchText,
}) => {
  const [editAction, setEditAction] = useState({ id: "" });
  const [newRowValues, setNewRowValues] = useState(defaultTextFieldValues);
  const rowsPerPage = 10;
  const lastPageCount = filteredTableData?.length % rowsPerPage;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    let count = 0;
    for (
      let i = newPage * rowsPerPage;
      i < newPage * rowsPerPage + rowsPerPage;
      i++
    ) {
      if (filteredTableData[i]?.checked) {
        count++;
      }
    }
    // The global selection would be true if the number of checked rows matches with
    // the number of rows in a page or if the user is at the last page then the global
    // selection would be true if the checked rows' count matches with the number of rows present
    // in the last page and the last rows' index is greater than table rows' length
    if (
      count === rowsPerPage ||
      (count === lastPageCount &&
        newPage * rowsPerPage + rowsPerPage > filteredTableData.length)
    ) {
      setGlobalSelected(true);
    } else {
      setGlobalSelected(false);
    }
  };

  /*
  The function handles the selection/non-selection of each row on the page
  on the basis of global selection
  */
  const handleGlobalSelect = () => {
    setGlobalSelected(!globalSelected);
    let updatedTableData = filteredTableData?.map((ele, index) => {
      if (
        index === page * rowsPerPage ||
        (index > page * rowsPerPage && index < page * rowsPerPage + rowsPerPage)
      ) {
        return { ...ele, checked: !globalSelected };
      } else {
        return { ...ele };
      }
    });
    if (searchText) {
      let updatedFilteredTableData = tableData?.map((ele) => {
        let temp = updatedTableData?.filter((row) => row.id === ele.id);
        if (temp?.length > 0) {
          return temp[0];
        } else {
          return ele;
        }
      });
      setTableData(updatedFilteredTableData);
    } else {
      setTableData(updatedTableData);
    }
  };

  const handleRowSelect = (id) => {
    let updatedTableData = tableData?.map((ele) =>
      ele.id === id ? { ...ele, checked: !ele.checked } : { ...ele }
    );
    const rowToBeChanged = tableData?.filter((ele) => ele.id === id);
    let count = 0;
    for (
      let i = page * rowsPerPage;
      i < page * rowsPerPage + rowsPerPage;
      i++
    ) {
      if (filteredTableData[i]?.checked) {
        count++;
      }
    }
    if (
      count === rowsPerPage ||
      (count === lastPageCount &&
        page * rowsPerPage + rowsPerPage > filteredTableData?.length)
    ) {
      setGlobalSelected(false);
    } else if (
      count === rowsPerPage - 1 ||
      (count === lastPageCount - 1 &&
        page * rowsPerPage + rowsPerPage > filteredTableData?.length)
    ) {
      if (!rowToBeChanged[0].checked) {
        setGlobalSelected(true);
      }
    }
    setTableData(updatedTableData);
  };

  const handleGlobalDelete = () => {
    let updatedTableData = tableData?.filter((ele) => !ele.checked);
    setTableData(updatedTableData);
    setGlobalSelected(false);
  };

  const deleteRow = (id) => {
    let updatedTableData = tableData?.filter((ele) => (ele.id !== id));
    setTableData(updatedTableData);
  };

  const triggerEditAction = (id) => {
    setEditAction({ id: id});
    const rowToEdit = tableData?.filter((row) => row.id === id);
    let updatedTextFieldValue = {
      name: rowToEdit[0].name,
      role: rowToEdit[0].role,
      email: rowToEdit[0].email,
    };
    setNewRowValues(updatedTextFieldValue);
  };

  const changeRowValues = (event, fieldToEdit) => {
    let updatedTextFieldValues = {
      ...newRowValues,
      [fieldToEdit]: event.target.value,
    };
    setNewRowValues(updatedTextFieldValues);
  };

  const editRow = (rowToEdit) => {
    const updatedTableData = tableData?.map((ele) => {
      if (ele.id === rowToEdit) {
        return {
          id: ele.id,
          name: newRowValues.name,
          email: newRowValues.email,
          role: newRowValues.role,
          checked: ele.checked,
        };
      } else {
        return ele;
      }
    });
    setTableData(updatedTableData);
    setEditAction({ id: "" });
  };

  const resetRow = () => {
    setEditAction({ id: "" });
  };

  const sortTableOnAscOrder = (columnId) => {
    const columnToBeSorted = columnId;
    let updatedTableData = tableData?.sort((a, b) => {
      return a[columnToBeSorted].localeCompare(b[columnToBeSorted]);
    });
    setTableData([...updatedTableData]);
  };

  const sortTableOnDescOrder = (columnId) => {
    const columnToBeSorted = columnId;
    let updatedTableData = tableData?.sort((a, b) => {
      return b[columnToBeSorted].localeCompare(a[columnToBeSorted]);
    });
    setTableData([...updatedTableData]);
  };
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow className={styles.tableRow}>
            <TableCell className={styles.tableCell}>
              <Checkbox
                checked={globalSelected}
                onChange={handleGlobalSelect}
              />
            </TableCell>
            {columns.map((ele, index) => (
              <TableCell
                key={index}
                className={`${styles.tableHeaders} ${styles.tableCell}`}
              >
                {ele.label}
                {ele.id !== "actions" && (
                  <>
                    <Button className={styles.ascOrder} onClick={() => sortTableOnAscOrder(ele.id)}>
                      <ArrowUpwardIcon />
                    </Button>
                    <Button className={styles.ascOrder} onClick={() => sortTableOnDescOrder(ele.id)}>
                      <ArrowDownwardIcon />
                    </Button>
                  </>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className={styles.row}>
          {filteredTableData
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow
                key={row.id}
                className={row.checked ? styles.highlightedRow : ""}
              >
                <TableCell className={styles.tableCell}>
                  <Checkbox
                    checked={row.checked}
                    onChange={() => {
                      handleRowSelect(row.id);
                    }}
                  />
                </TableCell>
                {/* {viewRowInEditMode(row)} */}
                {columns?.map((ele, index) => {
                  if (ele.id !== "actions") {
                    if (row.id === editAction.id) {
                      return (
                        <TableCell
                          key={index}
                          className={`${
                            ele.id === "role" ? styles.roleText : ""
                          } ${styles.tableCell}`}
                        >
                          <TextField
                            value={newRowValues[ele.id]}
                            onChange={(event) => changeRowValues(event, ele.id)}
                          />
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell
                          key={index}
                          className={`${
                            ele.id === "role" ? styles.roleText : ""
                          } ${styles.tableCell}`}
                        >
                          {row[ele.id]}
                        </TableCell>
                      );
                    }
                  } else {
                    return null;
                  }
                })}
                <TableCell
                  className={`${styles.tableCell} ${styles.actionCell}`}
                >
                  {row.id !== editAction.id ? (
                    <>
                      <EditIcon
                        className={styles.editIcon}
                        onClick={() => triggerEditAction(row.id)}
                      />
                      <DeleteIcon
                        className={styles.deleteIcon}
                        onClick={() => deleteRow(row.id)}
                      />
                    </>
                  ) : (
                    <>
                      <DoneIcon
                        className={styles.editIcon}
                        onClick={() => editRow(row.id)}
                      />
                      <ClearIcon
                        className={styles.deleteIcon}
                        onClick={() => resetRow()}
                      />
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Box className={styles.tableFooter}>
        <Button className={styles.button} onClick={handleGlobalDelete}>
          Delete Selected
        </Button>
        <Box className={styles.pagination}>
          <TablePagination
            count={filteredTableData?.length}
            rowsPerPage={rowsPerPage}
            selectedPage={page}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </div>
  );
};

export default AdminUITable;
