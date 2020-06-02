declare module 'vue-promise-btn' {
  import _Vue, { Component, VNode, CreateElement, DirectiveOptions } from 'vue';

  export interface VuePromiseBtnOptions {
    btnLoadingClass?: string;
    spinnerHiddenClass?: string;
    action?: string;
    minTimeout?: number;
    disableBtn?: boolean;
    showSpinner?: boolean;
    autoHideSpinnerWrapper?: boolean;
    loader?: Component | string;
    stringHTMLRenderer?: (options: VuePromiseBtnOptions) => string;
    componentRenderer?: (options: VuePromiseBtnOptions) => (h: CreateElement) => () => VNode;
  }

  export function install(Vue: typeof _Vue, options?: VuePromiseBtnOptions): void;

  export function setupVuePromiseBtn(globalOptions: VuePromiseBtnOptions): DirectiveOptions;
}
