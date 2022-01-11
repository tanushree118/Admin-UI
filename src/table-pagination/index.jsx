import React from "react";
import { Button } from "@mui/material";
import styles from "./table-pagination.module.scss";

const TablePagination = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  showFirstButton,
  showLastButton,
}) => {
  const pagesCount = Math.floor(count / rowsPerPage);
  const pagesArray = [];
  for (let i = 0; i <= pagesCount; i++) {
    pagesArray.push(i);
  }
  return (
    <div className={styles.pagination}>
      {showFirstButton ? (
        <Button
          className={`${page === 0 ? styles.disabled : styles.button}`}
          onClick={(event) => onPageChange(event, 0)}
          disabled={page === 0}
        >
          {"<<"}
        </Button>
      ) : (
        ""
      )}
      <Button
        className={`${page === 0 ? styles.disabled : styles.button}`}
        onClick={(event) => onPageChange(event, page - 1)}
        disabled={page === 0}
      >
        {"<"}
      </Button>
      {pagesArray?.map((row, index) => {
        return (
          <Button
            key={index}
            className={`${
              page === row ? `${styles.buttonSelected}` : styles.button
            }`}
            onClick={(event) => onPageChange(event, row)}
          >
            {row + 1}
          </Button>
        );
      })}
      <Button
        className={`${page === pagesCount ? styles.disabled : styles.button}`}
        onClick={(event) => onPageChange(event, page + 1)}
        disabled={page === pagesCount}
      >
        {">"}
      </Button>
      {showLastButton ? (
        <Button
          className={`${page === pagesCount ? styles.disabled : styles.button}`}
          onClick={(event) => onPageChange(event, pagesCount)}
          disabled={page === pagesCount}
        >
          {">>"}
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default TablePagination;
