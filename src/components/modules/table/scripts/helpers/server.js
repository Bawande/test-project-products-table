const url = 'https://bawande.github.io/test-project-products-table/data/';

async function getServerAllProducts() {
  const response = await fetch(`${url}dataProducts.json`);
  const data = await response.json();

  return data;
}

async function getServerOptionsDataTable() {
  const response = await fetch(`${url}optionsDataTable.json`);
  const data = await response.json();

  return data;
}

async function getServerOptionsResultTable() {
  const response = await fetch(`${url}optionsResultTable.json`);
  const data = await response.json();

  return data;
}

async function setServerAllProducts(data) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const answer = await response;

  return answer;
}

export {
  getServerAllProducts,
  getServerOptionsDataTable,
  getServerOptionsResultTable,
  setServerAllProducts,
};
