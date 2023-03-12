import './style.css'
'use strict';

const form = document.getElementById('form');
const deleteBtn = document.getElementById('btn-del');
const checkboxInput = document.getElementById('checkbox-input');
const tbody = document.getElementById('tbody');
let targetData = {};
let addFlag = true;

let arr = [];

function createRow(arr) {
  tbody.innerHTML = '';
  arr.map((item) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    const tdCheck = document.createElement('td');
    const checkbox = document.createElement('input');
    item.isChecked ? (checkbox.checked = 'checked') : checkbox;
    checkbox.setAttribute('onchange', 'selectData(this)');
    checkbox.type = 'checkbox';
    checkbox.className = `form-check-input`;
    tdCheck.append(checkbox);
    tr.append(tdCheck);
    const tdFirstname = document.createElement('td');
    tdFirstname.innerHTML = item.firstname;
    tr.append(tdFirstname);
    const tdLastname = document.createElement('td');
    tdLastname.innerHTML = item.lastname;
    tr.append(tdLastname);
    const action = document.createElement('td');
    action.className = 'form-group';
    const delBtn = document.createElement('button');
    delBtn.setAttribute('onclick', 'deleteData(this)');
    delBtn.innerHTML = 'Delete';
    delBtn.className = 'btn btn-danger';
    const editBtn = document.createElement('button');
    editBtn.setAttribute('onclick', 'editData(this)');
    editBtn.innerHTML = 'Edit';
    editBtn.className = 'btn btn-success';
    action.append(delBtn, editBtn);
    tr.append(action);
    tbody.append(tr);
  });
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (
    event.target.firstname.value.trim() &&
    event.target.lastname.value.trim()
  ) {
    addFlag ? addData(event) : applyChange(event, targetData);
  }
});

function addData(event) {
  arr.push({
    firstname: event.target.firstname.value,
    lastname: event.target.lastname.value,
    id: Date.now(),
    isChecked: false,
  });
  console.log(arr);
  createRow(arr);
  form.reset();
}

checkboxInput.addEventListener('change', (event) => {
  console.log(event.target.checked);
  if (event.target.checked === true) {
    arr.forEach((item) => {
      item.isChecked = true;
    });
  } else {
    arr.forEach((item) => {
      item.isChecked = false;
    });
  }
  createRow(arr);
});

deleteBtn.addEventListener('click', (event) => {
  arr = arr.filter((item) => item.isChecked === false);
  createRow(arr);
  checkboxInput.checked = false;
});

function selectData(e) {
  const targetId = +e.closest('tr').dataset.id;
  if (e.checked === true) {
    arr.forEach((item) => {
      return targetId === item.id ? (item.isChecked = true) : item;
    });
  } else {
    arr.forEach((item) => {
      return targetId === item.id ? (item.isChecked = false) : item;
    });
  }
  console.log(arr);
}
function deleteData(e) {
  const targetId = +e.closest('tr').dataset.id;
  arr = arr.filter((item) => item.id !== targetId);
  createRow(arr);
}

function editData(e) {
  const targetId = +e.closest('tr').dataset.id;
  targetData = arr.find((item) => item.id === targetId);
  form.firstname.value = targetData.firstname;
  form.lastname.value = targetData.lastname;
  form.childNodes[5].innerHTML = 'Edit';
  addFlag = false;
}
function applyChange(event, targetData) {
  arr.forEach((item) => {
    if (item.id === targetData.id) {
      item.firstname = event.target.firstname.value;
      item.lastname = event.target.lastname.value;
    }
  });
  event.submitter.innerHTML = 'Add';
  addFlag = true;
  createRow(arr);
  form.reset();
}

