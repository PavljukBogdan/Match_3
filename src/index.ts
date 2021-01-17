import Model from "./modules/model";
import View from "./modules/view";
import Controller from "./modules/controller";

declare global {
    interface Window {
        model: Model,
        view: View,
        controller: Controller
    }
}

const rooot = document.querySelector('#root');

const model = new Model();
const view = new View(rooot,940,720, model);
const controller = new Controller(model,view);

window.view = view;
window.model = model;
window.controller = controller;