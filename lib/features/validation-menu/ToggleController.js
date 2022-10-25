import { domify, event as domEvent } from 'min-dom';
import { validationEvents } from '../../util/ValidationConstants';

export default class ValidationMenu {
    
    constructor(eventBus, canvas, selection, validationModuleController, translate) {
        const self = this;

        this._eventBus = eventBus;
        this._canvas = canvas;
        this._selection = selection;
        this._validationModuleController = validationModuleController;
        this._translate = translate;

        this.enabled = false;


        this._eventBus.on(validationEvents.MODULES_LOADED, this._init.bind(self));

        eventBus.on(validationEvents.TOGGLE_VALIDATION, self.toggleMode.bind(self));
        eventBus.on(validationEvents.START_VALIDATION, self.startMode.bind(self));
        eventBus.on(validationEvents.STOP_VALIDATION, self.stopMode.bind(self));

        this._eventBus.on('import.parse.start', this._removeButton.bind(self));

    }

    _init() {
        this.container = domify(`
          <div class="toggle-validation">
            ${this._translate('Guideline Validation')} <span class="toggle"><i class="gv-toggle-off"></i></span>
          </div>
        `);

        domEvent.bind(this.container, 'click', this.toggleMode.bind(this));

        this._canvas.getContainer().appendChild(this.container);
    };

    toggleMode() {
        if (this.enabled) {
            this._eventBus.fire(validationEvents.STOP_VALIDATION)
        } else {
            this._eventBus.fire(validationEvents.START_VALIDATION)
        }
    }

    stopMode() {
        this.container.style.backgroundColor = '#FAFAFA';
        this.container.style.color = '#000';
        this._validationModuleController.stopValidation();
        this.enabled = false;
    }

    startMode() {

        var isError = this._validationModuleController.startValidation();

        if (isError) {
            this.container.style.backgroundColor = '#B5152B';
            this.container.style.color = '#FFF';
        } else {
            this.container.style.backgroundColor = '#07fc24';
        }
        this.enabled = true;
    }

    _removeButton() {
        if (this.container) {
            this.container.remove();
            this.enabled = false;
        }
    }

}


ValidationMenu.$inject = ['eventBus', 'canvas', 'selection', 'validationModuleController', 'translate']