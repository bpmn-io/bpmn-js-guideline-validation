import ValidationModule from '../../core/ValidationModule';

import { validationErrorCodes, validationHTMLCode } from '../../util/ValidationConstants';
import { findElementById } from '../../util/ValidationUtil';
import GatewayMapper from './GatewayMapper';

export default class SymmetricModellingValidation extends ValidationModule {
    
    constructor(elementRegistry, translate) {
        super()
        this.name = translate('Symmetric Modelling');

        this._elementRegistry = elementRegistry;
        this._translate = translate;
        this._gatewayMapper = new GatewayMapper();
    }

    validate() {
        let mappedProcess;

        try {
            mappedProcess = this._gatewayMapper.map(this._elementRegistry);
        } catch (error) {
            //Just ignoring mapping errors
        }

        if (mappedProcess) {
            for (let level in mappedProcess) {
                let pairs = this._generateLevelPairs(mappedProcess[level]);
                this._checkPairs(pairs);
            }
        }

        return this.errors;
    }

    _generateLevelPairs(levelElements) {
        let pairs = [];

        levelElements.joining.forEach(join => {
            pairs.push(this._getSplittingGatewayFor(join));
        });

        return pairs;
    }

    _getSplittingGatewayFor(joiningGateway) {
        let lastWaypointIndex = joiningGateway.path.length - 1;

        for (lastWaypointIndex; lastWaypointIndex >= 0; lastWaypointIndex--) {
            let element = joiningGateway.path[lastWaypointIndex];
            if (element.level === joiningGateway.level) {
                return {
                    split: findElementById(this._elementRegistry, element.id),
                    join: joiningGateway.gateway
                };
            }
        }

    }

    _checkPairs(pairs) {
        pairs.forEach(pair => {
            let splitGateway = pair.split;
            let joinGateway = pair.join;
            if (joinGateway.type !== splitGateway.type) {
                let alreadyTracker = false;
                this.errors.forEach(alreadyError => {
                    alreadyTracker = alreadyError.element.id === joinGateway.id
                });
                if (!alreadyTracker) {
                    this.addValidationError({
                        element: joinGateway,
                        errorType: validationErrorCodes.SYMMETRIC_MODELING,
                        notification: this._translate('Wrong closing gateway on element:'),
                        html: validationHTMLCode(this._translate).SYMMETRIC_MODELING_HTML
                    });
                }
            }
        })
    }



}
SymmetricModellingValidation.$inject = ['elementRegistry', 'translate'];