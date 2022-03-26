import { createStore } from '@stencil/store';
export { pageState };

const { state: pageState } = createStore({
  showSidebar: false,
});
