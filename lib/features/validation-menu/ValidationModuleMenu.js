import { validationEvents } from '../../util/ValidationConstants';
import { domify, query as domQuery, event as domEvent } from 'min-dom';


export default class ValidationModuleMenu {
    
    constructor(validationModuleController, eventBus, canvas, translate) {
        const self = this;

        this._validationModuleController = validationModuleController;
        this._eventBus = eventBus;
        this._canvas = canvas;
        this._translate = translate;

        this.observedModules = [];
        this.shown = false;
      
        //needed workaround on checkboxes
        this.toggleCount = 0;



        this._eventBus.on(validationEvents.MODULES_LOADED, () => {
            self._init(self);
        });

        this._eventBus.on(validationEvents.START_VALIDATION, this._closeMenu.bind(self));

        this._eventBus.on('import.parse.start', this._removeMenu.bind(self));

    }

    _init(self) {
        this.menuButtonContainer = domify(
            `<div class="sgv-menu-button-container">
                <img id="setting-icon" class="sgv-warn-icon" alt="sytleguide settings" src="icon/settings_black.svg"></img>
            </div>`);
        this._canvas.getContainer().appendChild(this.menuButtonContainer);

        this.settingButton = domQuery('#setting-icon', this.menuButtonContainer);

        domEvent.bind(this.menuButtonContainer, 'click', this._toggleMenu.bind(this));

        this.menuContainer = domify(
            `<div class="sgv-menu-container"><span class="validation-menu">${this._translate('Choose your modules:')}</span><hr></div>`);
        this._canvas.getContainer().appendChild(this.menuContainer);

        this.observedModules = this._validationModuleController.getListOfModules();

        this.observedModules.forEach((module) => {
            let moduleHtml = domify(
                `<div><label class="sgv-menu-checkbox-container">${module.name}
                    <input type="checkbox" checked="checked">
                    <span class="sgv-menu-checkmark"></span>
                </label></div>`);

            self.menuContainer.appendChild(moduleHtml);
            domEvent.bind(moduleHtml, 'click', this._toggleModuleSubscribtion.bind(this, module));
        })
    }

    _toggleModuleSubscribtion(module) {
        this.toggleCount++;
        if (this.toggleCount == 2) {
            this._validationModuleController.toggleValidationModuleSubscribtion(module);
            this.toggleCount = 0;
        }
    }

    _toggleMenu() {
        if (this.shown) {
            this._closeMenu();
        } else {
            this._eventBus.fire(validationEvents.STOP_VALIDATION);
            this.menuButtonContainer.style.backgroundColor = '#B5152B';
            this.settingButton.src = 'icon/settings_white.svg';
            this.menuContainer.style.display = 'inline';
            this.shown = true;
        }
    }

    _closeMenu() {
        this.menuButtonContainer.style.backgroundColor = '#FAFAFA';
        this.settingButton.src = 'icon/settings_black.svg';
        this.menuContainer.style.display = 'none';
        this.shown = false;
    }

    _removeMenu() {
        if (this.menuButtonContainer) {
            this.menuButtonContainer.remove();
        }
        if (this.menuContainer) {
            this.menuContainer.remove();
        }
    }
}

ValidationModuleMenu.$inject = [
    'validationModuleController',
    'eventBus',
    'canvas',
    'translate'
]