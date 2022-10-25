import ValidationModule from '../../core/ValidationModule';

import { validationErrorCodes, validationHTMLCode } from '../../util/ValidationConstants';
import { moreThanOneIncomingSequenceflows, moreThanOneOutgoingSequenceflows } from '../../util/ValidationUtil';
import { is } from 'bpmn-js/lib/util/ModelUtil';


export default class JoiningSplittingGatewaysValidation extends ValidationModule {

    constructor(elementRegistry, translate) {
        super()
        this.name = translate('Joining Splitting Gateways');

        this._elementRegistry = elementRegistry;
        this._translate = translate;
    }

    validate() {

        let gatewayElements = this._elementRegistry.filter(element => {
            return is(element, 'bpmn:Gateway') && element.type !== "label";
        });

        gatewayElements.forEach(element => {
            if (moreThanOneIncomingSequenceflows(element) && moreThanOneOutgoingSequenceflows(element)) {
                this.addValidationError({
                    element: element,
                    errorType: validationErrorCodes.MULTIPLE_GATEWAY_USE,
                    notification: this._translate('Avoid mixing up splitting and joining of sequence-flows on element:'),
                    html: validationHTMLCode(this._translate).MULTIPLE_GATEWAY_USE_HTML
                });
            }
        });

        return this.errors;;
    }
}
JoiningSplittingGatewaysValidation.$inject = ['elementRegistry', 'translate'];