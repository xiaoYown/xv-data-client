const createItem = ({ name, view }) => {
  return new Object({
    id: Date.now().toString(),
    name,
    view
  });
}

class Navigator {
  views = []
  getAllViews = () => {
    return this.views;
  }
  push = (options) => {
    let view = createItem(options);
    this.views.push(view);
    return view;
  }
  remove = (id) => {
    const index = this.views.findIndex(item => item.id === id);
    this.views.splice(index, 1);
  }
}

module.exports = () => {
  return new Navigator();
};