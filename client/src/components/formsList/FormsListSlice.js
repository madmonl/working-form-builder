/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const formsListSlice = createSlice({
  name: 'forms',
  initialState: {
    value: { forms: {} }
  },
  reducers: {
    addForm: (state, action) => {
      const { id } = action.payload;
      state.value.forms[id] = action.payload;
    },
    addFormSubmission: (state, action) => {
      const { submission, formID } = action.payload;
      state.value.forms[formID].submissions.push(submission);
    },
    setForms: (state, action) => {
      state.value.forms = action.payload;
    }
  }
});

const {
  addForm,
  setForms,
  addFormSubmission
} = formsListSlice.actions;


export const selectSubmissionsHeader = (state, id) => {
  if (Object.keys(state.forms.value.forms).length === 0) {
    return [];
  }

  const { forms } = state.forms.value;
  const sortedKeys = Object.keys(forms[id].body).sort((a, b) => (a < b ? -1 : 1));
  const header = [];
  sortedKeys.forEach((key, index) => header.push({
    name: forms[id].body[key].name,
    id: index
  }));

  return header;
};

export const selectSubmissionsRows = (state, id) => {
  if (Object.keys(state.forms.value.forms).length === 0) {
    return [];
  }

  const rows = [];
  state.forms.value.forms[id].submissions.forEach((submission) => {
    const sortedKeys = Object.keys(submission).sort((a, b) => (a < b ? -1 : 1));
    const row = [];
    sortedKeys.forEach((key) => {
      row.push({ submission: submission[key], submissionID: key });
    });

    rows.push({ row, id: submission.id });
  });

  return rows;
};

export const selectForm = (state, id) => {
  if (Object.keys(state.forms.value.forms).length === 0) {
    return { title: '', body: {} }
  }
  return state.forms.value.forms[id];
}

export const selectForms = (state) => Object.values(state.forms.value.forms).map(({
  id,
  title,
  submissions
}) => ({
  id,
  title,
  submissions
}));

export function addFormAsync(form) {
  return async (dispatch) => {
    const res = await axios.post(`/api/forms/`, form);
    return dispatch(addForm(res.data));
  }
}

export function setFormsAsync() {
  return async (dispatch) => {
    const res = await axios.get(`/api/forms/`);
    return dispatch(setForms(res.data));
  }
}

export function addFormSubmissionAsync({ formID, submission }) {
  return async (dispatch) => {
    await axios.post(`/api/forms/submit/${formID}`, submission);
    return dispatch(addFormSubmission({ formID, submission }));
  }
}

export default formsListSlice.reducer;
