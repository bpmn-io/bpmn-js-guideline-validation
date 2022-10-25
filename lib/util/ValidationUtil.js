import {
  domify as domify
} from 'min-dom';
import { BASIC_WARN_HTML } from './ValidationConstants'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

export function buildErrorHtml(html) {
  html = BASIC_WARN_HTML + html;
  html += '</div></div>';

  return domify(html);
}

export function extractBuinessName(bpmnName) {
  return bpmnName.replace(/bpmn:/, "");
}

export function moreThanOneOutgoingSequenceflows(element) {
  let flows = getOutgoingSequenceflows(element);
  return flows.length > 1;
}
export function moreThanOneIncomingSequenceflows(element) {
  let flows = getIncomingSequenceflows(element);
  return flows.length > 1;
}

export function getOutgoingSequenceflows(element) {
  return element.outgoing.filter(out => {
    return (out.type === 'bpmn:SequenceFlow');
  })
}

export function getIncomingSequenceflows(element) {
  return element.incoming.filter(incoming => {
    return (incoming.type === 'bpmn:SequenceFlow');
  })
}

export function getConnectedElement(elementRegistry, sequenceflow) {
  let connectedElement = elementRegistry.filter(element => {
    return (element.id === sequenceflow.businessObject.targetRef.id);
  });
  if (connectedElement[0]) {
    return connectedElement[0];
  }
}

export function findElementById(elementRegistry, id) {
  let optionalElement = elementRegistry.filter(element => {
    return (element.id === id);
  })
  if (optionalElement.length != 1) {
    return new Error(`No explicit could be found with id: ${id}`);
  }
  return optionalElement[0];
}

export function isGateway(element) {
  return (element.type !== 'label' &&  
  isAny(element,
    [
        'bpmn:ParallelGateway',
        'bpmn:InclusiveGateway',
        'bpmn:ComplexGateway',
        'bpmn:ExclusiveGateway',
        'bpmn:EventBasedGateway',
        'bpmn:EndEvent'
    ]))
}