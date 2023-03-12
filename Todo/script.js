const form = document.getElementById('form');
const deleteBtn = document.getElementById('btn-del');
const checkboxInput = document.getElementById('checkbox-input');
const tbody = document.getElementById('tbody');
let BASE_URL = 'http://localhost:3000';
let targetData = {};
let addFlag = true;
let active;
let arr = getData(BASE_URL, 'users');

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

arr.then((response) => createRow(response));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (
    event.target.firstname.value.trim() &&
    event.target.lastname.value.trim()
  ) {
    addFlag ? addData(event) : applyChange(event);
  }
});

function addData(event) {
  let data = {
    firstname: event.target.firstname.value,
    lastname: event.target.lastname.value,
    id: Date.now(),
    isChecked: false,
  };
  arr.then((response) => {
    response.push(data);
    createRow(response);
  });
  sendData(BASE_URL, 'users', data);
  form.reset();
  console.log(arr.then((response) => console.log(response)));
}

checkboxInput.addEventListener('change', (event) => {
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
  deleteItem(BASE_URL, 'users', targetId);
  arr = arr.then((renponse) => {
    return renponse.filter((item) => item.id !== targetId);
  });
  arr.then((response) => createRow(response));
}

function editData(e) {
  active = +e.closest('tr').dataset.id;
  arr
    .then((response) => {
      return response.find((item) => item.id === active);
    })
    .then((renponse) => {
      form.firstname.value = renponse.firstname;
      form.lastname.value = renponse.lastname;
    });
  form.childNodes[5].innerHTML = 'Edit';
  addFlag = false;
}
function applyChange(event) {
  arr.then((response) => {
    response.forEach((item) => {
      if (item.id === active) {
        item.firstname = event.target.firstname.value;
        item.lastname = event.target.lastname.value;
        Update(BASE_URL, 'users', item);
      }
    });
    createRow(response);
    form.reset();
  });
  event.submitter.innerHTML = 'Add';
  addFlag = true;
}

//api

async function sendData(URL, endpoint, data) {
  try {
    let send = await fetch(`${URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
}

async function getData(URL, endpoint) {
  try {
    let response = await fetch(`${URL}/${endpoint}`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function deleteItem(URL, endpoint, id) {
  try {
    let send = await fetch(`${URL}/${endpoint}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log(error);
  }
}
async function Update(URL, endpoint, item) {
  try {
    let send = await fetch(`${URL}/${endpoint}/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
  } catch (error) {
    console.log(error);
  }
}
