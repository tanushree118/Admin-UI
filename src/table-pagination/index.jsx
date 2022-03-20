import React from "react";
import { Button } from "@mui/material";
import styles from "./table-pagination.module.scss";

const TablePagination = ({
  count,
  rowsPerPage,
  selectedPage,
  onPageChange,
}) => {
  const pagesCount =
    count % rowsPerPage
      ? Math.floor(count / rowsPerPage) + 1
      : count / rowsPerPage;
  const pagesArray = [];
  for (let i = 0; i < pagesCount; i++) {
    pagesArray.push(i);
  }
  return (
    <div className={styles.pagination}>
      <Button
        className={`${
          selectedPage === 0 && styles.disabled || styles.button
        }`}
        onClick={(event) => onPageChange(event, 0)}
        disabled={selectedPage === 0}
      >
        {"<<"}
      </Button>
      <Button
        className={`${selectedPage === 0 && styles.disabled || styles.button}`}
        onClick={(event) => onPageChange(event, selectedPage - 1)}
        disabled={selectedPage === 0}
      >
        {"<"}
      </Button>
      {pagesArray?.map((page, index) => {
        return (
          <Button
            key={index}
            className={`${
              selectedPage === page ? styles.buttonSelected : styles.button
            }`}
            onClick={(event) => onPageChange(event, page)}
          >
            {page + 1}
          </Button>
        );
      })}
      <Button
        className={`${
          selectedPage === pagesCount - 1 ? styles.disabled : styles.button
        }`}
        onClick={(event) => onPageChange(event, selectedPage + 1)}
        disabled={selectedPage === pagesCount - 1}
      >
        {">"}
      </Button>
      <Button
        className={`${
          selectedPage === pagesCount - 1 ? styles.disabled : styles.button
        }`}
        onClick={(event) => onPageChange(event, pagesCount - 1)}
        disabled={selectedPage === pagesCount - 1}
      >
        {">>"}
      </Button>
    </div>
  );
};

export default TablePagination;
