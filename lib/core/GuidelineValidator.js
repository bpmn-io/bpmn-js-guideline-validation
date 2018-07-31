import { validationEvents } from '../util/ValidationConstants'

export default class GuidelineValidator {
    constructor(
        eventBus,
        keyboard,
        validationModuleController,
        noLabelValidation,
        noStartAndEndEventValidation,
        joiningSplittingGatewaysValidation,
        symmetricModellingValidation,
        useOfParallelGatewayValidation,
        unnecessaryGatewayValidation,
        crossingFlowValidation) {

        const self = this;

        this._eventBus = eventBus;
        this._keyboard = keyboard;
        this._validationModuleController = validationModuleController;
        this._noLabelValidation = noLabelValidation;
        this._noStartAndEndEventValidation = noStartAndEndEventValidation;
        this._joiningSplittingGatewaysValidation = joiningSplittingGatewaysValidation;
        this._symmetricModellingValidation = symmetricModellingValidation;
        this._useOfParallelGatewayValidation = useOfParallelGatewayValidation;
        this._unnecessaryGatewayValidation = unnecessaryGatewayValidation;
        this._crossingFlowValidation = crossingFlowValidation;

        eventBus.on('import.done', function () {
            self._init(self);
        });

    }

    _init(self) {
        this._validationModuleController.addListOfValidationModules([
            self._noLabelValidation,
            self._noStartAndEndEventValidation,
            self._joiningSplittingGatewaysValidation,
            self._symmetricModellingValidation,
            self._useOfParallelGatewayValidation,
            self._unnecessaryGatewayValidation,
            self._crossingFlowValidation
        ]);

        this._eventBus.fire(validationEvents.MODULES_LOADED);

        this._keyboard.addListener(function (key, modifiers) {
            if (key === 76 && self._keyboard.isCmd(modifiers)) {
                self._eventBus.fire(validationEvents.TOGGLE_VALIDATION);
                return true;
            }
        });

        this._eventBus.on('element.changed', () => {
            self._eventBus.fire(validationEvents.STOP_VALIDATION);
        });
    }

}

GuidelineValidator.$inject = [
    'eventBus',
    'keyboard',
    'validationModuleController',
    'noLabelValidation',
    'noStartAndEndEventValidation',
    'joiningSplittingGatewaysValidation',
    'symmetricModellingValidation',
    'useOfParallelGatewayValidation',
    'unnecessaryGatewayValidation',
    'crossingFlowValidation'
];