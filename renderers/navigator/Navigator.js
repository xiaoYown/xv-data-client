const { ipcRenderer } = require('electron');

const classActive = 's-active';
const classItem = 'm-navigator-item';

const closeView = id => {
  ipcRenderer.send('close-view', { id });
}

const switchView = id => {
  ipcRenderer.send('switch-view', { id });
}

const createCloseItem = (id, { remove }) => {
  const el = document.createElement('span');
  el.setAttribute('class', 'm-close');
  el.innerText = '×';
  el.setAttribute('data-id', id);

  el.addEventListener('click', e => {
    e.stopPropagation();
    remove(e.target.getAttribute('data-id'));
  });
  return el;
}

const createItem = ({ name, id }, { remove, to }) => {
  const el = document.createElement('li');
  el.innerText = name || '未知文件';
  el.setAttribute('class', classItem);
  el.appendChild(createCloseItem(id, { remove }));
  el.setAttribute('id', id);

  el.addEventListener('click', e => {
    to(e.target.getAttribute('id'));
  });

  return el;
}

class Navigator {
  constructor () {
    this.root = document.getElementById('navigator');
  }
  paths = []
  setActive = id => {
    const oldActiveItem = this.root.querySelector(`.${classActive}`);
    if (oldActiveItem) {
      oldActiveItem.setAttribute('class', classItem);
    }
    const activeItem = document.getElementById(`${id}`);
    activeItem.setAttribute('class', `${classItem} ${classActive}`);
  }
  push = (options) => {
    this.paths.push(options);
    const el = createItem(options, {
      remove: this.remove,
      to: this.to
    });
    el.setAttribute('class', `${classItem} ${classActive}`);
    this.root.appendChild(el);

    this.setActive(options.id);
  }
  remove = (id) => {
    const index = this.paths.findIndex(item => item.id === id);
    const child = document.getElementById(`${id}`);
    this.paths.splice(index, 1);
    this.root.removeChild(child);
    closeView(id);
  }
  to = (id) => {
    switchView(id);
    this.setActive(id);
  }
}

module.exports = Navigator;