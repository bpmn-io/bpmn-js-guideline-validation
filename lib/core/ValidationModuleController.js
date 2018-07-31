import { buildErrorHtml } from '../util/ValidationUtil'
import { validationErrorCodes, validationEvents } from '../util/ValidationConstants'

export default class ValidationModuleController {

  constructor(overlays, eventBus) {
    this._overlays = overlays;
    this._eventBus = eventBus;
    this.observedModules = [];
    this.currentValidationErrors = [];
    this.currentOverlayIds = [];

    this.bottomOffSet = 10;
    this.leftOffSet = -15;

  }

  getListOfModules() {
    return this.observedModules;
  }

  addListOfValidationModules(moduleList) {
    moduleList.forEach((module) => {
      this._addValidationModule(module);
    });
  }

  toggleValidationModuleSubscribtion(toggledModule) {
    let subscribed = false;

    this.observedModules.forEach((module) => {
      if (module === toggledModule) {
        subscribed = true;
      }
    });

    subscribed ?
      this._removeValidationModule(toggledModule) :
      this._addValidationModule(toggledModule)

  }

  startValidation() {
    this.observedModules.forEach((validationModule) => {
      this.currentValidationErrors.push(...validationModule.validate());
    });

    this._eventBus.fire(validationEvents.FINISH_VALIDATION, {
      currentErrors: this.currentValidationErrors
    });
    this._showValidationErrors();
    return this.currentValidationErrors.length > 0;
  }

  stopValidation() {
    this.currentOverlayIds.forEach(id => {
      this._overlays.remove(id);
    });
    this._resetState();
  }

  _addValidationModule(module) {
    if (!this.observedModules.includes(module)) {
      this.observedModules.push(module);
    }
  }

  _removeValidationModule(moduleToRemove) {
    this.observedModules = this.observedModules.filter((module) => module !== moduleToRemove);
  }

  _showValidationErrors() {
    this.currentValidationErrors.forEach(error => {
      if (validationErrorCodes.hasOwnProperty(error.errorType) &&
        error.errorType !== validationErrorCodes.START_AND_END_EVENT) {
        var html = buildErrorHtml(error.html);
        var overlayId = this._overlays.add(error.element, 'sgv-warn', {
          position: {
            bottom: this.bottomOffSet,
            left: this.leftOffSet
          },
          html
        });

        this.currentOverlayIds.push(overlayId);
      }
    });
  }

  _resetState() {
    this.currentOverlayIds = [];
    this.currentValidationErrors = [];
    this.observedModules.forEach(validationModule => validationModule.reset());
  }
}

ValidationModuleController.$inject = ['overlays', 'eventBus'];