import {
    getOutgoingSequenceflows,
    getIncomingSequenceflows,
    getConnectedElement,
    moreThanOneOutgoingSequenceflows,
    moreThanOneIncomingSequenceflows,
    isGateway
} from '../../util/ValidationUtil'
import { is } from 'bpmn-js/lib/util/ModelUtil';

export default class GatewayMapper {
    
    constructor() {
        this._elementRegistry = {};
        this.waitingSequenceflows = [];
        this.gatewayTree = {};
        this.currentLevel = 0;
        this.round = 0;
    }

    map(elementRegistry) {
        this._elementRegistry = elementRegistry;
        this.waitingSequenceflows = [];
        this.gatewayTree = {};
        this.currentLevel = 0;
        this.round = 0;

        let startElements = this._elementRegistry.filter(element => {
            return is(element, 'bpmn:StartEvent') && element.type !== "label";
        });

        //Stop if less or more than 1 StartEvent
        if (startElements.length != 1) {
            return;
        }

        let startingElement = startElements[0];


        let outgoingFlows = getOutgoingSequenceflows(startingElement);

        //Stop if less or more than 1 Sequenceflow on StartEvent
        if (outgoingFlows.length != 1) {
            return;
        }

        this.waitingSequenceflows.push({
            level: this.currentLevel,
            flow: outgoingFlows[0],
            origin: [{
                id: startingElement.id,
                level: this.currentLevel
            }]
        });


        while (this.waitingSequenceflows.length > 0) {
            let nextFlow = this.waitingSequenceflows[0];
            this.currentLevel = nextFlow.level;
            this._sortGatewayInTree(nextFlow.flow, nextFlow.origin);
            this.round++;
        }


        return this.gatewayTree;
    }

    _moveToNextGatewayOrEndEventFromSequenceflow(startingFlow) {
        let outgoingFlows = [startingFlow];
        while (outgoingFlows.length == 1) {
            let flow = outgoingFlows[0];

            let connectedElement = getConnectedElement(this._elementRegistry, flow);

            if (isGateway(connectedElement)) {
                return {
                    found: true,
                    element: connectedElement,
                    flows: getOutgoingSequenceflows(connectedElement)
                }
            }
            outgoingFlows = getOutgoingSequenceflows(connectedElement);
        }

        return {
            found: false,
        };
    }

    _sortGatewayInTree(outgoingFlow, origin) {
        let gateway = this._moveToNextGatewayOrEndEventFromSequenceflow(outgoingFlow);

        if ((moreThanOneOutgoingSequenceflows(gateway.element) && moreThanOneIncomingSequenceflows(gateway.element))) {
            throw new Error(GatewayMapper.invalidProcessMessage);
        }
        else if ((this._checkIfGatewayIsAlreadyTracked(gateway.element)) ||
            (!gateway.found) ||
            (getOutgoingSequenceflows(gateway.element) == 1 && getIncomingSequenceflows(gateway.element) == 1)) {
            //Just skipping
            this.waitingSequenceflows.shift();
            return;
        } else if (moreThanOneOutgoingSequenceflows(gateway.element)) {
            this._initLevelObject();
            this.gatewayTree[this.currentLevel].splitting.push({
                level: this.currentLevel,
                gateway: gateway.element,
                path: origin
            });
            //get one level higher
            this.currentLevel++;
            this._addWaitingFlows(gateway, origin,  (this.currentLevel - 1));

        } else if (moreThanOneIncomingSequenceflows(gateway.element)) {
            this._initLevelObject();
            //get one level lower
            this.currentLevel--;
            this.gatewayTree[this.currentLevel].joining.push({
                level: this.currentLevel,
                gateway: gateway.element,
                path: origin
            });
            this._addWaitingFlows(gateway, origin, (this.currentLevel + 1));

        }

        this.waitingSequenceflows.shift();

    }

    _initLevelObject() {
        if (!this.gatewayTree[this.currentLevel]) {
            this.gatewayTree[this.currentLevel] = {
                splitting: [],
                joining: [],
                endEvent: []
            };
        }
    }

    _checkIfGatewayIsAlreadyTracked(gateway) {
        for (let level in this.gatewayTree) {
            for (let type in this.gatewayTree[level]) {
                if (type !== 'endEvent') {
                    for (let alreadyTracked of this.gatewayTree[level][type]) {
                        if (alreadyTracked.gateway.id === gateway.id) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    _addWaitingFlows(gateway, origin, level) {
        var newOrigin = origin.slice();
        newOrigin.push({
            id: gateway.element.id,
            level: level
        });
        gateway.flows.forEach(connection => {
            this.waitingSequenceflows.push({
                level: this.currentLevel,
                flow: connection,
                origin: newOrigin
            });
        })
    }
}

GatewayMapper.invalidProcessMessage = 'Fail mapping process!';