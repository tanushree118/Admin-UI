import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import AdminUITable from "./index";
import { act } from "react-dom/test-utils";
import { Button, Checkbox, TextField } from "@mui/material";
import {
  testData1,
  testData2,
  testData3,
  testData4,
  testData5,
} from "../utils/testData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

configure({ adapter: new Adapter() });

describe("test the admin ui table", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <AdminUITable
        page={0}
        setPage={jest.fn()}
        tableData={testData1}
        setTableData={jest.fn()}
        filteredTableData={testData2}
        searchText={""}
        globalSelected={false}
        setGlobalSelected={jest.fn()}
      />
    );
  });
  it("should test the ascending order event", () => {
    const ascOrderIcon = wrapper.find(Button).get(0);
    act(() => {
      ascOrderIcon.props.onClick();
    });
  });
  it("should test the descending order event", () => {
    const descOrderIcon = wrapper.find(Button).get(1);
    act(() => {
      descOrderIcon.props.onClick();
    });
  });
  it("should test the row selection event", () => {
    let rowCheckbox = wrapper.find(Checkbox).get(2);
    expect(rowCheckbox.props.checked).toBeFalsy();
    act(() => {
      rowCheckbox.props.onChange();
    });
    wrapper.update();
  });
});

describe("test the admin ui table", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <AdminUITable
        page={0}
        setPage={jest.fn()}
        tableData={testData1}
        setTableData={jest.fn()}
        filteredTableData={testData5}
        searchText={""}
        globalSelected={true}
        setGlobalSelected={jest.fn()}
      />
    );
  });
  it("should test the row selection event", () => {
    let rowCheckbox = wrapper.find(Checkbox).get(2);
    expect(rowCheckbox.props.checked).toBeTruthy();
    act(() => {
      rowCheckbox.props.onChange();
    });
    wrapper.update();
  });
  it("should test the edit action on a row", async () => {
    let editIcon = wrapper.find(EditIcon).get(0);
    act(() => {
      editIcon.props.onClick();
    });
    wrapper.update();
    let textField = wrapper.find(TextField).get(0);
    act(() => {
      textField.props.onChange({ target: { value: "John Cena" } });
    });
    wrapper.update();
    expect(wrapper.find(TextField).get(0).props.value).toBe("John Cena");
    let doneIcon = wrapper.find(DoneIcon).get(0);
    act(() => {
      doneIcon.props.onClick();
    });
    wrapper.update();
  });
  it("should test the delete action on a row", () => {
    let deleteIcon = wrapper.find(DeleteIcon).get(0);
    act(() => {
      deleteIcon.props.onClick();
    });
  });
  it("should test the cancel action after editing the row", () => {
    let editIcon = wrapper.find(EditIcon).get(0);
    act(() => {
      editIcon.props.onClick();
    });
    wrapper.update();
    let textField = wrapper.find(TextField).get(0);
    act(() => {
      textField.props.onChange({ target: { value: "John Cena" } });
    });
    wrapper.update();
    let clearIcon = wrapper.find(ClearIcon).get(0);
    act(() => {
      clearIcon.props.onClick();
    });
    wrapper.update();
  });
  it("should test the global delete action", () => {
    let globalDelete = wrapper.find(Button).get(6);
    act(() => {
      globalDelete.props.onClick();
    });
  });
  it("should the global select action when no search filter is applied", () => {
    let globalCheckbox = wrapper.find(Checkbox).get(0);
    act(() => {
      globalCheckbox.props.onChange();
    });
  });
});

describe("should test the pagination functionality", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <AdminUITable
        page={0}
        setPage={jest.fn()}
        tableData={testData3}
        setTableData={jest.fn()}
        filteredTableData={testData4}
        searchText={""}
        globalSelected={false}
        setGlobalSelected={jest.fn()}
      />
    );
  });
  it("should test the previous page button", () => {
    let nextPageButton = wrapper.find(Button).get(10);
    act(() => {
      nextPageButton.props.onClick();
    });
    wrapper.update();
    let previousPageButton = wrapper.find(Button).get(8);
    act(() => {
      previousPageButton.props.onClick();
    });
  });
  it("should test the first page button", () => {
    let nextPageButton = wrapper.find(Button).get(10);
    act(() => {
      nextPageButton.props.onClick();
    });
    wrapper.update();
    let previousPageButton = wrapper.find(Button).get(7);
    act(() => {
      previousPageButton.props.onClick();
    });
  });
  it("should test the next page button", () => {
    let nextPageButton = wrapper.find(Button).get(9);
    act(() => {
      nextPageButton.props.onClick();
    });
    wrapper.update();
    let previousPageButton = wrapper.find(Button).get(11);
    act(() => {
      previousPageButton.props.onClick();
    });
  });
  it("should test the last page button", () => {
    let nextPageButton = wrapper.find(Button).get(9);
    act(() => {
      nextPageButton.props.onClick();
    });
    wrapper.update();
    let previousPageButton = wrapper.find(Button).get(12);
    act(() => {
      previousPageButton.props.onClick();
    });
  });
});

