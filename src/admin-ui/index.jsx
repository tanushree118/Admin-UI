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
import { ReactComponent as DeleteIcon } from "../icons/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../icons/editIcon.svg";
import { ReactComponent as TickIcon } from "../icons/tickIcon.svg";
import { ReactComponent as CrossIcon } from "../icons/crossIcon.svg";
import styles from "./admin-ui.module.scss";
import TablePagination from "../table-pagination/index.jsx";

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
  setEditedTableData,
  isActionDisabled,
}) => {
  const [globalSelected, setGlobalSelected] = useState(false);
  const [editAction, setEditAction] = useState({ id: "", edit: false });
  const [newRowValues, setNewRowValues] = useState(defaultTextFieldValues);
  const rowsPerPage = 10;
  const lastPageCount = tableData?.length % rowsPerPage;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    let count = 0;
    for (
      let i = newPage * rowsPerPage;
      i < newPage * rowsPerPage + rowsPerPage;
      i++
    ) {
      if (tableData[i]?.checked) {
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
        newPage * rowsPerPage + rowsPerPage > tableData.length)
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
    let updatedTableData = tableData?.map((ele, index) => {
      if (
        index === page * rowsPerPage ||
        (index > page * rowsPerPage && index < page * rowsPerPage + rowsPerPage)
      ) {
        return { ...ele, checked: !globalSelected };
      } else {
        return { ...ele };
      }
    });
    setTableData(updatedTableData);
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
      if (tableData[i]?.checked) {
        count++;
      }
    }
    if (
      count === rowsPerPage ||
      (count === lastPageCount &&
        page * rowsPerPage + rowsPerPage > tableData.length)
    ) {
      setGlobalSelected(false);
    } else if (
      count === rowsPerPage - 1 ||
      (count === lastPageCount - 1 &&
        page * rowsPerPage + rowsPerPage > tableData.length)
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
    setEditedTableData(updatedTableData);
    setGlobalSelected(false);
  };

  const deleteRow = (id) => {
    if (isActionDisabled) {
      return;
    }
    let updatedTableData = tableData?.filter((ele) => !(ele.id === id));
    setTableData(updatedTableData);
    setEditedTableData(updatedTableData);
  };

  const triggerEditAction = (id) => {
    if (isActionDisabled) {
      return;
    }
    setEditAction({ id: id, edit: !editAction.edit });
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
    setEditedTableData(updatedTableData);
    setEditAction({ id: "", editAction: false });
  };

  const resetRow = () => {
    setEditAction({ id: "", editAction: false });
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
                disabled={isActionDisabled}
              />
            </TableCell>
            {columns.map((ele, index) => (
              <TableCell
                key={index}
                className={`${styles.tableHeaders} ${styles.tableCell}`}
              >
                {ele.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className={styles.row}>
          {tableData
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
                    disabled={isActionDisabled}
                  />
                </TableCell>
                {columns?.map((ele, index) => {
                  if (ele.id !== "actions") {
                    if (row.id === editAction.id && editAction.edit) {
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
                  {!(row.id === editAction.id && editAction.edit) ? (
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
                      <TickIcon
                        className={styles.editIcon}
                        onClick={() => editRow(row.id)}
                      />
                      <CrossIcon
                        className={styles.deleteIcon}
                        onClick={() => resetRow(row.id)}
                      />
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Box className={styles.tableFooter}>
        <Button
          className={styles.button}
          onClick={handleGlobalDelete}
          disabled={isActionDisabled}
        >
          Delete Selected
        </Button>
        <Box className={styles.pagination}>
          <TablePagination
            count={tableData?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            showFirstButton={true}
            showLastButton={true}
          />
        </Box>
      </Box>
    </div>
  );
};

export default AdminUITable;
