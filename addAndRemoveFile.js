const store = require('./storage');

function fileToStore(file, id) {
  let typeFile = null;
  console.log(file, id);
  if (file.type.includes('image')) {
    typeFile = 'image';
  }
  if (file.type.includes('text')) {
    typeFile = 'text';
  }
  if (file.type.includes('audio')) {
    typeFile = 'audio';
  }
  if (file.type.includes('video')) {
    typeFile = 'video';
  }
  return {
    type: typeFile,
    name: file.name,
    size: file.size,
    idName: id,
    date: new Date().getTime(),
  };
}

function deleteFileInStore(id) {
  let index = null;
  console.log(id);
  store.forEach((elem, i) => {
    if (elem.idName === id) {
      index = i;
    }
  })
  store.splice(index, 1);
}

module.exports = { fileToStore, deleteFileInStore };
