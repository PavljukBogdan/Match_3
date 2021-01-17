import Model from "./modules/model";
import View from "./modules/view";

declare global {
    interface Window {
        model: Model,
        view: View
    }
}

const rooot = document.querySelector('#root');

const model = new Model();
const view = new View(rooot,940,720, model);