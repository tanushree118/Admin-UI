import React from "react";
import { configure, mount } from "enzyme";
import App from "./App";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { act } from "react-dom/test-utils";
import { TextField, TableCell, Checkbox } from "@mui/material";
import { testData1, testData3 } from "./utils/testData.jsx";

configure({ adapter: new Adapter() });

describe("test the app component when table data's length is less than rows per page", () => {
  let wrapper;
  beforeEach(async () => {
    await act(async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(testData1),
        })
      );
      wrapper = mount(<App />);
    });
  });
  it("should test the search event when all rows are selected", async () => {
    const mockSearchText = "member";
    let textField = wrapper.find(TextField).get(0);
    act(() => {
      textField.props.onChange({ target: { value: mockSearchText } });
    });
    wrapper.update();
    expect(wrapper.find(TextField).get(0).props.value).toBe(mockSearchText);

    const mockSearchText1 = "@mailinator.com";
    act(() => {
      textField.props.onChange({ target: { value: mockSearchText1 } });
    });
    wrapper.update();
    expect(wrapper.find(TextField).get(0).props.value).toBe(mockSearchText1);

    let globalCheckbox = wrapper.find(TableCell).find(Checkbox).get(0);
    act(() => {
      globalCheckbox.props.onChange();
    });

    wrapper.update();
    expect(
      wrapper.find(TableCell).find(Checkbox).get(0).props.checked
    ).toBeTruthy();
    wrapper.update();
    const mockSearchText2 = "member";
    act(() => {
      textField.props.onChange({ target: { value: mockSearchText2 } });
    });

    wrapper.update();
    expect(wrapper.find(TextField).get(0).props.value).toBe(mockSearchText2);
  });
});

describe("test the app component when table data's length is greater than rows per page", () => {
  let wrapper;
  beforeEach(async () => {
    await act(async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(testData3),
        })
      );
      wrapper = mount(<App />);
    });
  });
  it("should test the search event when all rows are selected", async () => {
    let textField = wrapper.find(TextField).get(0);
    const mockSearchText1 = "@mailinator.com";
    act(() => {
      textField.props.onChange({ target: { value: mockSearchText1 } });
    });
    wrapper.update();
    expect(wrapper.find(TextField).get(0).props.value).toBe(mockSearchText1);
    let globalCheckbox = wrapper.find(TableCell).find(Checkbox).get(0);
    act(() => {
      globalCheckbox.props.onChange();
    });
    wrapper.update();
    expect(
      wrapper.find(TableCell).find(Checkbox).get(0).props.checked
    ).toBeTruthy();
  });
  it("should test the search event when all rows are selected and after search action results in no rows", async () => {
    let textField = wrapper.find(TextField).get(0);
    const mockSearchText1 = "blah";
    act(() => {
      textField.props.onChange({ target: { value: mockSearchText1 } });
    });
    wrapper.update();
    expect(wrapper.find(TextField).get(0).props.value).toBe(mockSearchText1);
    let globalCheckbox = wrapper.find(TableCell).find(Checkbox).get(0);
    act(() => {
      globalCheckbox.props.onChange();
    });
    wrapper.update();
    expect(
      wrapper.find(TableCell).find(Checkbox).get(0).props.checked
    ).toBeTruthy();
  });
});

describe("should test the app when api fails", () => {
  beforeEach(async () => {
    await act(async () => {
      global.fetch = jest.fn(() => Promise.reject("Api Failure"));
    });
  });
  it("should test api failure", async () => {
    await act(async () => {
      mount(<App />);
    });
  });
});
