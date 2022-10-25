import ValidationModule from '../../core/ValidationModule';

import { validationErrorCodes } from '../../util/ValidationConstants'
import { is } from 'bpmn-js/lib/util/ModelUtil';


export default class NoStartAndEndEventValidation extends ValidationModule {

    constructor(elementRegistry, translate) {
        super()
        this.name = translate('No Start and End Event');
        
        this._elementRegistry = elementRegistry;
        this._translate = translate;
    }

    validate() {

        let startEventElements = this._elementRegistry.filter(element => {
            return is(element, 'bpmn:StartEvent');
        });

        let endEventElements = this._elementRegistry.filter(element => {
            return is(element, 'bpmn:EndEvent');
        });

        //shape + label
        if (startEventElements.length <= 1 || endEventElements.length <= 1) {
            this.addValidationError({
                element: "Process",
                errorType: validationErrorCodes.START_AND_END_EVENT
            });
        }

        return this.errors;;
    }
}
NoStartAndEndEventValidation.$inject = ['elementRegistry', 'translate'];